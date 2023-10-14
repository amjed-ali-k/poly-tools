"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github, Loader2, LogIn } from "lucide-react";
import { useState } from "react";

function SignInButton() {
  const [loading, setLoading] = useState(false);

  // // NOTE: 1. loading == true -> 2. signIn() -> 3. session status == 'loading' (loading == false)
  // const handleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     // page reloads after sign in, so no need to setLoading(false), othersiwe ugly visual glitch
  //     await signIn("github", { callbackUrl: "/dashboard" });
  //   } catch (error) {
  //     // only set loading to false if there was an error and page didn't reload after sign in
  //     setLoading(false);
  //   }
  // };

  // if (session) {
  //   return (
  //     <Button
  //       asChild
  //       className="hero-join-button-dark group h-11 mt-0.5 relative mx-auto w-fit overflow-hidden rounded-sm p-[1px] font-bold transition-all duration-300 block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
  //     >
  //       <Link href="/dashboard">
  //         <span className="inline-flex h-full w-fit items-center gap-1 rounded-sm px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
  //           Dashboard
  //         </span>
  //       </Link>
  //     </Button>
  //   );
  // }

  return (
    <Button
      asChild
      className="hero-join-button-dark group h-11 mt-0.5 relative mx-auto w-fit overflow-hidden rounded-sm p-[1px] font-bold transition-all duration-300 block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
    >
      <Link href="/auth">
        <span className="inline-flex h-full w-fit items-center gap-1 rounded-sm px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogIn className="mr-1 h-4 w-4 stroke-[3]" />
          )}
          Login
        </span>
      </Link>
    </Button>
  );
}

export default SignInButton;
