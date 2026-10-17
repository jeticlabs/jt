import { Suspense } from "react";
import { inter } from "@/app/fonts";
import Toolbar from "@/components/ui/Toolbar/toolbar";
// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default function WorkspaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ workspaceId: string }>;
}) {
    return (
        <div className={`${inter.className} flex flex-col text=[13px] h-full w-full bg-[#111111]`}>
            <Suspense
                fallback={<div aria-hidden className="h-10 border-b border-white/10" />}
            >
                <WorkspaceChrome params={params} />
            </Suspense>
            <main className="flex  w-full h-[calc(100vh-50px)] overflow-y-auto">
                {children}</main>
        </div>

    );
}

// Awaits the dynamic segment inside Suspense so this request-bound route
// streams instead of failing static metadata validation. Also wires the
// real workspace id into the toolbar switcher.
async function WorkspaceChrome({
    params,
}: {
    params: Promise<{ workspaceId: string }>;
}) {
    const { workspaceId } = await params;
    return <Toolbar workspace={workspaceId} />;
}
