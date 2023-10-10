"use client";
import Navigation from "@/components/Navigation";
import { useProfile } from "@/lib/swr";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useProfile();
  const pathName = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // check data.college, data.department, data.email, data.phonenumber exists
    // if not, redirect to /profile

    // if current page is /profile, do nothing
    if (pathName === "/dashboard/profile") return;

    if (data) {
      if (!data.collegeId || !data.designation || !data.phone || !data.name) {
        toast({ title: "Please complete your profile first" });
        router.replace("/dashboard/profile");
      }
    }
  }, [data, pathName, router, toast]);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
