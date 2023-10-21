"use server";
import { hankoApiUrl } from "./vars";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { z } from "zod";

export const fetchUserId = async (hanko: string) => {
  const JWKS = createRemoteJWKSet(
    new URL(`${hankoApiUrl}/.well-known/jwks.json`)
  );

  const verifiedJWT = await jwtVerify(hanko ?? "", JWKS);
  return verifiedJWT.payload.sub;
};

export const getUserId = async (req: NextRequest) => {
  // if localhost, return default userId
  const localHost = req.headers.get("host")?.startsWith("localhost");
  if (localHost) {
    return "9c646448-d852-448b-abc5-b1d04fdcc0cc"; // default userId
  }

  // const userId = req.headers.get("x-user-id");
  // return userId;
  const hanko = req.cookies.get("hanko")?.value ?? "";
  if (!hanko) {
    return null;
  }
  const userId = await fetchUserId(hanko);
  // validate userId is uuid using zod
  const schema = z.string().uuid();
  const validatedUserId = schema.safeParse(userId);
  if (!validatedUserId.success) {
    throw new Error("Invalid user id");
  }
  return validatedUserId.data;
};
