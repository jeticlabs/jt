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

export async function verifyEmailCode(email: string, code: string): Promise<void> {
  await postAuth<{ user: unknown; session: unknown }>("verify-otp", { email, code });
}
