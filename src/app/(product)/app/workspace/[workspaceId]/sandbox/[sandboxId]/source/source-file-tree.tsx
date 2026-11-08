"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  ChevronRight,
  File,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";

import type { SandboxSourceEntry } from "@/features/sandbox/types";

export interface SourceTreeNode {
  readonly name: string;
  readonly path: string;
  readonly type: "file" | "folder";
  readonly children: SourceTreeNode[];
}

function sortNodes(nodes: SourceTreeNode[]): void {
  nodes.sort((left, right) => {
    if (left.type !== right.type) return left.type === "folder" ? -1 : 1;
    return left.name.localeCompare(right.name);
  });
  for (const node of nodes) sortNodes(node.children);
}

/** Builds a nested, alphabetically sorted tree from GitHub's flat path list. */
export function buildSourceTree(entries: readonly SandboxSourceEntry[]): SourceTreeNode[] {
  const root: SourceTreeNode = { name: "", path: "", type: "folder", children: [] };
  const folders = new Map<string, SourceTreeNode>([["", root]]);

  const ensureFolder = (path: string): SourceTreeNode => {
    const existing = folders.get(path);
    if (existing) return existing;

    const segments = path.split("/").filter(Boolean);
    let currentPath = "";
    let parent = root;
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let folder = folders.get(currentPath);
      if (!folder) {
        folder = { name: segment, path: currentPath, type: "folder", children: [] };
        folders.set(currentPath, folder);
        parent.children.push(folder);
      }
      parent = folder;
    }
    return parent;
  };

  for (const entry of entries) {
    if (entry.type === "tree") {
      ensureFolder(entry.path);
    }
  }

  for (const entry of entries) {
    if (entry.type !== "blob") continue;
    const slash = entry.path.lastIndexOf("/");
    const parentPath = slash === -1 ? "" : entry.path.slice(0, slash);
    const parent = ensureFolder(parentPath);
    parent.children.push({
      name: slash === -1 ? entry.path : entry.path.slice(slash + 1),
      path: entry.path,
      type: "file",
      children: [],
    });
  }

  sortNodes(root.children);
  return root.children;
}

function fileIcon(path: string) {
  if (/\.(tsx?|jsx?|mjs|cjs|py|go|rs|java|rb|php|css|scss|html)$/i.test(path)) {
    return <FileCode2 size={13} />;
  }
  if (/\.json$/i.test(path)) return <FileJson size={13} />;
  if (/\.(md|mdx|txt|rst)$/i.test(path)) return <FileText size={13} />;
  return <File size={13} />;
}

function filterNodes(nodes: readonly SourceTreeNode[], query: string): SourceTreeNode[] {
  if (!query) return [...nodes];
  return nodes.flatMap((node) => {
    if (node.type === "file") {
      return node.path.toLowerCase().includes(query) ? [node] : [];
    }
    const children = filterNodes(node.children, query);
    if (children.length > 0 || node.name.toLowerCase().includes(query)) {
      return [{ ...node, children }];
    }
    return [];
  });
}

export function SourceFileTree({
  entries,
  selectedPath,
  onSelect,
  expanded,
  onToggle,
  query,
}: {
  entries: readonly SandboxSourceEntry[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  expanded: ReadonlySet<string>;
  onToggle: (path: string) => void;
  query: string;
}) {
  const nodes = useMemo(() => buildSourceTree(entries), [entries]);
  const filtered = useMemo(
    () => filterNodes(nodes, query.trim().toLowerCase()),
    [nodes, query],
  );

  const renderNode = (node: SourceTreeNode, depth: number): ReactNode => {
    if (node.type === "folder") {
      const open = query.trim().length > 0 || expanded.has(node.path);
      return (
        <li key={node.path}>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => onToggle(node.path)}
            className="flex h-8 w-full items-center gap-1.5 rounded-md pr-2 text-left text-[12px] text-[var(--jetic-emphasis)] transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            <ChevronRight
              size={12}
              className={`shrink-0 text-[var(--jetic-faint)] transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
            {open ? (
              <FolderOpen size={13} className="shrink-0 text-[var(--jetic-muted)]" />
            ) : (
              <Folder size={13} className="shrink-0 text-[var(--jetic-muted)]" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {open && node.children.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    const active = selectedPath === node.path;
    return (
      <li key={node.path}>
        <button
          type="button"
          aria-current={active ? "page" : undefined}
          onClick={() => onSelect(node.path)}
          title={node.path}
          className={`flex h-8 w-full items-center gap-1.5 rounded-md pr-2 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
            active
              ? "bg-white/[0.08] font-medium text-white"
              : "text-[var(--jetic-muted)] hover:bg-white/[0.04] hover:text-white"
          }`}
          style={{ paddingLeft: 8 + depth * 12 + 16 }}
        >
          <span
            className={`shrink-0 ${
              active ? "text-white" : "text-[var(--jetic-faint)]"
            }`}
          >
            {fileIcon(node.path)}
          </span>
          <span className="truncate">{node.name}</span>
        </button>
      </li>
    );
  };

  return (
    <ul className="flex flex-col gap-0.5">
      {filtered.map((node) => renderNode(node, 0))}
    </ul>
  );
}
