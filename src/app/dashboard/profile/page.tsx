import { prisma } from "@/server/db/prisma";
import React from "react";
import { ProfileForm } from "./_components/form";
import HankoProfile from "@/components/auth/Profile";

async function page() {
  const colleges = await prisma.college.findMany({});
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Update Profile
        </h1>
        <p className="max-w-[69ch] text-lg text-neutral-600 dark:text-white/50">
          Everything from here onwards will be specific to your profile. So make
          sure you update your{" "}
          <span className="font-semibold dark:text-neutral-200">profile</span>{" "}
          before proceeding.
        </p>
      </div>
      <div className="container flex flex-col md:flex-row">
        <div className="md:mr-4">
          <ProfileForm collegeList={colleges} />
        </div>

        <div className="bg-slate-800 m-4 rounded-lg border-l-4 border-blue-600 rounded-l-none">
          <HankoProfile />
        </div>
      </div>
    </div>
  );
}

export default page;
