import React from "react";
import NewBatchForm from "./_components/newBatchForm";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          New Batch
        </h1>
        <p className=" max-w-[69ch] text-lg  text-neutral-600 dark:text-white/50">
          Batches are the
          <span className="font-semibold dark:text-neutral-200">
            groups of students
          </span>{" "}
          you teach. ie, EL 2021-24
        </p>
      </div>
      <div className="container">
        <NewBatchForm />
      </div>
    </div>
  );
}

export default page;
