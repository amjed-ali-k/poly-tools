import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getServerAuthSession } from "@/server/auth/server";
import { z } from "zod";
import { FormattedType } from "@/app/lib/resultSorter/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const results = await prisma.examResultFormatHistory.findUnique({
    where: {
      id: params.resultId,
    },
  });

  return NextResponse.json(results);
}

export type ExamResultSingleApiType = {
  id: string;
  data: FormattedType[];
  createdById: string;
  semesters: {
    [key: string]: number;
  };
  regularResultCount: number;
  supplementaryResultCount: number;
  month: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
};
