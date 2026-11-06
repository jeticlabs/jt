import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth-cookie";
import { backendFetch } from "@/server/api/backend";

const SESSION_MAX_AGE_SECONDS = 7 * 86_400;

interface EstablishSessionBody {
  readonly token?: unknown;
}

/**
 * Stores the opaque API session token in an httpOnly cookie owned by the web
 * origin. This keeps server rendering and the `/api/proxy` route independent
 * from the API host's cookie domain.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json().catch(() => null)) as EstablishSessionBody | null;
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (token.length === 0) {
    return NextResponse.json(
      { title: "Bad Request", detail: "A session token is required.", status: 400 },
      { status: 400 },
    );
  }

  try {
    // Never trust a client-provided token without asking the API about it.
    await backendFetch("/v1/auth/session", token);
  } catch {
    return NextResponse.json(
      { title: "Unauthorized", detail: "The session token is invalid.", status: 401 },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
