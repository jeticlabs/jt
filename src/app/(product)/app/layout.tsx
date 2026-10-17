import { inter } from "@/app/fonts";
import Toolbar from "@/components/ui/Toolbar/toolbar";
// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default function ProductAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} flex flex-col text=[13px] h-[100vh] w-full bg-[#111111]`}>

      <main className="flex  w-full h-full">
        {children}
      </main>
    </div>

  );
}
