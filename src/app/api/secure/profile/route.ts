import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/server/auth/server";
import { prisma } from "@/server/db/prisma";
import { College, User, UserLink } from "@prisma/client";

const schema = z.object({
  phone: z
    .string()
    .nonempty()
    .regex(/^[0-9]{10}$/),
  bio: z.string().optional(),
  name: z.string().nonempty(),
  college: z.string().nonempty(),
  image: z.string().url().optional(),
  designation: z.string().nonempty(),
  links: z
    .object({
      instagram: z.string().url(),
      linkedin: z.string().url(),
      github: z.string().url(),
      facebook: z.string().url(),
      twitter: z.string().url(),
      threads: z.string().url(),
      telegram: z.string().url(),
    })
    .optional(),
});

export async function PUT(request: NextRequest) {
  // get session

  const body = schema.safeParse(await request.json());

  if (!body.success) {
    const { errors } = body.error;
    return NextResponse.json(
      { message: "Invalid request", errors },
      { status: 400 },
    );
  }
  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  // save data to db
  const links = body.data.links;
  const res = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      phone: body.data.phone,
      bio: body.data.bio,
      name: body.data.name,
      collegeId: body.data.college,
      image: body.data.image,
      designation: body.data.designation,
      userLinks: links && {
        create: Object.keys(links)
          .map((key) => {
            const name = key as keyof typeof links;
            const url = links[name] as string;
            if (url)
              return {
                name,
                url,
              };
          })
          .filter((e) => e !== undefined) as {
          name: string;
          url: string;
        }[],
      },
    },
    include: {
      userLinks: true,
    },
  });

  return NextResponse.json({ success: true, now: Date.now(), res });
}

export async function GET(request: NextRequest) {
  const session = await getServerAuthSession();

  // if no session, throw unauthenticated response
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const res = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      userLinks: true,
      college: true,
    },
  });

  return NextResponse.json({ ...res });
}

export type ProfileApiResponse = User & {
  userLinks: UserLink[];
  college: College;
};
