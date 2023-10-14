import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { Branch, Student } from "@prisma/client";
import { getUserId } from "@/components/auth/server";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const results = await prisma.batch.findMany({
    where: {
      createdById: userId,
    },
    select: {
      id: true,
      branch: true,
      students: true,
      name: true,
      status: false,
      passoutYear: true,
    },
  });

  return NextResponse.json(results);
}

export type BatchesListApiResponse = {
  id: string;
  branch: Branch;
  students: Student[];
  name: string;
  status: string;
  passoutYear: number;
};
