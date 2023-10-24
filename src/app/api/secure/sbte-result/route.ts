import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { Prisma } from "@prisma/client";
import { counting, sift } from "radash";
import { getUserId } from "@/components/auth/server";

enum ExamType {
  REGULAR,
  SUPPLEMENTARY,
}

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
        })
      ),
      cgpa: z.string().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const body = schema.safeParse(await request.json());

  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  await prisma.examResultFormatHistory.create({
    data: {
      month: body.data.month,
      year: body.data.year,
      data: body.data.data as Prisma.JsonArray,
      semesters: counting(
        body.data.data.map((e) => e.semester),
        (a) => a
      ) as Prisma.JsonObject,
      regularResultCount: body.data.data.filter(
        (e) => e.examType === ExamType.REGULAR
      ).length,
      supplementaryResultCount: body.data.data.filter(
        (e) => e.examType === ExamType.SUPPLEMENTARY
      ).length,
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return NextResponse.json({ success: true, now: Date.now() });
}

function cleanSubCode(code: string) {
  // remove all alphabets
  return code.replace(/[a-zA-Z]/g, "");
}
