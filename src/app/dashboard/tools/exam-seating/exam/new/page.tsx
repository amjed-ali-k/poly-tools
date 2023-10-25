import React from "react";
import NewExamForm from "./_components/NewExamForm";

async function page() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Add new exam
        </h1>
      </div>
      <div className="container">
        <NewExamForm />
      </div>
    </div>
  );
}

export default page;
