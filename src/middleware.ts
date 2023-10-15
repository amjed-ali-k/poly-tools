import { NextResponse, NextRequest } from "next/server";

import { fetchUserId, getUserId } from "@/components/auth/server";

export async function middleware(req: NextRequest) {
  // If localHost is true, we are running in development mode, so we can skip authentication
  const localHost = req.headers.get("host")?.startsWith("localhost");
  if (localHost) {
    return NextResponse.next();
  }

  try {
    const hanko = req.cookies.get("hanko")?.value;
    if (!hanko) {
      throw new Error("No Hanko cookie found");
    }
    const userId = await fetchUserId(hanko);

    userId && req.headers.set("x-user-id", userId);
    return NextResponse.next();
  } catch {
    if (req.url.startsWith("/api/secure")) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          detail: "Please log in to access this resource.",
        },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/secure/:path*"],
};
