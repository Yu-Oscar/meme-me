import type { TrimRange } from "@/features/templates/types/template-settings";

/** GIF exports cap length so encoding stays bounded. */
export const GIF_EXPORT_MAX_SPAN_SEC = 20;

const MIN_GIF_FRAME_MS = 20;

function clamp(v: number, lo: number, hi: number): number {
  if (!Number.isFinite(v)) return lo;
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Single source of truth for export in/out points. Video and GIF use the same
 * trim + clamp rules; GIF may additionally pass `maxSpanSec` to cap length.
 */
export function resolveExportSpan(args: {
  mediaDurationSec: number;
  trim: TrimRange;
  maxSpanSec?: number;
}): { startTime: number; endTime: number; spanSec: number } {
  const duration = Number.isFinite(args.mediaDurationSec)
    ? args.mediaDurationSec
    : 0;
  const startTime = clamp(args.trim?.startTime ?? 0, 0, duration);

  const defaultEnd = duration > 0 ? duration : startTime + 1;
  let candidateEnd = args.trim?.endTime ?? defaultEnd;
  if (args.maxSpanSec !== undefined) {
    candidateEnd = Math.min(candidateEnd, startTime + args.maxSpanSec);
  }
  const endTime = clamp(candidateEnd, startTime, defaultEnd);
  const spanSec = Math.max(0, endTime - startTime);
  return { startTime, endTime, spanSec };
}

/**
 * Sample timestamps from exact start through exact end (inclusive), and per-frame
 * delays whose sum equals `round(spanSec * 1000)` ms so GIF runtime matches the span.
 */
export function buildGifFrameSchedule(
  startTime: number,
  endTime: number,
  fps: number,
): { times: number[]; delaysMs: number[] } {
  const spanSec = Math.max(0, endTime - startTime);
  const spanMs = Math.max(0, Math.round(spanSec * 1000));

  let frameCount = Math.max(1, Math.ceil(spanSec * fps - 1e-9));
  while (frameCount > 1 && spanMs < frameCount * MIN_GIF_FRAME_MS) {
    frameCount--;
  }

  const times: number[] = [];
  if (frameCount === 1) {
    times.push(startTime);
  } else {
    for (let i = 0; i < frameCount; i++) {
      times.push(startTime + (spanSec * i) / (frameCount - 1));
    }
  }

  const delaysMs = distributeGifDelaysMs(spanMs, frameCount);
  return { times, delaysMs };
}

function distributeGifDelaysMs(spanMs: number, frameCount: number): number[] {
  if (frameCount === 1) {
    return [Math.max(MIN_GIF_FRAME_MS, spanMs || MIN_GIF_FRAME_MS)];
  }

  const base = Math.floor(spanMs / frameCount);
  let rem = spanMs - base * frameCount;
  const out: number[] = [];
  for (let i = 0; i < frameCount; i++) {
    const d = base + (i < rem ? 1 : 0);
    out.push(Math.max(MIN_GIF_FRAME_MS, d));
  }

  const sum = out.reduce((a, b) => a + b, 0);
  const diff = spanMs - sum;
  out[frameCount - 1] = Math.max(
    MIN_GIF_FRAME_MS,
    out[frameCount - 1]! + diff,
  );
  return out;
}

/** Stop video export once playback reaches the resolved end (no early 1/60 cut). */
export function isPastExportEnd(
  t: number,
  endTime: number,
  videoEnded: boolean,
): boolean {
  if (videoEnded) return true;
  return t + 1e-4 >= endTime;
}
