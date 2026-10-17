/**
 * Security-sensitive operations: secret redaction, approval checks.
 * Authoritative enforcement lives in the backend — these helpers only
 * prevent accidental leakage in logs / UI.
 */
const SECRET_KEYS = ["secret", "token", "password", "apiKey", "authorization"];

export function redactSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEYS.some((s) => k.toLowerCase().includes(s))
        ? "[redacted]"
        : redactSecrets(v);
    }
    return out;
  }
  return value;
}
