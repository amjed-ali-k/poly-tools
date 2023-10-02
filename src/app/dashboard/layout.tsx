"use client";
import Navigation from "@/components/Navigation";
import { useProfile } from "@/lib/swr";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useProfile();

  useSession({
    required: true,
    onUnauthenticated() {
      replace(`/?redirect=${pathname}`);
    },
  });

  const { replace } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!profile.isLoading && !profile.error && !profile.data?.phone) {
      // Profile not completed
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
