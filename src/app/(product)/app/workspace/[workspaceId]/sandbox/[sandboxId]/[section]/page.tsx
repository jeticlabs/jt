"use client";

import { useParams } from "next/navigation";

import { SandboxSectionPlaceholder } from "@/components/ui/sandbox/sandbox-section-placeholder";

export default function SandboxSectionPage() {
  const params = useParams<{ section?: string | string[] }>();
  const section = Array.isArray(params?.section)
    ? (params.section[0] ?? "")
    : (params?.section ?? "");

  return <SandboxSectionPlaceholder section={section} />;
}
