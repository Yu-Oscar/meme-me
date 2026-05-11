"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { TextLayer as TextLayerType } from "@/features/templates/types/template-settings";
import { useDraggable } from "./hooks/useDraggable";
import { useMemeEditor } from "./state/MemeEditorContext";
import { cn } from "@/lib/utils";

type Props = {
  layer: TextLayerType;
  isSelected: boolean;
  stageSize: { width: number; height: number };
  getStageRect: () => DOMRect | null;
  onSelect: () => void;
  onUpdate: (patch: Partial<TextLayerType>) => void;
  onDelete: () => void;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function TextLayer({
  layer,
  isSelected,
  stageSize,
  getStageRect,
  onSelect,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<{
    width: number;
    fontSize: number;
  } | null>(null);
  const { playback, mediaKind } = useMemeEditor();
  const inTimingWindow =
    mediaKind !== "video" ||
    !layer.timing ||
    (playback.currentTime >= layer.timing.startTime &&
      playback.currentTime <= layer.timing.endTime);
  const visualHidden = !inTimingWindow;

  const drag = useDraggable({
    enabled: !isEditing,
    getStageRect,
    onStart: () => {
      dragStartRef.current = { x: layer.x, y: layer.y };
      onSelect();
    },
    onMove: (dx, dy) => {
      const s = dragStartRef.current;
      if (!s) return;
      onUpdate({ x: clamp01(s.x + dx), y: clamp01(s.y + dy) });
    },
    onEnd: () => {
      dragStartRef.current = null;
    },
  });

  const resize = useDraggable({
    enabled: isSelected && !isEditing,
    getStageRect,
    onStart: () => {
      resizeStartRef.current = { width: layer.width, fontSize: layer.fontSize };
    },
    onMove: (dx) => {
      const s = resizeStartRef.current;
      if (!s) return;
      const scale = (s.width + dx * 2) / s.width;
      const nextWidth = Math.max(0.05, Math.min(1, s.width + dx * 2));
      const nextFont = Math.max(
        0.01,
        Math.min(0.5, s.fontSize * (nextWidth / s.width || 1)),
      );
      onUpdate({
        width: nextWidth,
        fontSize: Number.isFinite(scale) ? nextFont : s.fontSize,
      });
    },
    onEnd: () => {
      resizeStartRef.current = null;
    },
  });

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isEditing) {
      if (el.textContent !== layer.text) el.textContent = layer.text;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else {
      if (el.textContent !== layer.text) el.textContent = layer.text || "";
    }
  }, [isEditing, layer.text]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (isEditing) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
      }
      return;
    }

    const step = (e.shiftKey ? 0.1 : 0.01) * (e.altKey ? 0.1 : 1);
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onUpdate({ x: clamp01(layer.x - step) });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onUpdate({ x: clamp01(layer.x + step) });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onUpdate({ y: clamp01(layer.y - step) });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onUpdate({ y: clamp01(layer.y + step) });
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete();
    } else if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(true);
    }
  };

  const fontSizePx = layer.fontSize * stageSize.height;
  const strokeWidthPx = layer.stroke
    ? Math.max(0, layer.stroke.width * stageSize.height)
    : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Text layer: ${layer.text || "empty"}`}
      onKeyDown={handleKeyDown}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
      onPointerCancel={drag.onPointerCancel}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      onFocus={onSelect}
      style={{
        position: "absolute",
        left: `${layer.x * 100}%`,
        top: `${layer.y * 100}%`,
        width: `${layer.width * 100}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
        transformOrigin: "center",
        touchAction: isEditing ? "auto" : "none",
        userSelect: isEditing ? "text" : "none",
        cursor: isEditing ? "text" : "move",
        opacity:
          visualHidden && isSelected ? layer.opacity * 0.4 : layer.opacity,
        outline: "none",
        visibility: visualHidden && !isSelected ? "hidden" : "visible",
        pointerEvents: visualHidden && !isSelected ? "none" : undefined,
      }}
      className={cn(
        "rounded-sm",
        isSelected && !isEditing && "ring-1 ring-primary/80 ring-offset-0",
      )}
    >
      <div
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          setIsEditing(false);
          const next = e.currentTarget.innerText;
          if (next !== layer.text) onUpdate({ text: next });
        }}
        spellCheck={false}
        style={{
          fontFamily: layer.fontFamily,
          fontWeight: layer.fontWeight,
          fontStyle: layer.fontStyle,
          fontSize: `${fontSizePx}px`,
          lineHeight: 1.2,
          textAlign: layer.textAlign,
          color: layer.color,
          background: layer.background ?? "transparent",
          WebkitTextStroke:
            strokeWidthPx > 0 && layer.stroke
              ? `${strokeWidthPx}px ${layer.stroke.color}`
              : undefined,
          paintOrder: "stroke fill",
          padding: layer.background ? "0.15em 0.3em" : 0,
          borderRadius: layer.background ? "0.15em" : 0,
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          outline: "none",
          minHeight: "1em",
        }}
      />
      {!layer.text && !isEditing && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            textAlign: "center",
            fontSize: `${fontSizePx * 0.5}px`,
            color: "rgba(255,255,255,0.4)",
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          雙擊輸入文字
        </span>
      )}

      {isSelected && !isEditing && (
        <span
          aria-label="調整大小"
          role="slider"
          onPointerDown={resize.onPointerDown}
          onPointerMove={resize.onPointerMove}
          onPointerUp={resize.onPointerUp}
          onPointerCancel={resize.onPointerCancel}
          style={{
            position: "absolute",
            right: -9,
            bottom: -9,
            width: 18,
            height: 18,
            background: "#ffffff",
            border: "2px solid var(--primary, #2563eb)",
            borderRadius: 9999,
            touchAction: "none",
            cursor: "nwse-resize",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}
        />
      )}
    </div>
  );
}
