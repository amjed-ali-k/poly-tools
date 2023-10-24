import React from "react";
import { ClassListTable } from "./_components/classList";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Class / Hall Layouts
        </h1>
      </div>
      <div className="container">
        <ClassListTable />
      </div>
    </div>
  );
}

export default page;
