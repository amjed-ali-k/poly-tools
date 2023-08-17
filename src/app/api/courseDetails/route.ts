import { NextApiRequest, NextApiResponse } from "next";
import { Deta } from "deta";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const coursesDb = deta.Base("coursesDB");

type CourseType = {
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
      { status: 400 }
    );
  }
  const results: CourseType[] = [];
  const unresolvedPromises = body.data.courses.map(async (e) => {
    const res = (await coursesDb.get(
      `REV2021-${e}`
    )) as unknown as CourseType | null;
    res && results.push(res);
    if (!res) {
      const newRes = (await coursesDb.get(
        `REV2015-${e}`
      )) as unknown as CourseType | null;
      newRes && results.push(newRes);
    }
  });
  await Promise.all(unresolvedPromises);

  return NextResponse.json(results);
}
