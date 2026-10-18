import Link from "next/link";

const link = "text-white/70 underline decoration-white/35 underline-offset-[3px] hover:text-white";

export default function FooterLinks() {
  return (
    <p className="mt-[14px] text-center text-[12.5px] leading-[18px] text-white/45">
      Or{" "}
      <Link href="/docs/start/getting-started" className={link}>run your first scan</Link>
      <span className="mx-[9px]">·</span>
      <Link href="/docs/reference/cli-reference" className={link}>read the CLI reference</Link>
      <span className="mx-[9px]">·</span>
      <a href="https://github.com/JeticLabs/jetic-cli" className={link}>star it on GitHub</a>
    </p>
  );
}
