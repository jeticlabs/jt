type AuthAction = "sign-in" | "sign-up";

interface ApiProblem {
  detail?: string;
}

async function postAuth<T>(action: AuthAction | "verify-otp", body: object): Promise<T> {
  const response = await fetch(`/api/auth/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T & ApiProblem;

  if (!response.ok) {
    throw new Error(payload.detail ?? "Something went wrong. Please try again.");
  }

  return payload;
}

export async function requestEmailCode(action: AuthAction, email: string): Promise<void> {
  await postAuth<{ status: "accepted" }>(action, { email });
}

export async function verifyEmailCode(email: string, code: string): Promise<void> {
  await postAuth<{ user: unknown; session: unknown }>("verify-otp", { email, code });
}
