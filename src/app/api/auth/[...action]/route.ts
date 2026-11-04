import { NextResponse } from "next/server";
import { env } from "@/lib/env";

const AUTH_ACTIONS = new Set(["sign-in", "sign-up", "verify-otp"]);

interface RouteContext {
  params: Promise<{ action: string[] }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request, { params }: RouteContext) {
  const { action } = await params;
  const [authAction] = action;

  if (action.length !== 1 || !authAction || !AUTH_ACTIONS.has(authAction)) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  const body: unknown = await request.json();
  const upstream = await fetch(`${env.jeticApiUrl}/v1/auth/${authAction}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload: unknown = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  if (authAction !== "verify-otp") {
    return NextResponse.json(payload, { status: upstream.status });
  }

  if (
    !isRecord(payload) ||
    typeof payload.token !== "string" ||
    !isRecord(payload.session) ||
    typeof payload.session.expiresAt !== "string"
  ) {
    return NextResponse.json(
      { detail: "The authentication service returned an invalid session." },
      { status: 502 },
    );
  }

  const maxAge = Math.floor((Date.parse(payload.session.expiresAt) - Date.now()) / 1_000);
  if (maxAge <= 0) {
    return NextResponse.json(
      { detail: "The authentication service returned an expired session." },
      { status: 502 },
    );
  }

  const { token, ...responseBody } = payload;
  const response = NextResponse.json(responseBody, { status: upstream.status });
  response.cookies.set("jetic_session", token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return response;
}
