/**
 * Shared, product-wide constants.
 * Feature-specific constants live next to their feature.
 */
export const APP_NAME = "Jetic" as const;

export const ROUTES = {
  home: "/",
  docs: "/docs",
  signIn: "/sign-in",
  signUp: "/sign-up",
  app: "/app",
  dashboard: "/app/dashboard",
  onboarding: "/app/onboarding",
  workspace: (workspaceId: string) => `/app/workspaces/${workspaceId}`,
} as const;

