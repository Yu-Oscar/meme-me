"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LucideChevronDown,
  LucideCopy,
  LucideDownload,
  LucideLoaderCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMemeEditorOptional } from "./state/MemeEditorContext";

function clipboardSupportsImage(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    typeof ClipboardItem !== "undefined"
  );
}

type VideoSupport = {
  format: "webm" | "mp4";
  label: string;
} | null;

function detectVideoSupport(): VideoSupport {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return null;
  }
  if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
    return { format: "mp4", label: "下載 MP4" };
  }
  if (
    MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ||
    MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ||
    MediaRecorder.isTypeSupported("video/webm")
  ) {
    return { format: "webm", label: "下載 WebM" };
  }
  return null;
}

type Props = {
  className?: string;
};

export default function DownloadAction({ className }: Props) {
  const ctx = useMemeEditorOptional();
  const videoSupport = useMemo<VideoSupport>(
    () => (ctx?.mediaKind === "video" ? detectVideoSupport() : null),
    [ctx?.mediaKind],
  );
  const [canCopyImage, setCanCopyImage] = useState(false);
  useEffect(() => {
    if (ctx?.mediaKind !== "image") {
      setCanCopyImage(false);
      return;
    }
    setCanCopyImage(clipboardSupportsImage());
  }, [ctx?.mediaKind]);

  if (!ctx) return null;
  const { mediaKind, isExporting, onExport, onCopyImage } = ctx;

  const baseBtnClass = cn(
    "inline-flex cursor-pointer items-center justify-center rounded p-0.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70",
    className,
  );

  if (mediaKind === "image") {
    return (
      <>
        {canCopyImage && (
          <button
            type="button"
            aria-label={isExporting ? "處理中" : "複製圖片至剪貼簿"}
            title="複製圖片至剪貼簿"
            disabled={isExporting}
            onClick={() => {
              void onCopyImage();
            }}
            className={baseBtnClass}
          >
            <LucideCopy className="text-neutral-400" />
          </button>
        )}
        <button
          type="button"
          aria-label={isExporting ? "匯出中" : "下載 PNG"}
          disabled={isExporting}
          onClick={() => {
            void onExport("png");
          }}
          className={baseBtnClass}
        >
          {isExporting ? (
            <LucideLoaderCircle className="animate-spin text-primary" />
          ) : (
            <LucideDownload className="text-neutral-400" />
          )}
        </button>
      </>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={isExporting ? "匯出中" : "下載選項"}
          disabled={isExporting}
          className={cn(baseBtnClass, "gap-0.5")}
        >
          {isExporting ? (
            <LucideLoaderCircle className="animate-spin text-primary" />
          ) : (
            <>
              <LucideDownload className="text-neutral-400" />
              <LucideChevronDown
                aria-hidden
                className="size-3 text-neutral-400"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {videoSupport ? (
          <DropdownMenuItem
            onSelect={() => {
              void onExport(videoSupport.format);
            }}
          >
            {videoSupport.label}
            <span className="ms-auto text-[10px] text-muted-foreground">
              推薦
            </span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>不支援錄製影片</DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => {
            void onExport("gif");
          }}
        >
          下載 GIF
          <span className="ms-auto text-[10px] text-muted-foreground">
            較慢
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
