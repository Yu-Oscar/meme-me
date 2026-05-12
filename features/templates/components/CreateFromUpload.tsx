"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LucideImagePlus, LucideUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseTemplateSettings } from "@/features/templates/utils/parse-template-settings";
import type { MediaKind } from "@/features/templates/components/MemeEditor/state/MemeEditorContext";
import {
  MemeEditorDownloadAction,
  MemeEditorProvider,
  MemeEditorSidebar,
  MemeEditorStage,
} from "@/features/templates/components/MemeEditor";

type ReadyUpload = {
  objectUrl: string;
  mediaKind: MediaKind;
  /** Base name for exports (no extension) */
  displayName: string;
};

function stripExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  if (i <= 0) return filename;
  return filename.slice(0, i);
}

function classifyUpload(
  file: File,
): { mediaKind: MediaKind } | { error: string } {
  const lower = file.name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const ext = dot >= 0 ? lower.slice(dot) : "";

  if (file.type === "image/gif" || ext === ".gif") {
    return { error: "不支援 GIF，請上傳其他圖片格式或 MP4 影片" };
  }

  if (file.type.startsWith("video/") && file.type !== "video/mp4") {
    return { error: "只支援 MP4 影片" };
  }

  if (file.type === "video/mp4" || ext === ".mp4") {
    return { mediaKind: "video" };
  }

  if (file.type.startsWith("image/")) {
    return { mediaKind: "image" };
  }

  if ([".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp"].includes(ext)) {
    return { mediaKind: "image" };
  }

  return { error: "請上傳圖片（不含 GIF）或 MP4 影片" };
}

const ACCEPT_ATTR =
  "image/jpeg,image/png,image/webp,image/avif,image/bmp,.jpg,.jpeg,.png,.webp,.avif,.bmp,video/mp4,.mp4";

export default function CreateFromUpload() {
  const [ready, setReady] = useState<ReadyUpload | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialSettings = useMemo(() => parseTemplateSettings(null), []);

  useEffect(() => {
    return () => {
      if (ready?.objectUrl) URL.revokeObjectURL(ready.objectUrl);
    };
  }, [ready?.objectUrl]);

  const applyFile = useCallback((file: File | undefined) => {
    if (!file) return;

    const result = classifyUpload(file);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setReady((prev) => {
      if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      const objectUrl = URL.createObjectURL(file);
      return {
        objectUrl,
        mediaKind: result.mediaKind,
        displayName: stripExtension(file.name) || "meme",
      };
    });
  }, []);

  const clearUpload = useCallback(() => {
    setReady((prev) => {
      if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      return null;
    });
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      applyFile(e.target.files?.[0]);
      e.target.value = "";
    },
    [applyFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      applyFile(e.dataTransfer.files?.[0]);
    },
    [applyFile],
  );

  if (!ready) {
    const uploadId = "create-meme-upload-input";
    return (
      <div className="container mx-auto flex flex-1 flex-col gap-4 px-4 py-8">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="mb-1 text-lg font-semibold text-foreground">
            上傳製作 Meme
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">
            支援圖片（不含 GIF）或 MP4
            影片。檔案只會在瀏覽器處理，不會上載到伺服器。
          </p>
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`rounded-xl border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-background/40 hover:border-muted-foreground/40"
            }`}
          >
            <input
              ref={inputRef}
              id={uploadId}
              type="file"
              accept={ACCEPT_ATTR}
              className="sr-only"
              aria-label="上傳圖片或 MP4"
              onChange={onInputChange}
            />
            <label
              htmlFor={uploadId}
              className="flex cursor-pointer flex-col items-center justify-center gap-4 p-10"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <LucideUpload
                  className="size-7 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  拖曳檔案到此，或點擊選擇
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG、JPG、WebP、AVIF、BMP、MP4
                </p>
              </div>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-background">
                <LucideImagePlus className="size-4" aria-hidden />
                選擇檔案
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MemeEditorProvider
      key={ready.objectUrl}
      mediaKind={ready.mediaKind}
      mediaUrl={ready.objectUrl}
      templateName={ready.displayName}
      initialSettings={initialSettings}
    >
      <div className="container px-4 mx-auto flex flex-1 flex-col gap-4 py-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:w-[70%]">
          <MemeEditorStage
            imageAlt={ready.displayName}
            className="mx-auto max-w-xl"
          />
          <div className="flex flex-wrap items-center gap-2 rounded-lg justify-end p-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearUpload}
            >
              更換檔案
            </Button>
            <MemeEditorDownloadAction />
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-[30%]">
          <MemeEditorSidebar />
        </div>
      </div>
    </MemeEditorProvider>
  );
}
