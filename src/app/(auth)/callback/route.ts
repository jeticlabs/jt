import { NextResponse } from "next/server";

/**
 * Auth callback placeholder.
 * Exchange `code` for a session server-side, then redirect to /app.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  // TODO: exchange code via src/server/auth helpers.
  return NextResponse.redirect(new URL("/app", url));
}
