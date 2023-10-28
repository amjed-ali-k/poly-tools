import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserId } from "@/components/auth/server";

const schema = z.object({
  name: z.string().min(3, "Minimum 3 characters required"),
  students: z
    .array(
      z.object({
        name: z.string().optional(),
        primaryNumber: z.string(),
        rollNumber: z.string().optional(),
        regNumber: z.string().optional(),
        admnNumber: z.string().optional(),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
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

  const results = await prisma.studentBatchForExam.create({
    data: {
      name: body.data.name,
      students: body.data.students,
      createdById: userId,
      studentsCount: body.data.students.length,
    },
  });

  return NextResponse.json(results);
}

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Minimum 3 characters required"),
  students: z
    .array(
      z.object({
        name: z.string().optional(),
        primaryNumber: z.string(),
        rollNumber: z.string().optional(),
        regNumber: z.string().optional(),
        admnNumber: z.string().optional(),
      })
    )
    .min(1),
});

export async function PUT(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const body = updateSchema.safeParse(await request.json());
  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }

  const batch = await prisma.studentBatchForExam.findUnique({
    where: {
      id: body.data.id,
    },
  });

  if (!batch)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  if (batch.createdById !== userId)
    return NextResponse.json(
      { message: "You are not authorized to update this batch" },
      { status: 401 }
    );

  const results = await prisma.studentBatchForExam.update({
    where: {
      id: body.data.id,
    },
    data: {
      name: body.data.name,
      students: body.data.students,
      studentsCount: body.data.students.length,
    },
  });

  return NextResponse.json(results);
}

const deleteSchema = z.object({
  id: z.string(),
});

export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const body = deleteSchema.safeParse(await request.json());
  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }

  const results = await prisma.studentBatchForExam.delete({
    where: {
      id: body.data.id,
    },
  });

  return NextResponse.json(results);
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  const result = await prisma.studentBatchForExam.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    return NextResponse.json({ message: "Batch not found" }, { status: 404 });
  }

  if (result?.createdById !== userId) {
    return NextResponse.json(
      { message: "You are not authorized to view this batch" },
      { status: 401 }
    );
  }

  return NextResponse.json(result);
}
