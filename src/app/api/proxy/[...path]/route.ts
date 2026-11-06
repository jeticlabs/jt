import { type NextRequest, NextResponse } from "next/server";

import { backendRequest } from "@/server/api/backend";
import { getSessionToken } from "@/server/auth/session";

const UNAUTHORIZED = {
  type: "https://docs.jetic.space/problems/unauthorized",
  title: "Unauthorized",
  status: 401,
  detail: "Sign in to continue.",
  code: "UNAUTHORIZED",
};

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  const { path } = await context.params;
  if (path[0] !== "v1") {
    return NextResponse.json(
      { ...UNAUTHORIZED, status: 404, detail: "Not found.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const target = `/${path.join("/")}${request.nextUrl.search}`;
  const requestHeaders: Record<string, string> = {
    accept: request.headers.get("accept") ?? "application/json",
  };
  const init: RequestInit = { method: request.method, headers: requestHeaders };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.text();
    if (body.length > 0) {
      init.body = body;
      requestHeaders["content-type"] =
        request.headers.get("content-type") ?? "application/json";
    }
  }

  const upstream = await backendRequest(target, token, init);
  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  const requestId = upstream.headers.get("x-request-id");
  if (contentType) responseHeaders.set("content-type", contentType);
  if (requestId) responseHeaders.set("x-request-id", requestId);

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204, headers: responseHeaders });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export {
  proxyRequest as DELETE,
  proxyRequest as GET,
  proxyRequest as PATCH,
  proxyRequest as POST,
  proxyRequest as PUT,
};
