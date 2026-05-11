"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useMemeEditor } from "./state/MemeEditorContext";

export default function CanvasSettingsPanel() {
  const { padding, onUpdatePadding } = useMemeEditor();
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const hasPadding = padding.top > 0 || padding.bottom > 0;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-background/40">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            畫布留白
          </span>
          {hasPadding && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
              {Math.round(padding.top * 100)}/{Math.round(padding.bottom * 100)}
            </span>
          )}
        </span>
        <ChevronDownIcon
          aria-hidden
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div id={contentId} className="flex flex-col gap-3 px-3 p-3">
          <Slider
            label={`上方留白 (${(padding.top * 100).toFixed(0)}%)`}
            value={padding.top}
            onChange={(v) => onUpdatePadding({ top: v })}
            ariaLabel="上方留白"
          />

          <Slider
            label={`下方留白 (${(padding.bottom * 100).toFixed(0)}%)`}
            value={padding.bottom}
            onChange={(v) => onUpdatePadding({ bottom: v })}
            ariaLabel="下方留白"
          />

          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted-foreground">留白顏色</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={toHexForColorInput(padding.color)}
                onChange={(e) => onUpdatePadding({ color: e.target.value })}
                aria-label="留白顏色"
                className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0"
              />
              <input
                type="text"
                value={padding.color}
                onChange={(e) => onUpdatePadding({ color: e.target.value })}
                aria-label="留白顏色（hex）"
                spellCheck={false}
                className="h-7 flex-1 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </div>
          </label>

          <div className="flex flex-wrap gap-1">
            <PresetButton
              label="無留白"
              onClick={() => onUpdatePadding({ top: 0, bottom: 0 })}
            />
            <PresetButton
              label="頂部 25%"
              onClick={() =>
                onUpdatePadding({ top: 0.25, color: padding.color })
              }
            />
            <PresetButton
              label="底部 25%"
              onClick={() =>
                onUpdatePadding({ bottom: 0.25, color: padding.color })
              }
            />
            <PresetButton
              label="上下 20%"
              onClick={() => onUpdatePadding({ top: 0.2, bottom: 0.2 })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="w-full"
      />
    </label>
  );
}

function PresetButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border bg-background px-2 py-1 text-[11px] transition-colors hover:bg-muted"
    >
      {label}
    </button>
  );
}

function toHexForColorInput(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#ffffff";
}
