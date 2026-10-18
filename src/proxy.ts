import { NextRequest, NextResponse } from "next/server";

/**
 * Hostname → base path rewrites.
 *
 * cli.jetic.space/*   → /cli/*
 * docs.jetic.space/*  → /docs/*
 * web.jetic.space/*   → /* (passes through as-is, just served from the root)
 */
const HOST_MAP: Record<string, string | null> = {
  "cli.jetic.space": "/cli",
  "docs.jetic.space": "/docs",
  "web.jetic.space": null, // root — no prefix, serve as-is
};

export function proxy(request: NextRequest) {
  const hostname = request.headers
    .get("host")
    ?.split(":")[0]
    .toLowerCase();

  if (!hostname || !(hostname in HOST_MAP)) {
    return NextResponse.next();
  }

  const base = HOST_MAP[hostname];

  // web.jetic.space serves the root — no rewrite needed, just pass through.
  if (base === null) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  // Map hostname root to the base path; nest sub-paths underneath it.
  url.pathname =
    url.pathname === "/"
      ? base
      : `${base}${url.pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
