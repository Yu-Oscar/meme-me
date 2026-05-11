"use client";

import { LucidePause, LucidePlay } from "lucide-react";
import type { TextLayer } from "@/features/templates/types/template-settings";
import { cn } from "@/lib/utils";
import { useMemeEditor } from "./state/MemeEditorContext";

export default function TimelinePanel() {
  const {
    mediaKind,
    playback,
    layers,
    selectedId,
    isExporting,
    onSeek,
    onTogglePlay,
    onSelect,
    onUpdateLayer,
  } = useMemeEditor();

  if (mediaKind !== "video") return null;

  const duration = Math.max(0.1, playback.duration || 0);
  const selected = layers.find((l) => l.id === selectedId) ?? null;
  const disabled = isExporting;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3"
      aria-busy={disabled || undefined}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        時間軸
      </h3>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          disabled={disabled}
          aria-label={playback.isPlaying ? "暫停" : "播放"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playback.isPlaying ? (
            <LucidePause aria-hidden className="size-4" />
          ) : (
            <LucidePlay aria-hidden className="size-4" />
          )}
        </button>
        <div className="font-mono text-xs text-muted-foreground">
          {formatTime(playback.currentTime)} / {formatTime(playback.duration)}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={Math.min(playback.currentTime, duration)}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={disabled}
          aria-label="拖曳播放頭"
          className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        />
        <LayerTracks
          layers={layers}
          duration={duration}
          selectedId={selectedId}
          onSelectLayer={onSelect}
          disabled={disabled}
        />
      </div>

      {selected ? (
        <SelectedLayerTiming
          layer={selected}
          duration={duration}
          currentTime={playback.currentTime}
          disabled={disabled}
          onUpdate={(patch) => onUpdateLayer(selected.id, patch)}
        />
      ) : (
        <p className="rounded-md border border-dashed border-border p-2 text-center text-[11px] text-muted-foreground">
          選擇文字層以調整顯示時間
        </p>
      )}
    </div>
  );
}

function LayerTracks({
  layers,
  duration,
  selectedId,
  onSelectLayer,
  disabled,
}: {
  layers: TextLayer[];
  duration: number;
  selectedId: string | null;
  onSelectLayer: (id: string | null) => void;
  disabled?: boolean;
}) {
  if (layers.length === 0) {
    return <div className="h-2 rounded-sm bg-muted/30" aria-hidden />;
  }
  return (
    <div
      className={cn(
        "relative flex flex-col gap-[2px] rounded-sm bg-muted/30 p-[2px]",
        disabled && "opacity-60",
      )}
      aria-label="圖層時間軸總覽"
    >
      {layers.map((layer) => {
        const start = layer.timing?.startTime ?? 0;
        const end = layer.timing?.endTime ?? duration;
        const left = Math.max(0, (start / duration) * 100);
        const width = Math.max(2, ((end - start) / duration) * 100);
        const isSelected = layer.id === selectedId;
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onSelectLayer(layer.id)}
            disabled={disabled}
            aria-pressed={isSelected}
            title={layer.text || "（空白）"}
            className="relative h-2 w-full overflow-hidden rounded-[2px] disabled:cursor-not-allowed"
          >
            <span
              className={cn(
                "absolute top-0 bottom-0 rounded-[2px] transition-colors",
                isSelected ? "bg-primary" : "bg-primary/40 hover:bg-primary/60",
              )}
              style={{
                left: `${left}%`,
                width: `${width}%`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

function SelectedLayerTiming({
  layer,
  duration,
  currentTime,
  disabled,
  onUpdate,
}: {
  layer: TextLayer;
  duration: number;
  currentTime: number;
  disabled?: boolean;
  onUpdate: (patch: Partial<TextLayer>) => void;
}) {
  const timing = layer.timing;
  const startTime = timing?.startTime ?? 0;
  const endTime = timing?.endTime ?? duration;
  const alwaysOn = timing === null;

  const setTiming = (
    patch: Partial<{ startTime: number; endTime: number }>,
  ) => {
    const next = {
      startTime: patch.startTime ?? startTime,
      endTime: patch.endTime ?? endTime,
    };
    next.startTime = clamp(next.startTime, 0, duration);
    next.endTime = clamp(next.endTime, next.startTime, duration);
    onUpdate({ timing: next });
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border/60 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          顯示時段（已選文字）
        </span>
        {!alwaysOn && (
          <button
            type="button"
            onClick={() => onUpdate({ timing: null })}
            disabled={disabled}
            className="text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            全程顯示
          </button>
        )}
      </div>

      {alwaysOn ? (
        <button
          type="button"
          onClick={() =>
            onUpdate({
              timing: {
                startTime: 0,
                endTime: duration,
              },
            })
          }
          disabled={disabled}
          className="rounded-md border border-dashed border-border px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          點擊編輯顯示時長
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-10 shrink-0 text-muted-foreground">開始</span>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.01}
              value={startTime}
              onChange={(e) => setTiming({ startTime: Number(e.target.value) })}
              disabled={disabled}
              aria-label="開始時間"
              className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="w-12 shrink-0 text-right font-mono">
              {formatTime(startTime)}
            </span>
            <button
              type="button"
              onClick={() => setTiming({ startTime: currentTime })}
              disabled={disabled}
              title="設定為目前時間"
              className="rounded-md border border-border px-1.5 py-0.5 text-[10px] transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              現在
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-10 shrink-0 text-muted-foreground">結束</span>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.01}
              value={endTime}
              onChange={(e) => setTiming({ endTime: Number(e.target.value) })}
              disabled={disabled}
              aria-label="結束時間"
              className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="w-12 shrink-0 text-right font-mono">
              {formatTime(endTime)}
            </span>
            <button
              type="button"
              onClick={() => setTiming({ endTime: currentTime })}
              disabled={disabled}
              title="設定為目前時間"
              className="rounded-md border border-border px-1.5 py-0.5 text-[10px] transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              現在
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00.00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds - Math.floor(seconds)) * 100);
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
