import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserId } from "@/components/auth/server";

export async function GET(request: NextRequest) {
  const userId = await getUserId();

  const results = await prisma.branch.findMany({
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  return NextResponse.json(results);
}

export type BranchListApiResponse = {
  id: string;
  name: string;
  code: string;
};
