"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type DraggableOpts = {
  enabled: boolean;
  getStageRect: () => DOMRect | null;
  onStart?: () => void;
  onMove: (dxNorm: number, dyNorm: number) => void;
  onEnd?: () => void;
};

type DragStart = {
  pointerId: number;
  clientX: number;
  clientY: number;
  rectW: number;
  rectH: number;
};

export function useDraggable(opts: DraggableOpts) {
  const startRef = useRef<DragStart | null>(null);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!opts.enabled) return;
    if (e.button !== undefined && e.button !== 0) return;
    const rect = opts.getStageRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
    startRef.current = {
      pointerId: e.pointerId,
      clientX: e.clientX,
      clientY: e.clientY,
      rectW: rect.width,
      rectH: rect.height,
    };
    opts.onStart?.();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const s = startRef.current;
    if (!s || s.pointerId !== e.pointerId) return;
    const dxNorm = (e.clientX - s.clientX) / s.rectW;
    const dyNorm = (e.clientY - s.clientY) / s.rectH;
    opts.onMove(dxNorm, dyNorm);
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    const s = startRef.current;
    if (!s || s.pointerId !== e.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // capture already released
    }
    startRef.current = null;
    opts.onEnd?.();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}
