import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { ExamType, Prisma } from "@prisma/client";
import { counting, sift } from "radash";
import { getUserId } from "@/components/auth/server";

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

  const myProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const branches = await prisma.branch.findMany({});

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

  const subCodes = (
    await prisma.subject.findMany({
      select: {
        code: true,
      },
    })
  ).map((e) => e.code);

  const unfullfilledPromises = body.data.data.map(async (e) => {
    // check whether exam result already exists for the given month and year
    const examResult = await prisma.examResult.findFirst({
      where: {
        month: body.data.month,
        year: body.data.year,
        studentRegNo: e.registerNo,
      },
      include: {
        marks: true,
      },
    });

    // if exam result already exists, update it. else create a new one
    // also update existing marks

    if (examResult) {
      await prisma.examResult.update({
        where: {
          id: examResult.id,
        },
        data: {
          sgpa: e.cgpa,
          marks: {
            update: sift(
              Object.entries(e.grades).map(([_code, values]) => {
                const code = cleanSubCode(_code);
                if (!subCodes.includes(code)) return null;
                return {
                  where: {
                    id: examResult.marks.find((k) => k.subjectCode === code)
                      ?.id,
                  },
                  data: {
                    grade: values.grade,
                    internal: values.internal.toString(),
                  },
                };
              })
            ),
          },
        },
      });

      return;
    }
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
            id: userId,
          },
        },
        marks: {
          create: sift(
            Object.entries(e.grades).map(([_code, values]) => {
              const code = cleanSubCode(_code);
              if (!subCodes.includes(code)) return null;
              return {
                subject: {
                  connect: {
                    code,
                  },
                },

                grade: values.grade || "Null",
                internal: values.internal.toString(),
              };
            })
          ),
        },
      },
    });
  });
  await Promise.all(unfullfilledPromises);
  return NextResponse.json({ success: true, now: Date.now() });
}

function cleanSubCode(code: string) {
  // remove all alphabets
  return code.replace(/[a-zA-Z]/g, "");
}
