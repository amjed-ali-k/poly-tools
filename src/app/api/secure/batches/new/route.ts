import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getServerAuthSession } from "@/server/auth/server";
import { z } from "zod";
import { Branch, Student } from "@prisma/client";

const schema = z.object({
  name: z.string().min(5, "Minimum 5 characters required").nonempty("Required"),
  passoutYear: z
    .string()
    .regex(/^\d{4}$/)
    .nonempty("Required")
    .transform((value) => parseInt(value)),
  college: z.string().nonempty(),
  branch: z.string().nonempty(),
});

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }
  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

    const res = await prisma.batch.create({
        data: {
            name: body.data.name,
            passoutYear: body.data.passoutYear,
            college: {
                connect: {
                    id: body.data.college,
                }
            },
            branch: {
                connect: {
                    code: body.data.branch,
                }
            }
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
