import type {
  CanvasPadding,
  TemplateSettings,
  TextLayer,
} from "@/features/templates/types/template-settings";

export type EditorState = {
  layers: TextLayer[];
  selectedId: string | null;
  initialLayers: TextLayer[];
  padding: CanvasPadding;
  initialPadding: CanvasPadding;
};

export type EditorAction =
  | { type: "ADD_LAYER"; layer: TextLayer }
  | { type: "UPDATE_LAYER"; id: string; patch: Partial<TextLayer> }
  | { type: "DELETE_LAYER"; id: string }
  | { type: "SELECT_LAYER"; id: string | null }
  | { type: "REORDER_LAYER"; id: string; direction: "up" | "down" }
  | { type: "DUPLICATE_LAYER"; id: string }
  | { type: "UPDATE_PADDING"; patch: Partial<CanvasPadding> }
  | { type: "RESET" };

export function initEditorState(settings: TemplateSettings): EditorState {
  return {
    layers: settings.textLayers.map((l) => ({ ...l })),
    selectedId: null,
    initialLayers: settings.textLayers.map((l) => ({ ...l })),
    padding: { ...settings.padding },
    initialPadding: { ...settings.padding },
  };
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "ADD_LAYER":
      return {
        ...state,
        layers: [...state.layers, action.layer],
        selectedId: action.layer.id,
      };
    case "UPDATE_LAYER":
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.id ? { ...l, ...action.patch } : l,
        ),
      };
    case "DELETE_LAYER":
      return {
        ...state,
        layers: state.layers.filter((l) => l.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    case "SELECT_LAYER":
      return { ...state, selectedId: action.id };
    case "REORDER_LAYER": {
      const i = state.layers.findIndex((l) => l.id === action.id);
      if (i < 0) return state;
      const j = action.direction === "up" ? i + 1 : i - 1;
      if (j < 0 || j >= state.layers.length) return state;
      const next = state.layers.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return { ...state, layers: next };
    }
    case "DUPLICATE_LAYER": {
      const src = state.layers.find((l) => l.id === action.id);
      if (!src) return state;
      const copy: TextLayer = {
        ...src,
        id: makeLayerId(),
        x: clamp01(src.x + 0.03),
        y: clamp01(src.y + 0.03),
      };
      return {
        ...state,
        layers: [...state.layers, copy],
        selectedId: copy.id,
      };
    }
    case "UPDATE_PADDING":
      return {
        ...state,
        padding: { ...state.padding, ...action.patch },
      };
    case "RESET":
      return {
        ...state,
        layers: state.initialLayers.map((l) => ({ ...l })),
        padding: { ...state.initialPadding },
        selectedId: null,
      };
    default:
      return state;
  }
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function makeLayerId(): string {
  if (
    typeof globalThis !== "undefined" &&
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `layer_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultLayer(): TextLayer {
  return {
    id: makeLayerId(),
    text: "文字",
    x: 0.5,
    y: 0.5,
    width: 0.6,
    rotation: 0,
    fontFamily: "'Microsoft JhengHei', '微軟正黑體', sans-serif",
    fontSize: 0.08,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    color: "#ffffff",
    stroke: { color: "#000000", width: 0.004 },
    background: null,
    opacity: 1,
    timing: null,
  };
}
