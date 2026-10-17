import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Suspense } from "react";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export async function generateStaticParams() {
  try {
    const files = await fs.readdir(DOCS_DIR);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: [f.replace(/\.mdx$/, "")] }));
  } catch {
    return [{ slug: ["getting-started"] }];
  }
}

async function listDocs(): Promise<string[]> {
  try {
    const files = await fs.readdir(DOCS_DIR);
    return files.filter((f) => f.endsWith(".mdx")).sort();
  } catch {
    return [];
  }
}

export default function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl gap-8 px-6 py-12">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <DocsContent params={params} />
      </Suspense>
    </div>
  );
}

async function DocsContent({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const files = await listDocs();
  const active = slug?.join("/") ?? null;

  let body: string | null = null;
  if (active) {
    try {
      body = await fs.readFile(path.join(DOCS_DIR, `${active}.mdx`), "utf8");
    } catch {
      body = null;
    }
  }

  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col gap-1 text-sm sm:flex">
        <Link href="/docs" className="px-2 py-1 font-semibold">
          Documentation
        </Link>
        {files.map((f) => {
          const name = f.replace(/\.mdx$/, "");
          return (
            <Link
              key={f}
              href={`/docs/${name}`}
              className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400"
            >
              {name}
            </Link>
          );
        })}
      </aside>
      <article className="min-w-0 flex-1">
        {!active ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Start with getting-started. Content lives in `content/docs/*.mdx`.
            </p>
          </>
        ) : body ? (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{active}</h1>
            <pre className="mt-6 overflow-auto rounded-2xl border border-black/[.08] p-5 text-sm whitespace-pre-wrap dark:border-white/[.08]">
              {body}
            </pre>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              No doc for “{active}”.
            </p>
          </>
        )}
      </article>
    </>
  );
}
