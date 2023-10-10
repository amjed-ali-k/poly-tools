"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
