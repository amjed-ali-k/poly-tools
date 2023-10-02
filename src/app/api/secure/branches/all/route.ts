import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getServerAuthSession } from "@/server/auth/server";
import { z } from "zod";
import { Branch, Student } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

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
