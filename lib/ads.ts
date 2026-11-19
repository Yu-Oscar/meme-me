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
  /** Homepage slot beside 熱門標籤 (right column of the two-col grid). */
  homeTagsSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TAGS_SIDEBAR,
} as const;
