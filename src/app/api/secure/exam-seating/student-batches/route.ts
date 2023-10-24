import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserId } from "@/components/auth/server";

enum SeatType {
  THEORY,
  DRAWING,
  COMMON,
  BLANK,
}

const schema = z.object({
  name: z.string(),
  structure: z
    .array(
      z
        .array(
          z.object({
            name: z.string(),
            seatCount: z.number().positive(),
            structure: z.array(z.number().nonnegative()),
          })
        )
        .min(1)
    )
    .min(1),
});

export async function PUT(request: NextRequest) {
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

  const results = await prisma.examHall.create({
    data: {
      name: body.data.name,
      structure: body.data.structure,
      createdById: userId,
      theoryOnlySeats: getCount(body.data.structure, SeatType.THEORY),
      drawingOnlySeats: getCount(body.data.structure, SeatType.DRAWING),
      commonSeats: getCount(body.data.structure, SeatType.COMMON),
    },
  });

  return NextResponse.json(results);
}

export type SeatObjectType = {
  name: string;
  seatCount: number;
  structure: SeatType[];
};

function getCount(structure: SeatObjectType[][], type: SeatType) {
  return structure.reduce((acc, curr) => {
    return (
      acc +
      curr.reduce((acc, curr) => {
        return (
          acc +
          curr.structure.reduce((acc, curr) => {
            return curr === type ? (acc += 1) : acc;
          }, 0)
        );
      }, 0)
    );
  }, 0);
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
