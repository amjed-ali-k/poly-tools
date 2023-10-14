"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@teamhanko/hanko-elements";
import type { Hanko } from "@teamhanko/hanko-frontend-sdk";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL!;

export default function HankoAuth({ className }: { className?: string }) {
  const router = useRouter();

  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    import("@teamhanko/hanko-frontend-sdk").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi))
    );
  }, []);

  const redirectAfterLogin = useCallback(() => {
    // successfully logged in, redirect to a page in your application
    router.replace("/dashboard");
  }, [router]);

  useEffect(
    () =>
      hanko?.onAuthFlowCompleted(() => {
        redirectAfterLogin();
      }),
    [hanko, redirectAfterLogin]
  );

  useEffect(() => {
    register(hankoApi).catch((error) => {
      // handle error
    });
  }, []);

  return <hanko-auth class={className} />;
}
