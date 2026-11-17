import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { getSessionToken } from "@/server/auth/session";
import { BackendError, backendFetch } from "@/server/api/backend";

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", env.appUrl));
  }

  const workspaceId = request.nextUrl.searchParams.get("workspaceId")?.trim();

  if (!workspaceId) {
    return NextResponse.redirect(
      new URL("/app?github=error", env.appUrl),
    );
  }

  try {
    const result = await backendFetch<{ url: string }>(
      "/v1/github/app/installations/start",
      token,
      {
        method: "POST",
        body: JSON.stringify({ workspaceId }),
      },
    );
    return NextResponse.redirect(result.url);
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      return NextResponse.redirect(new URL("/sign-in", env.appUrl));
    }
    return NextResponse.redirect(
      new URL(
        `/app/workspace/${encodeURIComponent(workspaceId)}/integrations?github=error`,
        env.appUrl,
      ),
    );
  }
}
