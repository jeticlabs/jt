import { inter } from "@/app/fonts";
import { WorkspaceChrome } from "@/components/ui/WorkspaceChrome/workspace-chrome";
// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} h-full w-full bg-[#111111]`}>
      <WorkspaceChrome>{children}</WorkspaceChrome>
    </div>
  );
}
