"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession, signIn } from "@/lib/auth";
import Image from "next/image";
import googleButton from "./signin-image.png";
import { useSearchParams } from "next/navigation";

function GoogleSignInButton() {
  const { data: session } = useSession();
  const redirect = useSearchParams().get("redirect");

  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: redirect || "/dashboard" });
    } catch (error) {}
  };

  if (session) {
    return (
      <Button
        asChild
        className="hero-join-button-dark group h-11 mt-0.5 relative mx-auto w-fit overflow-hidden rounded-sm p-[1px] font-bold transition-all duration-300 block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
      >
        <Link href="/dashboard">
          <span className="inline-flex h-full w-fit items-center gap-1 rounded-sm px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
            Dashboard
          </span>
        </Link>
      </Button>
    );
  }

  return (
    <Link href="" onClick={handleSignIn}>
      <Image
        className="dark:hover:shadow-[0_0_2rem_-0.5rem_#4385f3]"
        src={googleButton}
        alt="Google OAuth Signin"
      />
    </Link>
  );
}

export default GoogleSignInButton;
