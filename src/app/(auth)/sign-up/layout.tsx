import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { currentWorkspacePath } from "@/server/auth/redirect";
import { getAuthContext } from "@/server/auth/session";

export const instant = false;

export default async function SignUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  let context = null;
  try {
    context = await getAuthContext();
  } catch {
    // Keep the public sign-up page available when the API is temporarily down.
    context = null;
  }

  if (context) {
    redirect(await currentWorkspacePath(context));
  }

  return children;
}
