export type Size = { width: number; height: number };

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function toPx(norm: number, dim: number): number {
  return norm * dim;
}

export function toNorm(px: number, dim: number): number {
  if (dim <= 0) return 0;
  return px / dim;
}
