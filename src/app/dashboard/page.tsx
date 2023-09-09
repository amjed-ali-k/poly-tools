import React from "react";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          Explore the challenges. Embrace the opportunity to grow, learn, and
          showcase your programming abilities. We hope you find the{" "}
          <span className="font-semibold dark:text-neutral-200">perfect</span>{" "}
          challenge!
        </p>
      </div>
    </div>
  );
}

export default page;
