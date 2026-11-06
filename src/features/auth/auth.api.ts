type AuthAction = "sign-in" | "sign-up" | "resend-otp";

interface ApiProblem {
  detail?: string;
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_JETIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

async function postAuth<T>(action: AuthAction | "verify-otp", body: object): Promise<T> {
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

export async function requestEmailCode(action: Exclude<AuthAction, "resend-otp">, email: string): Promise<void> {
  await postAuth<{ status: "accepted" }>(action, { email });
}

export async function resendEmailCode(email: string): Promise<void> {
  await postAuth<{ status: "accepted" }>("resend-otp", { email });
}

export async function verifyEmailCode(email: string, code: string): Promise<string> {
  const result = await postAuth<{ user: unknown; session: unknown; token: string }>(
    "verify-otp",
    { email, code },
  );
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
