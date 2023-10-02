"use client";
import Navigation from "@/components/Navigation";
import { useProfile } from "@/lib/swr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useProfile();

  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(profile);
    if (!profile.isLoading && !!profile.error) {
      replace(`/?redirect=${pathname}`);
    }
    if (!profile.isLoading && !profile.error && !profile.data?.phone) {
      replace(`/dashboard/profile?redirect=${pathname}`);
    }
  }, [pathname, profile, replace]);

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
