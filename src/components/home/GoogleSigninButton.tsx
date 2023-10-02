"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession, signIn } from "@/lib/auth";
import Image from "next/image";
import googleButton from "./signin-image.png";

function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const { status, data: session } = useSession();

  const handleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {}
  };

  if (session) {
    return (
      <Button
        asChild
        className="hero-join-button-dark group relative mx-auto w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
      >
        <Link href="/dashboard">
          <span className="inline-flex h-full w-fit items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
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
