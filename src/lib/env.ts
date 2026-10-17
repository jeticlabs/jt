/**
 * Typed access to environment variables.
 * Never expose private keys via NEXT_PUBLIC_.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    // Allow build without env, fail loudly at runtime if actually needed.
    return "";
  }
  return value;
}

export const env = {
  jeticApiUrl: required("JETIC_API_URL", "http://localhost:3001"),
  appUrl: required("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  isProduction: process.env.NODE_ENV === "production",
} as const;
