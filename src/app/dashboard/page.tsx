import ToolCard from "@/components/cards/ToolCard";
import { prisma } from "@/server/db/prisma";
import React from "react";

async function page() {
  const tools = await prisma.tool.findMany({});
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          Here are the tools which you can{" "}
          <span className="font-semibold dark:text-neutral-200">explore</span>{" "}
          and use.
        </p>
      </div>
      <div className="container grid grid-cols-3 gap-4">
        {tools.map((e) => (
          <ToolCard
            key={e.slug}
            title={e.name}
            description={e.description}
            author={e.author}
            date={e.updatedAt}
            diff={e.type}
            likes={e.likes}
            views={e.views}
            link={`/dashboard/tools/${e.slug}`}
          />
        ))}
      </div>
    </div>
  );
}

export default page;
