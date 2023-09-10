import { getServerAuthSession } from "@/server/auth/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/secure")) {
    const session = await getServerAuthSession();

    // if no session, throw unauthenticated response
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
  }
}

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/api/secure/:path*",
// };
