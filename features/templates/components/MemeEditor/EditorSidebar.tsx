"use client";

import CanvasSettingsPanel from "./CanvasSettingsPanel";
import LayerToolbar from "./LayerToolbar";
import TextStylePanel from "./TextStylePanel";
import TimelinePanel from "./TimelinePanel";
import { useMemeEditor } from "./state/MemeEditorContext";

type Props = {
  className?: string;
};

export default function EditorSidebar({ className }: Props) {
  const {
    layers,
    selectedId,
    mediaKind,
    onSelect,
    onUpdateLayer,
    onAdd,
    onDuplicate,
    onDelete,
    onMoveUp,
    onMoveDown,
    onReset,
  } = useMemeEditor();

  const selected = layers.find((l) => l.id === selectedId) ?? null;

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <LayerToolbar
        hasSelection={Boolean(selected)}
        onAdd={onAdd}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onReset={onReset}
      />

      {mediaKind === "video" && <TimelinePanel />}

      <CanvasSettingsPanel />

      {layers.length > 0 && (
        <div className="rounded-lg border border-border bg-background/40 p-2">
          <h3 className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            文字層 ({layers.length})
          </h3>
          <ul className="flex flex-col gap-0.5">
            {layers.map((layer, i) => (
              <li key={layer.id}>
                <button
                  type="button"
                  onClick={() => onSelect(layer.id)}
                  aria-pressed={layer.id === selectedId}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-colors ${
                    layer.id === selectedId
                      ? "bg-primary/15 text-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-60">
                    #{i + 1}
                  </span>
                  <span className="truncate flex-1">
                    {layer.text || "（空白）"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected ? (
        <TextStylePanel
          layer={selected}
          onUpdate={(patch) => onUpdateLayer(selected.id, patch)}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
          {layers.length === 0
            ? "點擊「新增文字」開始製作"
            : "選擇文字層以調整樣式"}
        </p>
      )}
    </div>
  );
}
