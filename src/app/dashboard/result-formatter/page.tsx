import React from "react";
import ResultUploadFomr from "./_components/form";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Result Formatter
        </h1>
        <p className=" max-w-[69ch] text-lg  text-neutral-600 dark:text-white/50">
          This tool exclusively streamline the time-consuming and tedious task
          of{" "}
          <span className="font-semibold dark:text-neutral-200">
            evaluating student results
          </span>{" "}
          downloaded from SBTE
        </p>
      </div>
      <div className="container">
        <ResultUploadFomr />
      </div>
    </div>
  );
}

export default page;
