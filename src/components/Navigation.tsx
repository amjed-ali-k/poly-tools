"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import SBTEToolsLogo from "./Logo";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "./ui/badge";
import { useLogout } from "./auth/LogOut";

function Navigation() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <header className="z-10 w-full">
      <nav
        className={`flex h-14 items-center text-sm font-medium ${
          pathname?.startsWith("/challenge") ? "px-4" : "container"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="relative flex items-center gap-3">
            <a
              className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2"
              href="/dashboard"
            >
              <SBTEToolsLogo className="h-8 w-8 rounded-md bg-[#3178C6] p-[2px]" />
              <span className="font-bold leading-[14px]">
                Poly
                <br />
                Tools
              </span>
            </a>
            <div className="ml-5">
              <NavBar />
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/dashboard/profile" className="mr-4">
              <div
                className={clsx(
                  "hover:text-foreground text-foreground/80 transition-colors",
                  {
                    "!text-foreground": pathname === "/dashboard/profile",
                  }
                )}
              >
                Profile
              </div>
            </Link>
            <div className="flex items-center justify-end gap-2">
              <Button
                className="h-8 w-full justify-start rounded-b-lg rounded-t-lg bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                onClick={logout}
                variant="ghost"
              >
                <span className="text-red-500">Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;

const components: { title: string; href: string; description: string }[] = [
  {
    title: "New Attendance",
    href: "/attendance/new",
    description: "Create a new attendance record for your students.",
  },
  {
    title: "Periods",
    href: "/attendance/periods",
    description: "Periods are the time slots in which you teach your students.",
  },
  {
    title: "Courses",
    href: "/attendance/courses",
    description: "Courses are the subjects you teach.",
  },
  {
    title: "Batches",
    href: "/attendance/batches",
    description: "Batches are the groups of students you teach. ie, EL 2021-24",
  },
  {
    title: "Students",
    href: "/attendance/students",
    description: "Students are the people who attend your classes.",
  },
  {
    title: "History",
    href: "/attendance/history",
    description:
      "Previous attendance records of your students made by you. View and manage your attendance history.",
  },
];

export function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Result Formatter</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/dashboard/result-formatter"
                  >
                    <SBTEToolsLogo className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Result Formatter
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Generate fully customisible result analysis and reports.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/dashboard/result-formatter"
                title="Upload and generate"
              >
                Upload your result and get started.
              </ListItem>
              <ListItem
                href="/dashboard/result-formatter/history"
                title="Analysis History"
              >
                View your previous analysis results.
              </ListItem>
              <ListItem
                href="/dashboard/result-formatter/progress"
                title="Student Progress"
              >
                View aggregated analysis of each student in your class.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Seating Arrangement</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li
                className="row-span-3 overflow-hidden bg-cover bg-right-bottom bg-no-repeat"
                style={{
                  backgroundImage: "url(/images/exam-hall.jpg)",
                }}
              >
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none  flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    // href="/dashboard/result-formatter"
                  >
                    <div className="relative">
                      <div className="bg-gray-950/30 blur-md inset-0 absolute" />
                      <div className="relative mb-2 mt-4 text-lg font-medium">
                        Seating Arrangement
                      </div>
                      <p className="relative text-sm leading-tight text-muted-foreground">
                        Generate seating arrangement in simple steps
                      </p>
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/dashboard/tools/exam-seating/class-list"
                title="Add class layout"
              >
                Structure of desks and tables in each class
              </ListItem>
              <ListItem
                href="/dashboard/result-formatter/history"
                title="Add Student Batches"
              >
                Student directory and their batches
              </ListItem>
              <ListItem
                href="/dashboard/result-formatter/progress"
                title="Add Exams"
              >
                Create seating arrangements for each exams
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>
            Attendance{" "}
            <Badge variant="secondary" className="ml-2">
              Upcoming
            </Badge>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem >
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Exams
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
