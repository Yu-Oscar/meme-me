"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TextLayer from "./TextLayer";
import { useStageSize } from "./hooks/useStageSize";
import { useMemeEditor } from "./state/MemeEditorContext";

type Props = {
  imageAlt: string;
  className?: string;
};

export default function EditorStage({ imageAlt, className }: Props) {
  const {
    layers,
    selectedId,
    padding,
    mediaKind,
    mediaUrl,
    playback,
    exportProgress,
    setStageMedia,
    setDuration,
    setCurrentTime,
    setIsPlaying,
    onSelect,
    onUpdateLayer,
    onDeleteLayer,
  } = useMemeEditor();

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageSize = useStageSize(stageRef);
  const [mediaDims, setMediaDims] = useState<{ w: number; h: number } | null>(
    null,
  );

  useEffect(() => {
    const el = mediaKind === "video" ? videoRef.current : imgRef.current;
    setStageMedia(el);
    return () => setStageMedia(null);
  }, [mediaKind, setStageMedia]);

  useEffect(() => {
    if (mediaKind !== "image") return;
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setMediaDims({ w: el.naturalWidth, h: el.naturalHeight });
    }
  }, [mediaKind, mediaUrl]);

  useEffect(() => {
    if (mediaKind !== "video") return;
    if (!playback.isPlaying) return;
    let raf = 0;
    const loop = () => {
      const v = videoRef.current;
      if (v && !v.paused && !v.ended) {
        setCurrentTime(v.currentTime);
        raf = requestAnimationFrame(loop);
      } else {
        setIsPlaying(false);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mediaKind, playback.isPlaying, setCurrentTime, setIsPlaying]);

  const getStageRect = useCallback(
    () => stageRef.current?.getBoundingClientRect() ?? null,
    [],
  );

  const mw = mediaDims && mediaDims.w > 0 ? mediaDims.w : 0;
  const mh = mediaDims && mediaDims.h > 0 ? mediaDims.h : 0;
  const canvasH = mw && mh ? mh + padding.top * mh + padding.bottom * mh : 0;
  const layoutLocked = mw > 0 && mh > 0 && canvasH > 0;
  /** Match `computeCanvasSize` / `composeFrame`: same fractions as export, not %-of-width padding. */
  const mediaInsetStyle = layoutLocked
    ? {
        position: "absolute" as const,
        left: 0,
        width: "100%",
        top: `${((padding.top * mh) / canvasH) * 100}%`,
        height: `${(mh / canvasH) * 100}%`,
        objectFit: "fill" as const,
      }
    : undefined;

  return (
    <div
      ref={stageRef}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onSelect(null);
      }}
      className={`relative w-full select-none overflow-hidden rounded-lg ${className ?? ""}`}
      style={{
        touchAction: "pan-y",
        background: padding.color,
        ...(layoutLocked
          ? { aspectRatio: `${mw} / ${canvasH}` }
          : undefined),
      }}
    >
      {mediaKind === "video" ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          crossOrigin="anonymous"
          playsInline
          muted
          loop
          preload="auto"
          draggable={false}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setMediaDims({ w: v.videoWidth, h: v.videoHeight });
            setDuration(v.duration);
            setCurrentTime(v.currentTime);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            if (!playback.isPlaying) {
              setCurrentTime(e.currentTarget.currentTime);
            }
          }}
          onSeeked={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onSelect(null);
          }}
          className={
            layoutLocked ? "absolute select-none" : "block h-auto w-full select-none"
          }
          style={mediaInsetStyle}
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={mediaUrl}
          alt={imageAlt}
          crossOrigin="anonymous"
          draggable={false}
          onLoad={(e) =>
            setMediaDims({
              w: e.currentTarget.naturalWidth,
              h: e.currentTarget.naturalHeight,
            })
          }
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onSelect(null);
          }}
          className={
            layoutLocked ? "absolute select-none" : "block h-auto w-full select-none"
          }
          style={mediaInsetStyle}
        />
      )}

      {layers.map((layer) => (
        <TextLayer
          key={layer.id}
          layer={layer}
          isSelected={selectedId === layer.id}
          stageSize={stageSize}
          getStageRect={getStageRect}
          onSelect={() => onSelect(layer.id)}
          onUpdate={(patch) => onUpdateLayer(layer.id, patch)}
          onDelete={() => onDeleteLayer(layer.id)}
        />
      ))}

      {exportProgress && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]"
        >
          <div className="flex w-[80%] max-w-xs flex-col gap-2 rounded-lg border border-border bg-background/90 p-3 shadow-lg">
            <div className="flex items-center justify-between text-xs text-foreground">
              <span className="font-medium">{exportProgress.label}</span>
              <span className="font-mono text-muted-foreground">
                {Math.round(exportProgress.ratio * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.max(2, Math.min(100, exportProgress.ratio * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
