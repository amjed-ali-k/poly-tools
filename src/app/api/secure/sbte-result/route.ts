import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/server/auth/server";
import { prisma } from "@/server/db/prisma";
import { ExamType } from "@prisma/client";

const allowedMonths = ["April", "November"];
const allowedGrades = [
  "F",
  "E",
  "D",
  "C",
  "B",
  "A",
  "S",
  "Absent",
  "Withheld",
  "Malpractice",
  null,
];

const schema = z.object({
  month: z.string().refine((val) => {
    return allowedMonths.includes(val);
  }),
  year: z
    .string()
    .regex(/^[0-9]{4}$/)
    .transform((e) => parseInt(e)),
  data: z.array(
    z.object({
      registerNo: z.number().transform((e) => e.toString()),
      studentName: z.string(),
      branch: z.string(),
      semester: z.number(),
      examType: z
        .string()
        .refine((e) => {
          return e === "Regular" || e === "Supplementary";
        })
        .transform((e) => {
          return e === "Regular" ? ExamType.REGULAR : ExamType.SUPPLEMENTARY;
        }),
      grades: z.record(
        z.object({
          name: z.string(),
          internal: z.number(),
          grade: z
            .string()
            .nullable()
            .refine((e) => allowedGrades.includes(e)),
        }),
      ),
      cgpa: z
        .string()
        .optional()
        .transform((e) => (e ? parseFloat(e) : undefined)),
    }),
  ),
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());

  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 },
    );
  }

  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const myProfile = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const branches = await prisma.branch.findMany({});

  const unfullfilledPromises = body.data.data.map(async (e) => {
    await prisma.examResult.create({
      data: {
        student: {
          connectOrCreate: {
            where: {
              registerNo: e.registerNo,
            },
            create: {
              collegeId: myProfile?.collegeId as string,
              name: e.studentName,
              registerNo: e.registerNo,
              branchId: branches.find((k) => k.name === e.branch)?.id as string,
            },
          },
        },
        month: body.data.month,
        year: body.data.year,
        type: e.examType,
        semester: e.semester,
        sgpa: e.cgpa,
        createdBy: {
          connect: {
            id: session.user.id,
          },
        },
        marks: {
          create: Object.entries(e.grades).map(([subject, values]) => {
            return {
              subject: {
                connect: {
                  code: subject,
                },
              },
              grade: values.grade || "Null",
              internal: values.internal.toString(),
            };
          }),
        },
      },
      include: {
        marks: true,
        student: true,
      },
    });
  });
  await Promise.all(unfullfilledPromises);
  return NextResponse.json({ success: true, now: Date.now() });
}
