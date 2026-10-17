import { Suspense } from "react";
import { inter } from "@/app/fonts";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default function SandboxLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string; sandboxId: string }>;
}) {
  return (
    <div className={`${inter.className} flex flex-col text=[13px] h-full w-full bg-[#111111]`}>
      <Suspense fallback={null}>
        <SandboxParams params={params} />
      </Suspense>
      <main className="flex  w-full h-full">
        <Sidebar />
        {children}</main>
    </div>

  );
}

// Consumes the dynamic segment ids inside Suspense so this request-bound
// route streams instead of failing static metadata validation. Renders
// nothing — pass the ids through here once Sidebar needs them.
async function SandboxParams({
  params,
}: {
  params: Promise<{ workspaceId: string; sandboxId: string }>;
}) {
  await params;
  return null;
}
