import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { currentWorkspacePath } from "@/server/auth/redirect";
import { getAuthContext } from "@/server/auth/session";

export const instant = false;

export default async function SignInLayout({
  children,
}: {
  children: ReactNode;
}) {
  let context = null;
  try {
    context = await getAuthContext();
  } catch {
    // A transient backend failure should not make the public auth page
    // unusable. The form will surface its own API errors.
    context = null;
  }

  if (context) {
    redirect(await currentWorkspacePath(context));
  }

  return children;
}
