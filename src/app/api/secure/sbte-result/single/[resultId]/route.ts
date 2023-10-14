import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { FormattedType } from "@/app/lib/resultSorter/types";
import { getUserId } from "@/components/auth/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { resultId: string } }
) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

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
