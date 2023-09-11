import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getServerAuthSession } from "@/server/auth/server";

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const results = await prisma.examResultFormatHistory.findMany({
    where: {
      createdById: session.user.id,
    },
    select: {
      id: true,
      semesters: true,
      regularResultCount: true,
      supplementaryResultCount: true,
      data: false,
      month: true,
      year: true,
      createdAt: true,
    },
  });

  return NextResponse.json(results);
}

export type ExamResultHistoryApiType = {
  id: string;
  semsters: {
    [key: string]: number;
  };
  regularResultCount: number;
  supplementaryResultCount: number;
  month: string;
  year: number;
  createdAt: string;
}[];
