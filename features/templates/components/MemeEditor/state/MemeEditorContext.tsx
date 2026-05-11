"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type {
  CanvasPadding,
  TemplateSettings,
  TextLayer,
} from "@/features/templates/types/template-settings";
import {
  createDefaultLayer,
  editorReducer,
  initEditorState,
} from "./editor-reducer";
import { copyPngToClipboard, exportToPng } from "../utils/export-png";

export type MediaKind = "image" | "video";
export type ExportFormat = "png" | "webm" | "mp4" | "gif";

type Playback = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
};

type StageMediaElement = HTMLImageElement | HTMLVideoElement;

export type ExportProgress = {
  format: ExportFormat;
  ratio: number;
  label: string;
};

type MemeEditorContextValue = {
  layers: TextLayer[];
  selectedId: string | null;
  padding: CanvasPadding;
  isExporting: boolean;
  exportProgress: ExportProgress | null;
  mediaKind: MediaKind;
  mediaUrl: string;
  templateName: string;
  playback: Playback;
  stageMediaRef: React.MutableRefObject<StageMediaElement | null>;
  setStageMedia: (el: StageMediaElement | null) => void;
  setDuration: (d: number) => void;
  setCurrentTime: (t: number) => void;
  setIsPlaying: (p: boolean) => void;
  onSelect: (id: string | null) => void;
  onUpdateLayer: (id: string, patch: Partial<TextLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onUpdatePadding: (patch: Partial<CanvasPadding>) => void;
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReset: () => void;
  onSeek: (t: number) => void;
  onTogglePlay: () => void;
  onExport: (format: ExportFormat) => Promise<void>;
  onCopyImage: () => Promise<void>;
};

const MemeEditorContext = createContext<MemeEditorContextValue | null>(null);

export function useMemeEditor(): MemeEditorContextValue {
  const ctx = useContext(MemeEditorContext);
  if (!ctx) {
    throw new Error("useMemeEditor must be used inside <MemeEditorProvider>");
  }
  return ctx;
}

export function useMemeEditorOptional(): MemeEditorContextValue | null {
  return useContext(MemeEditorContext);
}

type Props = {
  mediaKind: MediaKind;
  mediaUrl: string;
  templateName: string;
  initialSettings: TemplateSettings;
  children: ReactNode;
};

function sanitizeFileBase(name: string): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "meme";
}

export function MemeEditorProvider({
  mediaKind,
  mediaUrl,
  templateName,
  initialSettings,
  children,
}: Props) {
  const [state, dispatch] = useReducer(
    editorReducer,
    initialSettings,
    initEditorState,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null,
  );
  const stageMediaRef = useRef<StageMediaElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const setStageMedia = useCallback((el: StageMediaElement | null) => {
    stageMediaRef.current = el;
  }, []);

  const onSelect = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_LAYER", id });
  }, []);
  const onUpdateLayer = useCallback((id: string, patch: Partial<TextLayer>) => {
    dispatch({ type: "UPDATE_LAYER", id, patch });
  }, []);
  const onDeleteLayer = useCallback((id: string) => {
    dispatch({ type: "DELETE_LAYER", id });
  }, []);
  const onUpdatePadding = useCallback((patch: Partial<CanvasPadding>) => {
    dispatch({ type: "UPDATE_PADDING", patch });
  }, []);

  const onAdd = useCallback(() => {
    dispatch({ type: "ADD_LAYER", layer: createDefaultLayer() });
  }, []);
  const onDuplicate = useCallback(() => {
    if (!state.selectedId) return;
    dispatch({ type: "DUPLICATE_LAYER", id: state.selectedId });
  }, [state.selectedId]);
  const onDelete = useCallback(() => {
    if (!state.selectedId) return;
    dispatch({ type: "DELETE_LAYER", id: state.selectedId });
  }, [state.selectedId]);
  const onMoveUp = useCallback(() => {
    if (!state.selectedId) return;
    dispatch({
      type: "REORDER_LAYER",
      id: state.selectedId,
      direction: "up",
    });
  }, [state.selectedId]);
  const onMoveDown = useCallback(() => {
    if (!state.selectedId) return;
    dispatch({
      type: "REORDER_LAYER",
      id: state.selectedId,
      direction: "down",
    });
  }, [state.selectedId]);
  const onReset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const onSeek = useCallback((t: number) => {
    const media = stageMediaRef.current;
    if (media instanceof HTMLVideoElement) {
      const clamped = Math.max(0, Math.min(media.duration || t, t));
      media.currentTime = clamped;
      setCurrentTime(clamped);
    } else {
      setCurrentTime(t);
    }
  }, []);

  const onTogglePlay = useCallback(() => {
    const media = stageMediaRef.current;
    if (!(media instanceof HTMLVideoElement)) return;
    if (media.paused) {
      media.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      );
    } else {
      media.pause();
      setIsPlaying(false);
    }
  }, []);

  const onExport = useCallback(
    async (format: ExportFormat) => {
      const media = stageMediaRef.current;
      if (!media) {
        toast.error("媒體尚未載入");
        return;
      }
      setIsExporting(true);
      setExportProgress(null);
      try {
        if (format === "png") {
          if (!(media instanceof HTMLImageElement)) {
            toast.error("此模板無法匯出為 PNG，請選 GIF / 影片");
            return;
          }
          await exportToPng({
            image: media,
            imageUrl: mediaUrl,
            layers: state.layers,
            padding: state.padding,
            filename: `${sanitizeFileBase(templateName)}.png`,
          });
          toast.success("下載完成");
          return;
        }

        if (!(media instanceof HTMLVideoElement)) {
          toast.error("此模板無影片可匯出");
          return;
        }

        const { exportToVideo, exportToGif } =
          await import("../utils/export-video");
        if (format === "gif") {
          setExportProgress({ format: "gif", ratio: 0, label: "匯出 GIF" });
          await exportToGif({
            video: media,
            layers: state.layers,
            padding: state.padding,
            trim: null,
            filename: `${sanitizeFileBase(templateName)}.gif`,
            onProgress: (done, total) => {
              setExportProgress({
                format: "gif",
                ratio: total > 0 ? done / total : 0,
                label: `匯出 GIF ${done}/${total}`,
              });
            },
          });
        } else {
          setExportProgress({
            format,
            ratio: 0,
            label: format === "mp4" ? "匯出 MP4" : "匯出 WebM",
          });
          await exportToVideo({
            video: media,
            layers: state.layers,
            padding: state.padding,
            preferredFormat: format,
            trim: null,
            filenameBase: sanitizeFileBase(templateName),
            onProgress: (ratio) => {
              setExportProgress({
                format,
                ratio,
                label: format === "mp4" ? "匯出 MP4" : "匯出 WebM",
              });
            },
          });
        }
        toast.success("下載完成");
      } catch (err) {
        console.error("[MemeEditor] export failed", err);
        const msg =
          err instanceof DOMException && err.name === "SecurityError"
            ? "下載失敗：媒體未開放 CORS"
            : err instanceof Error
              ? `下載失敗：${err.message}`
              : "下載失敗，請稍後再試";
        toast.error(msg);
      } finally {
        setIsExporting(false);
        setExportProgress(null);
      }
    },
    [mediaUrl, state.layers, state.padding, templateName],
  );

  const onCopyImage = useCallback(async () => {
    const media = stageMediaRef.current;
    if (!(media instanceof HTMLImageElement)) {
      toast.error("此模板無法複製圖片");
      return;
    }
    setIsExporting(true);
    try {
      await copyPngToClipboard({
        image: media,
        imageUrl: mediaUrl,
        layers: state.layers,
        padding: state.padding,
      });
      toast.success("已複製圖片至剪貼簿");
    } catch (err) {
      console.error("[MemeEditor] copy failed", err);
      const msg =
        err instanceof DOMException && err.name === "SecurityError"
          ? "複製失敗：媒體未開放 CORS"
          : err instanceof DOMException && err.name === "NotAllowedError"
            ? "複製失敗：瀏覽器拒絕存取剪貼簿"
            : err instanceof Error
              ? `複製失敗：${err.message}`
              : "複製失敗，請稍後再試";
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  }, [mediaUrl, state.layers, state.padding]);

  const playback = useMemo<Playback>(
    () => ({ currentTime, duration, isPlaying }),
    [currentTime, duration, isPlaying],
  );

  const value = useMemo<MemeEditorContextValue>(
    () => ({
      layers: state.layers,
      selectedId: state.selectedId,
      padding: state.padding,
      isExporting,
      exportProgress,
      mediaKind,
      mediaUrl,
      templateName,
      playback,
      stageMediaRef,
      setStageMedia,
      setDuration,
      setCurrentTime,
      setIsPlaying,
      onSelect,
      onUpdateLayer,
      onDeleteLayer,
      onUpdatePadding,
      onAdd,
      onDuplicate,
      onDelete,
      onMoveUp,
      onMoveDown,
      onReset,
      onSeek,
      onTogglePlay,
      onExport,
      onCopyImage,
    }),
    [
      state.layers,
      state.selectedId,
      state.padding,
      isExporting,
      exportProgress,
      mediaKind,
      mediaUrl,
      templateName,
      playback,
      setStageMedia,
      onSelect,
      onUpdateLayer,
      onDeleteLayer,
      onUpdatePadding,
      onAdd,
      onDuplicate,
      onDelete,
      onMoveUp,
      onMoveDown,
      onReset,
      onSeek,
      onTogglePlay,
      onExport,
      onCopyImage,
    ],
  );

  return (
    <MemeEditorContext.Provider value={value}>
      {children}
    </MemeEditorContext.Provider>
  );
}
