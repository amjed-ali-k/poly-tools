import { Binary } from "lucide-react";
import Link from "next/link";

export function Footsies() {
  return (
    <footer className="flex flex-col items-center text-sm font-light sm:px-16 md:px-0">
      <div className="container my-4 flex flex-col justify-between gap-6 px-10 pb-2 md:my-12 lg:flex-row">
        <div className="space-x-2">
          Built with <Binary className="inline-block h-5 w-5 text-[#31bdc6]" />{" "}
          by Amjed Ali.
        </div>
        <div className="text-neutral-500 dark:text-neutral-400">
          <Link className="hover:text-white duration-500 mr-2" href={"privacy"}>
            Privacy Policy
          </Link>
          |
          <Link className="hover:text-white duration-500 mx-2" href={"terms"}>
            Terms and Conditions
          </Link>
          |<span className="ml-2">Copyright © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
