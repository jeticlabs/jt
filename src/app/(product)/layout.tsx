import { requireAuthContext } from "@/server/auth/session";

// Every product route is request-bound: the session is validated against the
// API before any page renders, so blocking navigation is intentional here.
export const instant = false;

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthContext();
  return children;
}
