import type {
  CanvasPadding,
  TextLayer,
} from "@/features/templates/types/template-settings";

export type FrameSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap;

export type ComposeOpts = {
  canvasW: number;
  canvasH: number;
  imageOffsetY: number;
  imageW: number;
  imageH: number;
};

export function computeCanvasSize(
  mediaW: number,
  mediaH: number,
  padding: CanvasPadding,
): ComposeOpts {
  const topPx = Math.max(0, padding.top * mediaH);
  const bottomPx = Math.max(0, padding.bottom * mediaH);
  return {
    canvasW: mediaW,
    canvasH: mediaH + topPx + bottomPx,
    imageOffsetY: topPx,
    imageW: mediaW,
    imageH: mediaH,
  };
}

export function composeFrame(
  ctx: CanvasRenderingContext2D,
  frameSource: FrameSource,
  currentTime: number,
  layers: TextLayer[],
  padding: CanvasPadding,
  opts: ComposeOpts,
) {
  const { canvasW, canvasH, imageOffsetY, imageW, imageH } = opts;

  if (padding.top > 0 || padding.bottom > 0) {
    ctx.fillStyle = padding.color;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
  ctx.drawImage(frameSource, 0, imageOffsetY, imageW, imageH);

  for (const layer of layers) {
    if (!isLayerVisibleAt(layer, currentTime)) continue;
    drawLayer(ctx, layer, canvasW, canvasH);
  }
}

export function isLayerVisibleAt(layer: TextLayer, t: number): boolean {
  if (!layer.timing) return true;
  return t >= layer.timing.startTime && t <= layer.timing.endTime;
}

export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  w: number,
  h: number,
) {
  const text = (layer.text ?? "").trim() === "" ? "" : layer.text;
  if (!text) return;

  const fontSizePx = Math.max(1, layer.fontSize * h);
  const boxWidthPx = Math.max(20, layer.width * w);
  const cssFontFamily = layer.fontFamily;
  const resolvedFamily = resolveFontFamily(cssFontFamily, layer);
  const weight = layer.fontWeight;
  const fontStyle = layer.fontStyle;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  const cx = layer.x * w;
  const cy = layer.y * h;
  ctx.translate(cx, cy);
  if (layer.rotation) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  ctx.font = `${fontStyle} ${weight} ${fontSizePx}px ${resolvedFamily}`;
  ctx.textBaseline = "middle";

  const lines = wrapLines(ctx, text, boxWidthPx);
  const lineHeight = fontSizePx * 1.2;
  const totalH = lines.length * lineHeight;

  if (layer.background) {
    const padX = fontSizePx * 0.3;
    const padY = fontSizePx * 0.15;
    let maxLineW = 0;
    for (const line of lines) {
      const m = ctx.measureText(line).width;
      if (m > maxLineW) maxLineW = m;
    }
    const bgW = Math.min(boxWidthPx, maxLineW) + padX * 2;
    const bgH = totalH + padY * 2;
    ctx.fillStyle = layer.background;
    const radius = Math.min(fontSizePx * 0.15, 12);
    roundRect(ctx, -bgW / 2, -bgH / 2, bgW, bgH, radius);
    ctx.fill();
  }

  const startY = -totalH / 2 + lineHeight / 2;
  ctx.textAlign = layer.textAlign as CanvasTextAlign;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const y = startY + i * lineHeight;
    const x =
      layer.textAlign === "left"
        ? -boxWidthPx / 2
        : layer.textAlign === "right"
          ? boxWidthPx / 2
          : 0;

    if (layer.stroke && layer.stroke.width > 0) {
      ctx.lineWidth = Math.max(1, layer.stroke.width * h);
      ctx.strokeStyle = layer.stroke.color;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(line, x, y);
    }

    ctx.fillStyle = layer.color;
    ctx.fillText(line, x, y);
  }

  ctx.restore();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const result: string[] = [];
  const paragraphs = text.split(/\r?\n/);
  for (const paragraph of paragraphs) {
    if (!paragraph) {
      result.push("");
      continue;
    }
    const tokens = paragraph.split(/(\s+)/);
    let line = "";
    for (const tok of tokens) {
      const candidate = line + tok;
      if (ctx.measureText(candidate).width <= maxWidth || line === "") {
        line = candidate;
      } else {
        result.push(line.trimEnd());
        line = tok.trimStart();
      }
    }
    if (line) {
      const wrapped = breakLongLine(ctx, line, maxWidth);
      result.push(...wrapped);
    }
  }
  return result.length ? result : [""];
}

function breakLongLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  maxWidth: number,
): string[] {
  if (ctx.measureText(line).width <= maxWidth) return [line];
  const out: string[] = [];
  let current = "";
  for (const char of line) {
    const candidate = current + char;
    if (ctx.measureText(candidate).width <= maxWidth || current === "") {
      current = candidate;
    } else {
      out.push(current);
      current = char;
    }
  }
  if (current) out.push(current);
  return out;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function resolveFontFamily(value: string, layer: TextLayer): string {
  if (typeof document === "undefined") return value;
  if (!value.includes("var(")) return value;
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.fontFamily = value;
  probe.style.fontWeight = String(layer.fontWeight);
  probe.style.fontStyle = layer.fontStyle;
  probe.textContent = "M";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).fontFamily;
  document.body.removeChild(probe);
  return resolved || value;
}

export async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined") return;
  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function loadCorsImage(
  existing: HTMLImageElement,
  url: string,
): Promise<HTMLImageElement> {
  if (
    existing.crossOrigin === "anonymous" &&
    existing.complete &&
    existing.naturalWidth > 0
  ) {
    return existing;
  }
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = url;
  await img.decode();
  return img;
}
