import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await prisma.college.findMany({});
  return NextResponse.json(res);
}
