"use client";

import { useEffect, useRef } from "react";
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
  /** Only for in-feed units; copied from the AdSense dashboard. */
  layoutKey?: string;
  /** Reserved height so the page does not shift when the ad loads. */
  minHeight?: number;
  className?: string;
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function AdSlot({
  slot,
  format = "auto",
  layoutKey,
  minHeight = 280,
  className,
}: AdSlotProps) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
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
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ minHeight }}
      aria-label="廣告"
    >
      <ins
        // Keying on pathname forces a fresh <ins> after client navigation so
        // the effect above can request a new ad for the new page.
        key={pathname}
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout-key={layoutKey}
        data-adtest={IS_PRODUCTION ? undefined : "on"}
      />
    </div>
  );
}
