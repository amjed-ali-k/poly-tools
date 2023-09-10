import { prisma } from "@/server/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await prisma.college.findMany({});
  return NextResponse.json(res);
}
