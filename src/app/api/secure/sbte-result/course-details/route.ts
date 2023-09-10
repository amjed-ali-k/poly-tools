import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export type CourseType = {
  category: string | null;
  code: string;
  credits: number | null;
  evalMode: string | null;
  key: string;
  program: string[];
  scheme: string;
  semester: string | null;
  title: string;
  totalMarks: number;
  type: string;
};

const schema = z.object({
  courses: z.array(z.string().max(7).min(4)).min(1),
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

  const results = await prisma.subject.findMany({
    where: {
      code: { in: body.data.courses },
    },
    select: {
      code: true,
      name: true,
      credits: true,
    },
  });

  // const unresolvedPromises = body.data.courses.map(async (e) => {

  //     const res = (await coursesDb.get(
  //       `REV2021-${e}`
  //     )) as unknown as CourseType | null;
  //     res && results.push(res);
  //     if (!res) {
  //       const newRes = (await coursesDb.get(
  //         `REV2015-${e}`
  //       )) as unknown as CourseType | null;
  //       newRes && results.push(newRes);
  //     }
  //   });

  return NextResponse.json(results);
}

export type CourseDetailsApiRes = {
  code: string;
  name: string;
  credits: number | null;
}[];
