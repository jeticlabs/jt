import { inter } from "../fonts";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen w-full relative overflow-x-hidden `}>

      <div className="flex min-h-full flex-col ">
        <div className="mx-auto flex min-h-full w-full max-w-7xl  flex-1 flex-col border-x border-black/[.08] dark:border-white/[.08] z-9999">

          <main className="flex flex-col w-full h-full  ">{children}</main>

        </div>
      </div>
    </div >
  );
}
