import React from "react";
import { BatchListTable } from "./_components/batchlistTable";
import { Button } from "@/components/ui/button";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-4 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Student Progress
        </h1>
      </div>
      <div className="container">
        <div className="flex justify-end mb-3">
          <Button>Add new</Button>
        </div>
        <BatchListTable />
      </div>
    </div>
  );
}

export default page;
