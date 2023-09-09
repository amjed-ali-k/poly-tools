"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth";
import SBTEToolsLogo from "./Logo";

function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <header className="z-10 w-full">
      <nav
        className={`flex h-14 items-center text-sm font-medium ${
          pathname?.startsWith("/challenge") ? "px-4" : "container"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="relative flex items-center gap-3">
            <a
              className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2"
              href="/"
            >
              <SBTEToolsLogo className="h-8 w-8 rounded-md bg-[#3178C6] p-[2px]" />
              <span className="font-bold leading-3">
                Sbte
                <br />
                Tools
              </span>
            </a>

            <Link href="/explore" className="ml-4">
              <div
                className={clsx(
                  "hover:text-foreground text-foreground/80 transition-colors",
                  {
                    "!text-foreground": pathname === "/explore",
                  }
                )}
              >
                Explore
              </div>
            </Link>

            <Link href="/tracks" className="ml-4">
              <div
                className={clsx(
                  "hover:text-foreground text-foreground/80 transition-colors",
                  {
                    "!text-foreground": pathname === "/tracks",
                  }
                )}
              >
                Tracks
              </div>
            </Link>
          </div>
          <div className="flex">
            <div className="flex items-center justify-end gap-2">
              <Button
                className="h-8 w-full justify-start rounded-b-lg rounded-t-lg bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                onClick={handleSignOut}
                variant="ghost"
              >
                <span className="text-red-500">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
