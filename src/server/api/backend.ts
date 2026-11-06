import { env } from "@/lib/env";

export interface ProblemDetails {
  readonly title?: string;
  readonly detail?: string;
  readonly code?: string;
}

/** An expected non-2xx response from the Jetic API. */
export class BackendError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "BackendError";
    this.status = status;
    this.code = code;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

/**
 * Low-level server-to-server request. The caller must supply a validated
 * session token; privileged calls never run in the browser.
 */
export async function backendRequest(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${env.jeticApiUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

async function readProblem(response: Response, path: string): Promise<BackendError> {
  try {
    const problem = (await response.json()) as ProblemDetails;
    return new BackendError(
      response.status,
      problem.detail ?? problem.title ?? `Backend ${response.status} ${path}`,
      problem.code,
    );
  } catch {
    return new BackendError(response.status, `Backend ${response.status} ${path}`);
  }
}

export async function backendFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await backendRequest(path, token, init);

  if (!response.ok) {
    throw await readProblem(response, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
