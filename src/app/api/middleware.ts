import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const hankoApiUrl = process.env.NEXT_PUBLIC_HANKO_API_URL!;

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const hanko = req.cookies.get("hanko")?.value;

  const JWKS = createRemoteJWKSet(
    new URL(`${hankoApiUrl}/.well-known/jwks.json`)
  );
  try {
    const verifiedJWT = await jwtVerify(hanko ?? "", JWKS);
  } catch {
    return NextResponse.json(
      {
        message: "Unauthenticated",
        detail: "Please log in to access this resource.",
      },
      { status: 401 }
    );
  }
}
export const config = {
  matcher: ["/api/secure/:path*"],
};
