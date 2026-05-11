import type {
  CanvasPadding,
  TextLayer,
  TrimRange,
} from "@/features/templates/types/template-settings";
import {
  composeFrame,
  computeCanvasSize,
  triggerDownload,
  waitForFonts,
} from "./draw-layer";

type ExportFormat = "webm" | "mp4";

type ExportVideoOpts = {
  video: HTMLVideoElement;
  layers: TextLayer[];
  padding: CanvasPadding;
  preferredFormat: ExportFormat;
  trim: TrimRange;
  filenameBase: string;
  onProgress?: (ratio: number) => void;
};

type RecorderConfig = {
  mimeType: string;
  extension: "webm" | "mp4";
};

export function pickRecorderConfig(
  preferred: ExportFormat,
): RecorderConfig | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates: RecorderConfig[] =
    preferred === "mp4"
      ? [
          { mimeType: "video/mp4;codecs=avc1", extension: "mp4" },
          { mimeType: "video/webm;codecs=vp9", extension: "webm" },
          { mimeType: "video/webm;codecs=vp8", extension: "webm" },
          { mimeType: "video/webm", extension: "webm" },
        ]
      : [
          { mimeType: "video/webm;codecs=vp9", extension: "webm" },
          { mimeType: "video/webm;codecs=vp8", extension: "webm" },
          { mimeType: "video/webm", extension: "webm" },
          { mimeType: "video/mp4;codecs=avc1", extension: "mp4" },
        ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mimeType)) return c;
  }
  return null;
}

export function isMediaRecorderAvailable(): boolean {
  return pickRecorderConfig("webm") !== null;
}

export async function exportToVideo({
  video,
  layers,
  padding,
  preferredFormat,
  trim,
  filenameBase,
  onProgress,
}: ExportVideoOpts) {
  await waitForFonts();
  const cfg = pickRecorderConfig(preferredFormat);
  if (!cfg) {
    throw new Error("此瀏覽器不支援錄製 WebM / MP4");
  }

  const videoW = video.videoWidth;
  const videoH = video.videoHeight;
  if (!videoW || !videoH) {
    throw new Error("影片尚未載入完整");
  }

  const opts = computeCanvasSize(videoW, videoH, padding);
  const canvas = document.createElement("canvas");
  canvas.width = opts.canvasW;
  canvas.height = opts.canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const startTime = clamp(trim?.startTime ?? 0, 0, duration);
  const fallbackEnd = duration || startTime + 1;
  const endTime = clamp(trim?.endTime ?? fallbackEnd, startTime, fallbackEnd);

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: cfg.mimeType,
    videoBitsPerSecond: 6_000_000,
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  const recorderStopped = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = (e) =>
      reject(e instanceof ErrorEvent ? e.error : new Error("MediaRecorder error"));
  });

  const wasPaused = video.paused;
  const restoreTime = video.currentTime;
  const prevLoop = video.loop;
  // Preview uses loop=true; during export that wraps currentTime back to 0 so we
  // never satisfy t >= endTime and MediaRecorder never stops.
  video.loop = false;

  video.pause();
  await seekTo(video, startTime);

  let stopRequested = false;
  const finishRecording = () => {
    if (stopRequested) return;
    stopRequested = true;
    try {
      recorder.requestData();
    } catch {
      // ignore
    }
    try {
      recorder.stop();
    } catch {
      // ignore
    }
  };

  const onEnded = () => finishRecording();
  video.addEventListener("ended", onEnded);

  // One painted frame before start helps some browsers actually encode.
  composeFrame(ctx, video, video.currentTime, layers, padding, opts);
  recorder.start(100);

  const span = Math.max(0.0001, endTime - startTime);
  onProgress?.(0);
  const tick = () => {
    if (stopRequested) return;
    const t = video.currentTime;
    composeFrame(ctx, video, t, layers, padding, opts);
    onProgress?.(Math.max(0, Math.min(1, (t - startTime) / span)));
    // Small slack: last decoded frame is often just shy of duration.
    if (video.ended || t >= endTime - 1 / 60) {
      onProgress?.(1);
      finishRecording();
      return;
    }
    requestAnimationFrame(tick);
  };

  try {
    await video.play();
  } catch (err) {
    video.removeEventListener("ended", onEnded);
    video.loop = prevLoop;
    finishRecording();
    video.pause();
    throw err;
  }
  requestAnimationFrame(tick);

  const exportBudgetMs = Math.min(
    600_000,
    Math.max(45_000, (endTime - startTime) * 1000 + 20_000),
  );
  const timeoutErr = new Error("匯出逾時，請再試或改用 GIF");
  let watchdog: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      recorderStopped,
      new Promise<void>((_, reject) => {
        watchdog = setTimeout(() => {
          finishRecording();
          reject(timeoutErr);
        }, exportBudgetMs);
      }),
    ]);
  } finally {
    if (watchdog !== undefined) clearTimeout(watchdog);
    video.removeEventListener("ended", onEnded);
    video.loop = prevLoop;
    video.pause();
    if (!wasPaused) {
      try {
        await seekTo(video, restoreTime);
      } catch {
        // ignore
      }
    }
  }

  const blob = new Blob(chunks, { type: cfg.mimeType });
  triggerDownload(blob, `${filenameBase}.${cfg.extension}`);
}

type ExportGifOpts = {
  video: HTMLVideoElement;
  layers: TextLayer[];
  padding: CanvasPadding;
  trim: TrimRange;
  filename: string;
  fps?: number;
  maxDurationSec?: number;
  onProgress?: (done: number, total: number) => void;
};

const GIF_MAX_DURATION_SEC = 10;

export async function exportToGif({
  video,
  layers,
  padding,
  trim,
  filename,
  fps = 15,
  maxDurationSec = GIF_MAX_DURATION_SEC,
  onProgress,
}: ExportGifOpts) {
  await waitForFonts();

  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  const videoW = video.videoWidth;
  const videoH = video.videoHeight;
  if (!videoW || !videoH) {
    throw new Error("影片尚未載入完整");
  }

  const opts = computeCanvasSize(videoW, videoH, padding);
  const canvas = document.createElement("canvas");
  canvas.width = opts.canvasW;
  canvas.height = opts.canvasH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  const startTime = clamp(trim?.startTime ?? 0, 0, duration);
  const rawEnd = trim?.endTime ?? duration;
  const cappedEnd = Math.min(rawEnd, startTime + maxDurationSec);
  const endTime = clamp(cappedEnd, startTime, duration || startTime + 1);
  const total = Math.max(0, endTime - startTime);
  const frameCount = Math.max(1, Math.floor(total * fps));
  const delay = Math.round(1000 / fps);

  const wasPaused = video.paused;
  const restoreTime = video.currentTime;
  video.pause();

  const gif = GIFEncoder();
  try {
    for (let i = 0; i < frameCount; i++) {
      const t = startTime + i / fps;
      await seekTo(video, t);
      composeFrame(ctx, video, t, layers, padding, opts);
      const { data, width, height } = ctx.getImageData(
        0,
        0,
        opts.canvasW,
        opts.canvasH,
      );
      const palette = quantize(data, 256);
      const index = applyPalette(data, palette);
      gif.writeFrame(index, width, height, { palette, delay });
      onProgress?.(i + 1, frameCount);
      if (i % 2 === 0) {
        await yieldToBrowser();
      }
    }
    gif.finish();
    const bytes: Uint8Array = gif.bytesView();
    const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
    triggerDownload(blob, filename);
  } finally {
    if (!wasPaused) {
      try {
        await seekTo(video, restoreTime);
      } catch {
        // ignore
      }
    }
  }
}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const target = Math.max(0, t);
    if (Math.abs(video.currentTime - target) < 0.001) {
      resolve();
      return;
    }
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Video seek failed"));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.currentTime = target;
  });
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function clamp(v: number, lo: number, hi: number): number {
  if (!Number.isFinite(v)) return lo;
  return Math.max(lo, Math.min(hi, v));
}
