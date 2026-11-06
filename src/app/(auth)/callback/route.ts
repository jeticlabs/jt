import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-cookie";
import { backendFetch } from "@/server/api/backend";

const SESSION_MAX_AGE_SECONDS = 7 * 86_400;

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/app/onboarding";
  }
  return value;
}

/**
 * OAuth handoff endpoint. The API creates the API-origin session and redirects
 * here with a short-lived opaque token; this route validates it and stores the
 * web-origin HttpOnly session cookie.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = safeNext(url.searchParams.get("next"));

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in?error=github_oauth", url));
  }

  try {
    await backendFetch("/v1/auth/session", token);
  } catch {
    return NextResponse.redirect(new URL("/sign-in?error=github_oauth", url));
  }

  const response = NextResponse.redirect(new URL(next, url));
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
