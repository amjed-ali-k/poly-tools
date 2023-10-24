import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { SeatType } from "@/app/dashboard/tools/exam-seating/new-class/_components/newClass";
import { getUserId } from "@/components/auth/server";

const schema = z.object({
  name: z.string(),
  structure: z
    .array(
      z
        .array(
          z.object({
            name: z.string(),
            seatCount: z.number().positive(),
            structure: z.array(z.number().positive()),
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
      theoryOnlySeats: body.data.structure.reduce((acc, curr) => {
        return (
          acc +
          curr.reduce((acc, curr) => {
            return (
              acc +
              curr.structure.reduce((acc, curr) => {
                return curr === SeatType.THEORY ? acc++ : acc;
              }, 0)
            );
          }, 0)
        );
      }, 0),
      drawingOnlySeats: body.data.structure.reduce((acc, curr) => {
        return (
          acc +
          curr.reduce((acc, curr) => {
            return (
              acc +
              curr.structure.reduce((acc, curr) => {
                return curr === SeatType.DRAWING ? acc++ : acc;
              }, 0)
            );
          }, 0)
        );
      }, 0),
      commonSeats: body.data.structure.reduce((acc, curr) => {
        return (
          acc +
          curr.reduce((acc, curr) => {
            return (
              acc +
              curr.structure.reduce((acc, curr) => {
                return curr === SeatType.COMMON ? acc++ : acc;
              }, 0)
            );
          }, 0)
        );
      }, 0),
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
