import type {
  CanvasPadding,
  TextLayer,
} from "@/features/templates/types/template-settings";
import {
  composeFrame,
  computeCanvasSize,
  loadCorsImage,
  triggerDownload,
  waitForFonts,
} from "./draw-layer";

type RenderOpts = {
  image: HTMLImageElement;
  imageUrl: string;
  layers: TextLayer[];
  padding: CanvasPadding;
};

type ExportOpts = RenderOpts & {
  filename: string;
};

export async function renderPngBlob({
  image,
  imageUrl,
  layers,
  padding,
}: RenderOpts): Promise<Blob> {
  await waitForFonts();

  const source = await loadCorsImage(image, imageUrl);
  const imageW = source.naturalWidth || source.width;
  const imageH = source.naturalHeight || source.height;
  if (!imageW || !imageH) {
    throw new Error("Image has no intrinsic size");
  }

  const opts = computeCanvasSize(imageW, imageH, padding);

  const canvas = document.createElement("canvas");
  canvas.width = opts.canvasW;
  canvas.height = opts.canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // PNG is a single static frame, so timing windows are irrelevant; pass 0 so
  // layers with a `timing` range that excludes t=0 still render (image-mode
  // never sets `timing`, but be defensive).
  const allVisibleLayers = layers.map((l) => ({ ...l, timing: null }));
  composeFrame(ctx, source, 0, allVisibleLayers, padding, opts);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Failed to encode PNG");
  return blob;
}

export async function exportToPng({ filename, ...rest }: ExportOpts) {
  const blob = await renderPngBlob(rest);
  triggerDownload(blob, filename);
}

export async function copyPngToClipboard(opts: RenderOpts): Promise<void> {
  if (
    typeof navigator === "undefined" ||
    !navigator.clipboard ||
    typeof ClipboardItem === "undefined"
  ) {
    throw new Error("此瀏覽器不支援複製圖片至剪貼簿");
  }
  const blob = await renderPngBlob(opts);
  await navigator.clipboard.write([
    new ClipboardItem({ [blob.type]: blob }),
  ]);
}
