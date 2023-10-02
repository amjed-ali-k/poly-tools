import {
  Diamond,
  MessageCircle,
  ThumbsUp,
  Circle,
  Plus,
  Sparkle,
  Triangle,
  Eye,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const BORDERS_BY_DIFFICULTY = {
  BEGINNER:
    "dark:hover:border-difficulty-beginner-dark hover:border-difficulty-beginner dark:group-focus:border-difficulty-beginner-dark group-focus:border-difficulty-beginner",
  FREE: "dark:hover:border-difficulty-easy-dark hover:border-difficulty-easy dark:group-focus:border-difficulty-easy-dark group-focus:border-difficulty-easy",
  MEDIUM:
    "dark:hover:border-difficulty-medium-dark hover:border-difficulty-medium dark:group-focus:border-difficulty-medium-dark group-focus:border-difficulty-medium",
  HARD: "dark:hover:border-difficulty-hard-dark hover:border-difficulty-hard dark:group-focus:border-difficulty-hard-dark group-focus:border-difficulty-hard",
  EXTREME:
    "dark:hover:border-difficulty-extreme-dark hover:border-difficulty-extreme dark:group-focus:border-difficulty-extreme-dark group-focus:border-difficulty-extreme",
};

const SHADOWS_BY_DIFFICULTY = {
  BEGINNER:
    "hover:shadow-beginner group-focus:shadow-beginner dark:hover:shadow-beginner-dark dark:group-focus:shadow-beginner-dark",
  FREE: "hover:shadow-easy group-focus:shadow-easy dark:hover:shadow-easy-dark dark:group-focus:shadow-easy-dark",
  MEDIUM:
    "hover:shadow-medium group-focus:shadow-medium dark:hover:shadow-medium-dark dark:group-focus:shadow-medium-dark",
  HARD: "hover:shadow-hard group-focus:shadow-hard dark:hover:shadow-hard-dark dark:group-focus:shadow-hard-dark",
  EXTREME:
    "hover:shadow-extreme group-focus:shadow-extreme dark:hover:shadow-extreme-dark dark:group-focus:shadow-extreme-dark",
};

const COLORS_BY_DIFFICULTY = {
  BEGINNER: "dark:bg-difficulty-beginner-dark bg-difficulty-beginner",
  FREE: "dark:bg-difficulty-easy-dark bg-difficulty-easy",
  MEDIUM: "dark:bg-difficulty-medium-dark bg-difficulty-medium",
  HARD: "dark:bg-difficulty-hard-dark bg-difficulty-hard",
  EXTREME: "dark:bg-difficulty-extreme-dark bg-difficulty-extreme",
};

type Difficulty = "BEGINNER" | "FREE" | "MEDIUM" | "HARD" | "EXTREME";

function ToolCard({
  likes,
  views,
  title,
  description,
  diff,
  author,
  date,
  link,
}: {
  likes: number;
  views: number;
  title: string;
  description: string;
  diff: string;
  author: string;
  date: Date;
  link: string;
}) {
  const difficulty = diff.toUpperCase() as Difficulty;
  return (
    <Link href={link}>
      <Card
        className={`group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px]
      ${SHADOWS_BY_DIFFICULTY[difficulty]}
      ${BORDERS_BY_DIFFICULTY[difficulty]}
      `}
      >
        {difficulty === "BEGINNER" && (
          <>
            <Circle className="group-hover/card:text-difficulty-beginner dark:group-hover/card:text-difficulty-beginner-dark absolute -right-4 -top-8 h-24 w-24 origin-top-right stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-90 dark:text-white/10" />
            <Circle className="group-hover/card:text-difficulty-beginner dark:group-hover/card:text-difficulty-beginner-dark absolute -right-4 -top-8 h-32 w-32 origin-top-right stroke-[0.4] text-black/10 duration-500 group-hover/card:scale-90 dark:text-white/10" />
          </>
        )}
        {difficulty === "FREE" && (
          <>
            <Diamond className="group-hover/card:text-difficulty-easy dark:group-hover/card:text-difficulty-easy-dark absolute -right-5 -top-10 h-24 w-24 origin-top-right stroke-[0.66] text-black/10 duration-300 group-hover/card:rotate-6 group-hover/card:scale-90 dark:text-white/10" />
            <Diamond className="group-hover/card:text-difficulty-easy dark:group-hover/card:text-difficulty-easy-dark absolute -right-6 -top-12 h-36 w-36 rotate-12 stroke-[0.44] text-black/10 duration-500 group-hover/card:-translate-y-2 group-hover/card:translate-x-3 group-hover/card:rotate-6 group-hover/card:scale-90 dark:text-white/10" />
          </>
        )}
        {difficulty === "MEDIUM" && (
          <>
            <Triangle className="group-hover/card:text-difficulty-medium dark:group-hover/card:text-difficulty-medium-dark absolute -right-5 -top-5 h-16 w-16 rotate-0 stroke-[0.75] text-black/10 duration-500 group-hover/card:-translate-x-10 group-hover/card:translate-y-10 group-hover/card:rotate-[90deg] dark:text-white/10" />
            <Triangle className="group-hover/card:text-difficulty-medium dark:group-hover/card:text-difficulty-medium-dark absolute -right-14 -top-16 h-36 w-36 rotate-12 stroke-[0.4] text-black/10 duration-300 group-hover/card:translate-x-3 group-hover/card:rotate-[30deg] group-hover/card:scale-50 group-hover/card:stroke-[0.66] dark:text-white/10" />
          </>
        )}
        {difficulty === "HARD" && (
          <>
            <Plus className="group-hover/card:text-difficulty-hard dark:group-hover/card:text-difficulty-hard-dark absolute -right-4 -top-8 h-24 w-24 stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-0 dark:text-white/10" />
            <Plus className="group-hover/card:text-difficulty-hard dark:group-hover/card:text-difficulty-hard-dark absolute -right-4 -top-8 h-32 w-32 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-y-5 group-hover/card:translate-x-9 group-hover/card:-rotate-90 group-hover/card:scale-75 dark:text-white/10" />
          </>
        )}
        {difficulty === "EXTREME" && (
          <>
            <Sparkle className="group-hover/card:text-difficulty-extreme dark:group-hover/card:text-difficulty-extreme-dark absolute -right-4 -top-10 h-24 w-24 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-x-4 group-hover/card:translate-y-10 group-hover/card:-rotate-[125deg] dark:text-white/10" />
            <Sparkle className="group-hover/card:text-difficulty-extreme dark:group-hover/card:text-difficulty-extreme-dark absolute -right-14 -top-24 h-48 w-48 origin-top-right -rotate-3 stroke-[0.33] text-black/10 duration-300 group-hover/card:scale-50 dark:text-white/10" />
          </>
        )}
        <CardHeader className="relative flex flex-col items-start gap-1 py-5">
          <CardTitle className="max-w-[75%] truncate text-2xl duration-300">
            {title}
          </CardTitle>
          <div className="flex items-center gap-6 text-center duration-300">
            <Badge
              className={`duration-300 ${COLORS_BY_DIFFICULTY[difficulty]} text-white dark:text-black`}
            >
              {difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Eye size={18} />
              {views}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ThumbsUp size={18} />
              {likes}
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 duration-300">
          <div className="flex items-center gap-2">
            <div className="-ml-[0.33rem] flex h-auto w-fit items-center whitespace-nowrap rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 duration-300 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
              @{author}
            </div>
            <div className="text-muted-foreground whitespace-nowrap text-sm">
              {dayjs(date).toNow()}
            </div>
          </div>
          <CardDescription className="relative h-20 pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover/card:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
            <p>{description}</p>
          </CardDescription>
        </CardContent>
      </Card>{" "}
    </Link>
  );
}

export default ToolCard;
