import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExamListTable } from "./_components/ExamListTable";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Add Exams
        </h1>
        <p className=" max-w-[69ch] text-lg  text-neutral-600 dark:text-white/50">
          Here you can see the list of{" "}
          <span className="font-semibold dark:text-neutral-200">
            exams and seat plans
          </span>{" "}
          you created. You can create a new exam along with seat arrangement by
          clicking Add new exam button.
        </p>
      </div>
      <div className="container">
        <div className="flex mb-3 justify-end">
          <Link href="/dashboard/tools/exam-seating/exam/new">
            <Button className="">
              <Plus className="mr-2 h-4 w-4" />
              Add new exam
            </Button>
          </Link>
        </div>
        <ExamListTable />
      </div>
    </div>
  );
}

export default page;
