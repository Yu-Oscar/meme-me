"use client";

import type { TextLayer } from "@/features/templates/types/template-settings";
import { cn } from "@/lib/utils";
import {
  LucideAlignCenter,
  LucideAlignLeft,
  LucideAlignRight,
  LucideBold,
  LucideItalic,
} from "lucide-react";

type Props = {
  layer: TextLayer;
  onUpdate: (patch: Partial<TextLayer>) => void;
};

const FONT_OPTIONS = [
  {
    label: "微軟正黑體",
    value: "'Microsoft JhengHei', '微軟正黑體', sans-serif",
  },
  { label: "黑體", value: "'Heiti TC', '黑體-繁', sans-serif" },
  { label: "新細明體", value: "'PMingLiU', '新細明體', serif" },
];

const WEIGHT_OPTIONS: Array<{ label: string; value: number }> = [
  { label: "400", value: 400 },
  { label: "600", value: 600 },
  { label: "700", value: 700 },
  { label: "900", value: 900 },
];

function normalizeWeight(weight: TextLayer["fontWeight"]): number {
  if (typeof weight === "number") return weight;
  if (weight === "bold") return 700;
  return 400;
}

export default function TextStylePanel({ layer, onUpdate }: Props) {
  const currentWeight = normalizeWeight(layer.fontWeight);
  const strokeEnabled = (layer.stroke?.width ?? 0) > 0;
  const bgEnabled = layer.background != null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        文字樣式
      </h3>

      <Field label="字型">
        <select
          className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
          value={layer.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          aria-label="字型"
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`字體大小 (${(layer.fontSize * 100).toFixed(1)}%)`}>
        <input
          type="range"
          min={0.02}
          max={0.3}
          step={0.005}
          value={layer.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          aria-label="字號"
          className="w-full"
        />
      </Field>

      <Field label={`框寬度 (${Math.round(layer.width * 100)}%)`}>
        <input
          type="range"
          min={0.05}
          max={1}
          step={0.01}
          value={layer.width}
          onChange={(e) => onUpdate({ width: Number(e.target.value) })}
          aria-label="文字框寬度"
          className="w-full"
        />
      </Field>

      <Field label="字重">
        <SegmentedGroup
          aria-label="字重"
          options={WEIGHT_OPTIONS}
          value={currentWeight}
          onChange={(v) => onUpdate({ fontWeight: v >= 700 ? "bold" : v })}
        />
      </Field>

      <div className="flex items-center gap-2">
        <ToggleButton
          aria-label="斜體"
          pressed={layer.fontStyle === "italic"}
          onClick={() =>
            onUpdate({
              fontStyle: layer.fontStyle === "italic" ? "normal" : "italic",
            })
          }
        >
          <LucideItalic aria-hidden className="w-4 h-4" />
        </ToggleButton>
        <ToggleButton
          aria-label="粗體"
          pressed={currentWeight >= 700}
          onClick={() =>
            onUpdate({ fontWeight: currentWeight >= 700 ? 400 : "bold" })
          }
        >
          <LucideBold aria-hidden className="w-4 h-4" />
        </ToggleButton>
        <div className="ml-auto flex items-center gap-1">
          <AlignButton
            current={layer.textAlign}
            value="left"
            onClick={() => onUpdate({ textAlign: "left" })}
            label="靠左"
          >
            <LucideAlignLeft aria-hidden className="w-4 h-4" />
          </AlignButton>
          <AlignButton
            current={layer.textAlign}
            value="center"
            onClick={() => onUpdate({ textAlign: "center" })}
            label="置中"
          >
            <LucideAlignCenter aria-hidden className="w-4 h-4" />
          </AlignButton>
          <AlignButton
            current={layer.textAlign}
            value="right"
            onClick={() => onUpdate({ textAlign: "right" })}
            label="靠右"
          >
            <LucideAlignRight aria-hidden className="w-4 h-4" />
          </AlignButton>
        </div>
      </div>

      <Field label="文字顏色">
        <ColorRow
          color={layer.color}
          onChange={(c) => onUpdate({ color: c })}
          ariaLabel="文字顏色"
        />
      </Field>

      <div className="flex flex-col gap-2 rounded-md border border-border/60 p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">外框 (描邊)</span>
          <ToggleSwitch
            checked={strokeEnabled}
            onChange={(on) =>
              onUpdate({
                stroke: on
                  ? { color: layer.stroke?.color ?? "#000000", width: 0.004 }
                  : { color: layer.stroke?.color ?? "#000000", width: 0 },
              })
            }
            ariaLabel="切換外框"
          />
        </div>
        {strokeEnabled && layer.stroke && (
          <>
            <ColorRow
              color={layer.stroke.color}
              onChange={(c) =>
                onUpdate({
                  stroke: { color: c, width: layer.stroke?.width ?? 0.004 },
                })
              }
              ariaLabel="外框顏色"
            />
            <label className="flex items-center gap-2 text-xs">
              <span className="w-12 shrink-0 text-muted-foreground">粗幼</span>
              <input
                type="range"
                min={0.001}
                max={0.02}
                step={0.0005}
                value={layer.stroke.width}
                onChange={(e) =>
                  onUpdate({
                    stroke: {
                      color: layer.stroke?.color ?? "#000000",
                      width: Number(e.target.value),
                    },
                  })
                }
                aria-label="外框粗幼"
                className="w-full"
              />
            </label>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-border/60 p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">背景填色</span>
          <ToggleSwitch
            checked={bgEnabled}
            onChange={(on) => onUpdate({ background: on ? "#000000" : null })}
            ariaLabel="切換背景"
          />
        </div>
        {bgEnabled && (
          <ColorRow
            color={layer.background ?? "#000000"}
            onChange={(c) => onUpdate({ background: c })}
            ariaLabel="背景顏色"
          />
        )}
      </div>

      <Field label={`不透明度 (${Math.round(layer.opacity * 100)}%)`}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={layer.opacity}
          onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
          aria-label="不透明度"
          className="w-full"
        />
      </Field>

      <Field label={`旋轉 (${Math.round(layer.rotation)}°)`}>
        <input
          type="range"
          min={-180}
          max={180}
          step={1}
          value={layer.rotation}
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
          aria-label="旋轉"
          className="w-full"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SegmentedGroup<T extends string | number>({
  options,
  value,
  onChange,
  ...rest
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (v: T) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  return (
    <div
      role="group"
      className="inline-flex overflow-hidden rounded-md border border-border"
      {...rest}
    >
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-2.5 py-1 text-xs transition-colors",
            value === opt.value
              ? "bg-primary text-background"
              : "bg-background hover:bg-muted",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ToggleButton({
  pressed,
  children,
  ...rest
}: {
  pressed: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors",
        pressed ? "bg-primary text-background" : "bg-background hover:bg-muted",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function AlignButton({
  current,
  value,
  label,
  onClick,
  children,
}: {
  current: TextLayer["textAlign"];
  value: TextLayer["textAlign"];
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <ToggleButton
      pressed={current === value}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </ToggleButton>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function ColorRow({
  color,
  onChange,
  ariaLabel,
}: {
  color: string;
  onChange: (c: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={toHexForColorInput(color)}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${ariaLabel}（hex）`}
        spellCheck={false}
        className="h-7 flex-1 rounded-md border border-input bg-background px-2 font-mono text-xs"
      />
    </div>
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
  return "#000000";
}
