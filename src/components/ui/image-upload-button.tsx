"use client";

import { useRef, useState, type ReactNode } from "react";
import { Upload } from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

export function ImageUploadButton({
  endpoint,
  input,
  onUploaded,
  onError,
  disabled = false,
  children = "Upload image",
  className,
  accept = "image/png,image/jpeg,image/webp,image/gif",
}: {
  endpoint: "workspaceIcon" | "userAvatar";
  input?: unknown;
  onUploaded: (url: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  accept?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: setProgress,
    onUploadError: (cause) => {
      setError(cause.message);
      onError?.(cause.message);
    },
  });

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);
    try {
      const result = await startUpload([file], input as never);
      const uploaded = result?.[0];
      const url = uploaded?.serverData?.url ?? uploaded?.ufsUrl;
      if (!url) {
        throw new Error("The upload did not return a file URL.");
      }
      onUploaded(url);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to upload that image.";
      setError(message);
      onError?.(message);
    }
  };

  return (
    <div className="flex min-w-0 flex-col items-start gap-1.5">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      >
        <Upload size={13} />
        {isUploading ? `Uploading${progress > 0 ? ` ${progress}%` : "…"}` : children}
      </button>
      {isUploading && (
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-150"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="max-w-[280px] text-[11px] leading-4 text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
