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

const updateSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
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

  const body = updateSchema.safeParse(await request.json());
  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }

  const hall = await prisma.examHall.findUnique({
    where: {
      id: body.data.id,
    },
  });

  if (!hall) {
    return NextResponse.json({ message: "Hall not found" }, { status: 404 });
  }

  if (hall.createdById !== userId) {
    return NextResponse.json(
      { message: "You are not authorized to update this hall" },
      { status: 401 }
    );
  }

  const results = await prisma.examHall.update({
    where: {
      id: body.data.id,
    },
    data: {
      name: body.data.name,
      structure: body.data.structure,
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

  const results = await prisma.examHall.delete({
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

  const result = await prisma.examHall.findUnique({
    where: {
      id: id,
    },
  });

  if (!result) {
    return NextResponse.json({ message: "Hall not found" }, { status: 404 });
  }

  if (result?.createdById !== userId) {
    return NextResponse.json(
      { message: "You are not authorized to view this hall" },
      { status: 401 }
    );
  }

  return NextResponse.json(result);
}
