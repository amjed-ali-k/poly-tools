import { NextResponse, NextRequest } from "next/server";

import { jwtVerify, createRemoteJWKSet } from "jose";
import { hankoApiUrl } from "@/components/auth/vars";

export async function middleware(req: NextRequest) {
  const hanko = req.cookies.get("hanko")?.value;

  const JWKS = createRemoteJWKSet(
    new URL(`${hankoApiUrl}/.well-known/jwks.json`)
  );

  try {
    const verifiedJWT = await jwtVerify(hanko ?? "", JWKS);
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
