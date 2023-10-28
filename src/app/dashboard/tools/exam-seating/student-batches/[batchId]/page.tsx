import React from "react";
import EditStudentBatchComponent from "./_components";
import { prisma } from "@/server/db/prisma";
import { useProfile } from "@/lib/swr";
import { getUserId } from "@/components/auth/server";

async function page({ params }: { params: { batchId: string } }) {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Edit student batch
        </h1>
      </div>
      <div className="container">
        <EditStudentBatchComponent id={params.batchId} />
      </div>
    </div>
  );
}

export default page;
