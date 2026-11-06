"use client";

import { usePathname } from "next/navigation";

import { ProductLoader } from "@/components/ui/product-loader";
import { WorkspaceShellSkeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/app/workspace/")) {
    return <WorkspaceShellSkeleton />;
  }

  return <ProductLoader label="Loading Jetic" />;
}
