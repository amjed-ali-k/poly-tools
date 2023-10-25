import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { getUserId } from "@/components/auth/server";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId)
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const results = await prisma.subject.findMany();

  return NextResponse.json(results);
}
