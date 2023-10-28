import React from "react";
import { ClassListTable } from "./_components/classList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Class / Hall Layouts
        </h1>
        <p className=" max-w-[69ch] text-lg  text-neutral-600 dark:text-white/50">
          Here you can see the list of{" "}
          <span className="font-semibold dark:text-neutral-200">
            class or hall layouts
          </span>{" "}
          you created. You can create a new class layout by clicking Add Class
          Layout button.
        </p>
      </div>
      <div className="container">
        <div className="flex mb-3 justify-end">
          <Link href="/dashboard/tools/exam-seating/new">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              Add new class / Hall
            </Button>
          </Link>
        </div>
        <ClassListTable />
      </div>
    </div>
  );
}

export default page;
