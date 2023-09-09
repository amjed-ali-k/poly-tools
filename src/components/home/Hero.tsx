import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Balancer } from "react-wrap-balancer";

import { HeroIllustration } from "./heroillistruation";
import { Button } from "../ui/button";

function SBTEToolsLogo() {
  return (
    <svg
      className="h-28 w-28 rounded-3xl sm:h-44 sm:w-44 sm:rounded-[2rem]"
      fill="none"
      viewBox="0 0 164 164"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 29.8182C0 13.3501 13.3501 0 29.8182 0H134.182C150.65 0 164 13.3501 164 29.8182V134.182C164 150.65 150.65 164 134.182 164H29.8182C13.3501 164 0 150.65 0 134.182V29.8182Z"
        fill="#3178C6"
      />
      <path
        fill="white"
        d="m95.7 47.9q-0.9 0.9-1.3 2-0.5 1.2-0.5 2.5 0 1.3 0.5 2.4 0.4 1.2 1.3 2.1l10.4 10.4q0.9 0.9 2.1 1.3 1.1 0.5 2.4 0.5 1.3 0 2.5-0.5 1.1-0.4 2-1.3l24.4-24.4c3.3 7.2 4.3 15.2 2.9 22.9-1.4 7.8-5.2 15-10.8 20.5-5.6 5.6-12.7 9.4-20.5 10.8-7.7 1.4-15.8 0.4-22.9-2.8l-44.8 44.7c-2.5 2.6-6 4-9.7 4-3.6 0-7.1-1.4-9.7-4-2.6-2.6-4-6.1-4-9.7 0-3.7 1.4-7.2 4-9.7l44.7-44.8c-3.2-7.1-4.2-15.2-2.8-22.9 1.4-7.8 5.2-14.9 10.8-20.5 5.5-5.6 12.7-9.4 20.5-10.8 7.7-1.4 15.7-0.4 22.9 2.9l-24.3 24.3z"
      />
    </svg>
  );
}

export async function Hero() {
  return (
    <section className="-mt-[56px] min-h-[calc(100vh)] overflow-hidden lg:min-h-0 lg:pt-[56px]">
      <div className="container grid min-h-screen items-center justify-center lg:min-h-0 lg:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
            <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block" />
            <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block" />
            <SBTEToolsLogo />
            <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-6xl font-extrabold text-transparent dark:to-white sm:text-8xl sm:leading-[5.5rem]">
              SBTE
              <br />
              Tools
            </h1>
          </div>

          <p className="max-w-[55ch] bg-transparent px-8 text-center font-medium leading-8 text-black/60 dark:text-white/50 lg:px-0 lg:text-left">
            <Balancer>
              SBTE Tools is a simple app exclusively for polytechnic lecturers,
              aimed at streamlining the time-consuming and tedious tasks.
            </Balancer>
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              asChild
              className="hero-join-button-dark group relative mx-auto w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
            >
              <Link href="/api/auth/signin">
                <span className="inline-flex h-full w-fit items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
                  <Github className="mr-1 h-4 w-4 stroke-[3]" />
                  Sign in with Github
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="gap-1 md:inline-flex"
                href="https://github.com/amjed-ali-k/sbte-refactor"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button
              asChild
              className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="gap-1 md:inline-flex"
                href="https://twitter.com/amjed_ali_k"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
            </Button>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
