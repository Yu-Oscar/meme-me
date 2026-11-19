"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

type AdSlotProps = {
  /** AdSense ad unit id. When undefined the slot renders nothing. */
  slot: string | undefined;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  /** Reserved height so the page does not shift when the ad loads. */
  minHeight?: number;
  /** Shown in the local preview placeholder. */
  label?: string;
  className?: string;
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";
/** Start loading slightly before the slot enters the viewport. */
const LAZY_ROOT_MARGIN = "200px 0px";

export default function AdSlot({
  slot,
  format = "auto",
  minHeight = 280,
  label = "廣告",
  className,
}: AdSlotProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [inView, setInView] = useState(false);
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  // Only activate the slot once it approaches the viewport. Ads do not need
  // to compete with the first paint; they fill in as the user scrolls down.
  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: LAZY_ROOT_MARGIN, threshold: 0 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [enabled, pathname]);

  useEffect(() => {
    if (!IS_PRODUCTION || !inView) return;
    const ins = insRef.current;
    if (!enabled || !ins) return;
    // AdSense marks a filled <ins> with data-adsbygoogle-status. Pushing again
    // for the same element throws "All 'ins' elements already have ads".
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // The loader script is blocked or not loaded yet; nothing to do.
    }
  }, [enabled, inView, pathname]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      style={{ minHeight }}
      aria-label={IS_PRODUCTION ? "廣告" : `${label}預覽`}
    >
      {!inView ? null : !IS_PRODUCTION ? (
        <div
          className="flex h-full min-h-[inherit] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-amber-500/70 bg-amber-500/10 px-3 py-4 text-center"
          style={{ minHeight }}
        >
          <span className="text-sm font-semibold tracking-wide text-amber-400">
            {label}
          </span>
          <span className="text-[11px] text-amber-400/70">
            廣告預覽 · 捲動至可視範圍後顯示 · slot {slot}
          </span>
        </div>
      ) : (
        <ins
          key={pathname}
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
