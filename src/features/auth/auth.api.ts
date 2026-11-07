type AuthAction = "sign-in" | "sign-up" | "resend-otp";

interface ApiProblem {
  detail?: string;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_JETIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

async function postAuth<T>(
  action: AuthAction | "verify-otp" | "verify-password",
  body: object,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const payload = (await response.json()) as T & ApiProblem;

  if (!response.ok) {
    throw new Error(payload.detail ?? "Something went wrong. Please try again.");
  }

  return payload;
}

export function githubSignInUrl(next?: string | null): string {
  const params = new URLSearchParams();
  if (next) params.set("next", next);
  const query = params.toString();
  return `/api/auth/github${query ? `?${query}` : ""}`;
}

export async function requestEmailCode(action: Exclude<AuthAction, "resend-otp">, email: string): Promise<void> {
  await postAuth<{ status: "accepted" }>(action, { email });
}

export async function resendEmailCode(email: string): Promise<void> {
  await postAuth<{ status: "accepted" }>("resend-otp", { email });
}

export type VerifyEmailResult =
  | { readonly requiresPassword: false; readonly token: string }
  | { readonly requiresPassword: true; readonly challengeToken: string };

export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<VerifyEmailResult> {
  const result = await postAuth<{
    user: unknown;
    session?: unknown;
    token?: string;
    requiresPassword?: boolean;
    challengeToken?: string;
  }>("verify-otp", { email, code });

  if (result.requiresPassword && result.challengeToken) {
    return {
      requiresPassword: true,
      challengeToken: result.challengeToken,
    };
  }
  if (!result.token) {
    throw new Error("Unable to finish signing you in. Please try again.");
  }
  return { requiresPassword: false, token: result.token };
}

export async function verifyPassword(
  challengeToken: string,
  password: string,
): Promise<string> {
  const result = await postAuth<{ token: string }>("verify-password", {
    challengeToken,
    password,
  });
  return result.token;
}

/**
 * Hands the opaque API token to the web app's own session endpoint. It then
 * lives in an httpOnly cookie on this origin and is turned into a bearer token
 * by `/api/proxy` on demand.
 */
export async function establishBrowserSession(token: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Unable to finish signing you in. Please try again.");
  }
}
