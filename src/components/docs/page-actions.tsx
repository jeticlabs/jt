"use client";

import { usePathname } from "next/navigation";
import {
  MarkdownCopyButton,
  PageBreadcrumb,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useAIChat } from "@/components/ai/search";
import { cn } from "@/lib/utils";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { CheckIcon, LinkIcon } from "lucide-react";

const GITHUB_REPO = "https://github.com/jeticlabs/jetic-cli";
const GITHUB_BRANCH = "main";
const SOURCE_DIR = "content/docs";

function usePageSource() {
  const pathname = usePathname() ?? "/docs";
  const slug = pathname.replace(/^\/docs(?:\/|$)/, "").replace(/\/+$/, "");

  return {
    pathname,
    markdownUrl: slug ? `/llms.mdx/docs/${slug}` : "/llms.mdx/docs",
    githubUrl: `${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${SOURCE_DIR}/${slug ? `${slug}.mdx` : "index.mdx"
      }`,
  };
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const AskAiIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

function AskAi() {
  const { open, setOpen } = useAIChat();

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        open && "bg-fd-accent text-fd-accent-foreground",
      )}
    >
      <AskAiIcon />
      Ask AI
    </button>
  );
}

function CopyLinkButton() {
  const pathname = usePathname() ?? "/";
  const [copied, onClick] = useCopyButton(() => {
    const url = `${window.location.origin}${pathname}`;
    void navigator.clipboard.writeText(url);
  });

  return (
    <button
      type="button"
      aria-label={copied ? "Link copied" : "Copy page link"}
      title={copied ? "Link copied!" : "Copy link to this page"}
      onClick={onClick}
      className={cn(
        "gap-2",
        buttonVariants({ variant: "secondary", size: "sm" }),
        copied && "text-green-500",
      )}
    >
      {copied ? <CheckIcon /> : <LinkIcon />} Copy page link
    </button>
  );
}

/**
 * Page actions row: Ask AI, GitHub, Copy Markdown, Open — rendered as the
 * breadcrumb slot of every docs page (see src/app/docs/[[...slug]]/page.tsx).
 */
export function DocsPageHeader() {
  const { githubUrl, markdownUrl } = usePageSource();

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <PageBreadcrumb />
      <div className="ms-auto flex flex-wrap items-center gap-1.5 [&_svg]:size-3.5">
        <AskAi />
        <a
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Jetic on GitHub"
          title="View the Jetic repository on GitHub"
          className={cn(
            buttonVariants({ variant: "secondary", size: "icon-sm" }),
          )}
        >
          <GitHubIcon />
        </a>
        <CopyLinkButton />
        <MarkdownCopyButton markdownUrl={markdownUrl} />

      </div>
    </div>
  );
}
