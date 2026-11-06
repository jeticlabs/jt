export interface ProblemPayload {
  readonly detail?: string;
  readonly title?: string;
  readonly code?: string;
}

export class BrowserApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "BrowserApiError";
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

  get isConflict(): boolean {
    return this.status === 409;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Browser calls go through the web app's `/api/proxy` route. That route reads
 * the httpOnly cookie and adds the bearer token server-side, so the token is
 * never exposed to client JavaScript.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api/proxy${path}`, {
    ...options,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin",
  });

  if (!response.ok) {
    let problem: ProblemPayload = {};
    try {
      problem = (await response.json()) as ProblemPayload;
    } catch {
      // Ignore non-JSON error bodies.
    }
    throw new BrowserApiError(
      response.status,
      problem.detail ?? problem.title ?? "Something went wrong. Please try again.",
      problem.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Narrow helper for display code that only needs the error message. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}
