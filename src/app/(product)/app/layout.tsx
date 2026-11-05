import { inter } from "@/app/fonts";
// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default function ProductAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex h-[100vh] w-full flex-col bg-[#111111] text-[13px]`}>
      <main className="flex h-full w-full">{children}</main>
    </div>
  );
}
