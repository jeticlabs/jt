import Link from "next/link";

export default function FooterLinks() {
  return (
    <p className="mt-[14px] text-center text-[12.5px] leading-[18px] text-white/45">
      Or{" "}
      <Link href="/features" className="text-white/70 underline decoration-white/35 underline-offset-[3px] hover:text-white">
        run a sample simulation
      </Link>
      <span className="mx-[9px]">·</span>
      <Link href="/docs" className="text-white/70 underline decoration-white/35 underline-offset-[3px] hover:text-white">
        browse the docs
      </Link>
      <span className="mx-[9px]">·</span>
      already building?{" "}
      <Link href="/app/dashboard" className="text-white/70 underline decoration-white/35 underline-offset-[3px] hover:text-white">
        open the dashboard
      </Link>
    </p>
  );
}
