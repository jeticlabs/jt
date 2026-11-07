import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-cookie";
import { env } from "@/lib/env";
import { backendFetch } from "@/server/api/backend";
import {
  GITHUB_STATE_COOKIE,
  decodeGithubState,
  githubCallbackUrl,
  safeNext,
  statesMatch,
} from "@/server/auth/github-oauth";

const SESSION_MAX_AGE_SECONDS = 7 * 86_400;
const DEVICE_COOKIE_NAME = "jetic_device";
const DEVICE_MAX_AGE_SECONDS = 365 * 86_400;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stored = decodeGithubState(
    request.cookies.get(GITHUB_STATE_COOKIE)?.value,
  );
  const next = safeNext(stored?.next ?? null);

  const fail = (error: "github_oauth" | "github_not_configured") => {
    const response = NextResponse.redirect(
      new URL(`/sign-in?error=${error}`, env.appUrl),
    );
    response.cookies.set(GITHUB_STATE_COOKIE, "", {
      path: "/api/auth/github",
      maxAge: 0,
    });
    return response;
  };

  if (!code || !state || !stored || !statesMatch(state, stored.state)) {
    return fail("github_oauth");
  }

  const apiUrl = env.jeticApiUrl.replace(/\/+$/, "");

  if (stored.mode === "link") {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionToken) {
      return fail("github_oauth");
    }

    const target = new URL(next, env.appUrl);
    try {
      const response = await fetch(`${apiUrl}/v1/auth/github/link`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ code, redirectUri: githubCallbackUrl() }),
        cache: "no-store",
      });
      target.searchParams.set(
        "github",
        response.ok
          ? "connected"
          : response.status === 409
            ? "already_linked"
            : "error",
      );
    } catch {
      target.searchParams.set("github", "error");
    }

    const response = NextResponse.redirect(target);
    response.cookies.set(GITHUB_STATE_COOKIE, "", {
      path: "/api/auth/github",
      maxAge: 0,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  const forwardedFor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim();
  const existingDeviceToken = request.cookies.get(DEVICE_COOKIE_NAME)?.value;

  let apiResponse: Response;
  try {
    apiResponse = await fetch(`${apiUrl}/v1/auth/github/session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
        ...(existingDeviceToken
          ? { cookie: `${DEVICE_COOKIE_NAME}=${existingDeviceToken}` }
          : {}),
        "user-agent": request.headers.get("user-agent") ?? "Jetic",
      },
      body: JSON.stringify({ code, redirectUri: githubCallbackUrl() }),
      cache: "no-store",
    });
  } catch {
    return fail("github_oauth");
  }

  if (!apiResponse.ok) {
    return fail(
      apiResponse.status === 503 ? "github_not_configured" : "github_oauth",
    );
  }

  const payload = (await apiResponse.json().catch(() => null)) as {
    token?: string;
    deviceToken?: string | null;
  } | null;
  if (!payload?.token) {
    return fail("github_oauth");
  }

  try {
    await backendFetch("/v1/auth/session", payload.token);
  } catch {
    return fail("github_oauth");
  }

  // The API completion route runs on the API origin so it can set the
  // API-origin session and device cookies. Those cookies are required by
  // direct API calls such as UploadThing.
  const complete = new URL("/v1/auth/github/complete", apiUrl);
  complete.searchParams.set("token", payload.token);
  complete.searchParams.set("next", next);
  if (payload.deviceToken) {
    complete.searchParams.set("deviceToken", payload.deviceToken);
  }

  const response = NextResponse.redirect(complete);
  response.cookies.set(GITHUB_STATE_COOKIE, "", {
    path: "/api/auth/github",
    maxAge: 0,
  });
  response.cookies.set(SESSION_COOKIE_NAME, payload.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  if (payload.deviceToken) {
    response.cookies.set(DEVICE_COOKIE_NAME, payload.deviceToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      path: "/",
      maxAge: DEVICE_MAX_AGE_SECONDS,
    });
  }
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
