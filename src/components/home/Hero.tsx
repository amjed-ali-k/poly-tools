import { Github, Twitter } from "lucide-react";
import { Balancer } from "react-wrap-balancer";

import { HeroIllustration } from "./heroillistruation";
import { Button } from "../ui/button";
import SBTEToolsLogo from "../Logo";
import SignInButton from "./SignInButton";
import GoogleSignInButton from "./GoogleSigninButton";

export async function Hero() {
  return (
    <section className="-mt-[56px] min-h-[calc(100vh)] overflow-hidden lg:min-h-0 lg:pt-[56px]">
      <div className="container grid min-h-screen items-center justify-center lg:min-h-0 lg:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
            <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block" />
            <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block" />
            <SBTEToolsLogo className="h-28 w-28 rounded-3xl sm:h-44 sm:w-44 sm:rounded-[2rem]" />
            <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-6xl font-extrabold text-transparent dark:to-white sm:text-8xl sm:leading-[5.5rem]">
              Poly
              <br />
              Tools
            </h1>
          </div>

          <p className="max-w-[55ch] bg-transparent px-8 text-center font-medium leading-8 text-black/60 dark:text-white/50 lg:px-0 lg:text-left">
            <Balancer>
              Poly Tools is a simple app exclusively for polytechnic lecturers,
              aimed at streamlining the time-consuming and tedious tasks.
            </Balancer>
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <GoogleSignInButton />
            {/* <SignInButton /> */}
            <Button
              asChild
              className="flex items-center gap-2  h-11 mt-0.5 border-2 px-4 py-2 dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="gap-1 md:inline-flex"
                href="https://github.com/amjed-ali-k/sbte-refactor"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
