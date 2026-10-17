import type { MetadataRoute } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

const STATIC_ROUTES = [
  "/",
  "/features",
  "/how-it-works",
  "/pricing",
  "/changelog",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/docs",
];

async function docSlugs(): Promise<string[]> {
  try {
    const files = await readdir(path.join(process.cwd(), "content", "docs"));
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => `/docs/${f.replace(/\.mdx$/, "")}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const routes = [...STATIC_ROUTES, ...(await docSlugs())];

  return routes.map((route) => ({
    url: `${env.appUrl}${route}`,
    lastModified,
  }));
}
