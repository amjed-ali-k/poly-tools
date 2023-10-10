import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { College, User } from "@prisma/client";
import { getUserId } from "@/components/auth/server";

const schema = z.object({
  phone: z
    .string()
    .min(1)
    .regex(/^[0-9]{10}$/),
  bio: z.string().optional(),
  name: z.string().min(1),
  college: z.string().min(1),
  image: z.string().url().optional(),
  designation: z.string().min(1),
});

export async function PUT(request: NextRequest) {
  // get session

  const body = schema.safeParse(await request.json());

  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }
  const userId = await getUserId(request);

  const res = await prisma.user.upsert({
    where: {
      id: userId,
    },
    create: {
      id: userId,
      phone: body.data.phone,
      bio: body.data.bio,
      name: body.data.name,
      collegeId: body.data.college,
      image: body.data.image,
      designation: body.data.designation,
    },
    update: {
      phone: body.data.phone,
      bio: body.data.bio,
      name: body.data.name,
      collegeId: body.data.college,
      image: body.data.image,
      designation: body.data.designation,
    },
  });

  return NextResponse.json({ success: true, now: Date.now(), res });
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  const res = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      college: true,
    },
  });

  return NextResponse.json({ ...res });
}

export type ProfileApiResponse = User & {
  college: College;
};
