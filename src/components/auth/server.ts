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
  const userId = req.headers.get("x-user-id");
  return userId;
  // const hanko = req.cookies.get("hanko")?.value ?? "";
  // if (!hanko) {
  //   throw new Error("No Hanko cookie found");
  // }
  // const userId = await fetchUserId(hanko);
  // // validate userId is uuid using zod
  // const schema = z.string().uuid();
  // const validatedUserId = schema.safeParse(userId);
  // if (!validatedUserId.success) {
  //   throw new Error("Invalid user id");
  // }
  // return validatedUserId.data;
};
