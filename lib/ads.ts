// Ad configuration. Every value comes from NEXT_PUBLIC_* env vars so that
// preview and local builds, where they are unset, render no ads at all.
// NEXT_PUBLIC_ vars are inlined at build time, so each one must be read with a
// static property access (no dynamic process.env[key]).

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const adsEnabled = Boolean(ADSENSE_CLIENT);

export const AD_SLOTS = {
  /** Responsive display unit in the template page right column. */
  templateSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_SIDEBAR,
  /** In-article unit under the template description. */
  templateDescription: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_DESCRIPTION,
  /** In-feed unit inserted into template grids. */
  listInFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST_INFEED,
} as const;

/** `data-ad-layout-key` copied from the in-feed ad unit in AdSense. */
export const ADSENSE_INFEED_LAYOUT_KEY =
  process.env.NEXT_PUBLIC_ADSENSE_INFEED_LAYOUT_KEY;

/** How many template cards between in-feed ads. */
export const LIST_INFEED_EVERY = 8;
