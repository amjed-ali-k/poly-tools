import { NextApiRequest, NextApiResponse } from "next";
import { Deta } from "deta";
// e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`

import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const deta = Deta(process.env.DETA_PROJECT_KEY);
const statsDb = deta.Base("stats");
const statsAll = deta.Base("statsAll");

const schema = z.object({
  totalStudents: z.number(),
  totalSupplimentry: z.number(),
  totalRegular: z.number(),
  fileName: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  const body = schema.safeParse(await request.json());

  if (!body.success) {
    const { errors } = body.error;
    statsAll.update(
      {
        errors: statsAll.util.increment(1),
      },
      "primary"
    );

    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 }
    );
  }

  statsDb.put({
    key: new Date().toISOString(),
    ...body.data,
  });

  statsAll.update(
    {
      successOperations: statsAll.util.increment(1),
      totalStudents: statsAll.util.increment(body.data.totalStudents),
      totalSupplimentry: statsAll.util.increment(body.data.totalSupplimentry),
      totalRegular: statsAll.util.increment(body.data.totalRegular),
    },
    "primary"
  );

  return NextResponse.json({ success: true, now: Date.now() });
}
