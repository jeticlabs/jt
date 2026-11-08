"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { Monaco } from "@monaco-editor/react";
import { AlertCircle, FileQuestion, Loader2, RefreshCw } from "lucide-react";

import type { SandboxSourceFile } from "@/features/sandbox/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center gap-2 text-[12px] text-[var(--jetic-muted)]">
      <Loader2 size={14} className="animate-spin" />
      Loading editor…
    </div>
  ),
});

function defineJeticTheme(monaco: Monaco) {
  monaco.editor.defineTheme("jetic-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0a0a0a",
      "editor.foreground": "#ededed",
      "editorGutter.background": "#0a0a0a",
      "editorLineNumber.foreground": "#3f3f46",
      "editorLineNumber.activeForeground": "#a1a1aa",
      "editor.selectionBackground": "#ffffff22",
      "editor.inactiveSelectionBackground": "#ffffff10",
      "editor.lineHighlightBackground": "#ffffff06",
      "editorCursor.foreground": "#ffffff",
      "editorWidget.background": "#141414",
      "editorWidget.border": "#ffffff14",
      "scrollbarSlider.background": "#ffffff12",
      "scrollbarSlider.hoverBackground": "#ffffff20",
      "scrollbarSlider.activeBackground": "#ffffff28",
    },
  });
  monaco.editor.setTheme("jetic-dark");
}

function Placeholder({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
        {icon}
      </span>
      <div>
        <p className="text-[13px] font-semibold text-white">{title}</p>
        <p className="jetic-muted mx-auto mt-1 max-w-sm text-[12px] leading-5">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function SourceEditor({
  file,
  loading,
  error,
  onRetry,
}: {
  file: SandboxSourceFile | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <span className="jetic-shimmer h-3 w-48 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={index}
              className="jetic-shimmer h-2.5 rounded-full"
              style={{ width: `${45 + ((index * 17) % 50)}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Placeholder
        icon={<AlertCircle size={18} className="text-red-300" />}
        title="File could not be loaded"
        description={error}
        action={
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        }
      />
    );
  }

  if (!file) {
    return (
      <Placeholder
        icon={<FileQuestion size={18} />}
        title="Select a file"
        description="Choose a file from the repository tree to preview it here. Files are read-only."
      />
    );
  }

  if (file.binary) {
    return (
      <Placeholder
        icon={<FileQuestion size={18} />}
        title="Binary file"
        description="This file is binary and cannot be displayed in the editor."
      />
    );
  }

  if (file.tooLarge) {
    return (
      <Placeholder
        icon={<FileQuestion size={18} />}
        title="File is too large"
        description="Jetic only previews source files up to 1 MB. Download the repository to inspect this file."
      />
    );
  }

  return (
    <MonacoEditor
      height="100%"
      path={file.path}
      language={file.language ?? "plaintext"}
      value={file.content ?? ""}
      theme="jetic-dark"
      beforeMount={defineJeticTheme}
      loading={
        <div className="flex h-full items-center justify-center gap-2 text-[12px] text-[var(--jetic-muted)]">
          <Loader2 size={14} className="animate-spin" />
          Loading editor…
        </div>
      }
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: { enabled: false },
        fontSize: 12.5,
        lineHeight: 20,
        fontFamily:
          "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        renderLineHighlight: "none",
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        glyphMargin: false,
        folding: true,
        lineNumbersMinChars: 3,
        padding: { top: 12, bottom: 12 },
        wordWrap: "off",
        automaticLayout: true,
        contextmenu: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        parameterHints: { enabled: false },
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false,
        },
      }}
    />
  );
}
