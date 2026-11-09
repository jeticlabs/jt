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

function firstHeader(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  return first && first.length > 0 ? first : null;
}

function clientIp(request: NextRequest): string | null {
  return (
    firstHeader(request.headers.get("x-forwarded-for")) ??
    firstHeader(request.headers.get("x-real-ip")) ??
    firstHeader(request.headers.get("cf-connecting-ip")) ??
    firstHeader(request.headers.get("true-client-ip"))
  );
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await context.params;
  if (path[0] !== "v1") {
    return NextResponse.json(
      { ...UNAUTHORIZED, status: 404, detail: "Not found.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const targetPath = path.join("/");
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  const target = `/${targetPath}${request.nextUrl.search}`;
  const requestHeaders: Record<string, string> = {
    accept: request.headers.get("accept") ?? "application/json",
  };

  // The API otherwise sees this Next.js process as the client. Forward the
  // original client address; the API trusts exactly one proxy hop.
  const ip = clientIp(request);
  if (ip) {
    requestHeaders["x-forwarded-for"] = ip;
    requestHeaders["x-real-ip"] = ip;
  }

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
