import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getSessionToken } from "@/server/auth/session";
import { backendFetch } from "@/server/api/backend";
import {
  GITHUB_STATE_COOKIE,
  GITHUB_STATE_MAX_AGE_SECONDS,
  encodeGithubState,
  githubCallbackUrl,
  safeNext,
} from "@/server/auth/github-oauth";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID?.trim();
  if (!clientId || clientId.startsWith("your_")) {
    return NextResponse.redirect(
      new URL("/sign-in?error=github_not_configured", env.appUrl),
    );
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", env.appUrl));
  }
  try {
    await backendFetch("/v1/auth/session", token);
  } catch {
    return NextResponse.redirect(new URL("/sign-in", env.appUrl));
  }

  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const state = randomBytes(32).toString("base64url");

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", githubCallbackUrl());
  authorize.searchParams.set("scope", "read:user user:email");
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("allow_signup", "true");

  const response = NextResponse.redirect(authorize);
  response.cookies.set(
    GITHUB_STATE_COOKIE,
    encodeGithubState(state, next, "link"),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      path: "/api/auth/github",
      maxAge: GITHUB_STATE_MAX_AGE_SECONDS,
    },
  );
  return response;
}
