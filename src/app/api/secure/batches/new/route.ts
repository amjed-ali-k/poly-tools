import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { z } from "zod";
import { Branch, Student } from "@prisma/client";
import { getUserId } from "@/components/auth/server";

const schema = z.object({
  name: z.string().min(5, "Minimum 5 characters required").min(1),
  passoutYear: z
    .string()
    .regex(/^\d{4}$/)
    .min(1)
    .transform((value) => parseInt(value)),
  college: z.string().min(1),
  branch: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }

  const res = await prisma.batch.create({
    data: {
      name: body.data.name,
      passoutYear: body.data.passoutYear,
      college: {
        connect: {
          id: body.data.college,
        },
      },
      branch: {
        connect: {
          code: body.data.branch,
        },
      },
    },
  });

  return NextResponse.json(res);
}

export type BatchesListApiResponse = {
  id: string;
  branch: Branch;
  students: Student[];
  name: string;
  status: string;
  passoutYear: number;
};
