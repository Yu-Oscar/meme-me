# Ads implementation plan

Goal: monetise MemeMe with Google AdSense first, with ad slots built so a
different network (Ezoic, Mediavine, Raptive) can be swapped in later without
touching page code.

Progress legend: `[ ]` not started, `[~]` in progress, `[x]` done.

## Phase 1: code scaffolding (no AdSense account needed)

- [x] `lib/ads.ts`: reads `NEXT_PUBLIC_ADSENSE_CLIENT` and one
      `NEXT_PUBLIC_ADSENSE_SLOT_*` per placement. Exposes `adsEnabled`.
- [x] `components/ads/AdSlot.tsx`: client component that reserves height,
      waits until the slot is near the viewport (`IntersectionObserver`,
      200px rootMargin), then either shows a dashed preview (dev) or pushes
      to `window.adsbygoogle` (production). Remounts on route change.
      Renders nothing when the client id or slot id is missing.
- [x] `app/layout.tsx`: load `adsbygoogle.js` with `next/script`
      (`afterInteractive`), only when `adsEnabled`.
- [x] `public/ads.txt`: placeholder to be filled with the line AdSense gives.
- [x] Template page (`app/template/[id]/page.tsx`): rectangle in the right
      column between the editor sidebar and 相關推薦; fluid unit under
      `TemplateDescription`. Both branches (editable and static media).
      No in-feed units in template grids.
- [x] Homepage (`app/page.tsx`): fill the empty right column of the
      `lg:grid-cols-2` row beside 熱門標籤.
- [x] `/privacy` and `/terms` pages (Traditional Chinese, written register,
      not Cantonese colloquial), linked from `Footer` below the social icons,
      added to `sitemap.ts`. AdSense will not approve a site without them.
- [x] `tsc --noEmit` and `eslint` pass (one pre-existing warning about
      `bookmarkedSet` in the template page, unrelated).
- [x] Smoke-tested on a local dev server, 2026-11-19.

Phase 1 is complete and lives on the `feat/adsense` branch. It stays off
`main` until AdSense approves the site. Nothing in phase 1 needs to change once
real ids arrive; only env vars and `ads.txt` do.

Branch workflow:
1. Merge `feat/adsense` into `main` and deploy so `/privacy` and `/terms` are
   live (AdSense needs to see them during review). Ads stay invisible because
   the env vars are not set yet.
2. Apply for AdSense.
3. On approval, set the env vars on Vercel and fill `public/ads.txt` on `main`.

## Phase 2: AdSense account (manual, Oscar)

- [ ] Deploy phase 1 so the policy pages are live.
- [ ] Apply at adsense.google.com, add `mememe.hk`, verify ownership.
- [ ] Turn on Privacy & messaging (Google CMP) for EU/UK consent.
- [ ] Create ad units in the dashboard:
  - Display, responsive: template sidebar
  - In-article: below template description
  - Display, responsive: homepage beside 熱門標籤
- [x] Publisher id wired: `ca-pub-2411064449969140` (default in `lib/ads.ts`).
      Loader script ships on deploy. Slot markup still waits for slot env vars.
- [x] `public/ads.txt` filled with
      `google.com, pub-2411064449969140, DIRECT, f08c47fec0942fa0`.
- [ ] Add slot env vars on Vercel after creating ad units (production only):
  - `NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_SIDEBAR=XXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_DESCRIPTION=XXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_SLOT_HOME_TAGS_SIDEBAR=XXXXXXXXXX`
- [ ] Redeploy after setting slot ids.

## Phase 3: after launch

- [ ] Watch CLS in Vercel Analytics for a week. If the sidebar unit causes
      shifts, raise its `minHeight`.
- [ ] Check AdSense Policy Center for flagged pages. Ads are deliberately not
      placed on `/sign-in`, `/sign-up`, `/create`, `/bookmarks`, or list grids.
- [ ] Once traffic clears roughly 50k sessions/month, evaluate Ezoic or
      Mediavine. Swapping networks means editing `AdSlot.tsx` and the loader
      in `layout.tsx` only.

## Notes

- Ads are not required on first paint. Slots sit below the editor / description
  and only request a creative once they approach the viewport.
- Ads never show real creatives on `localhost`. Dev shows a dashed preview
  once the slot is scrolled into view.
- Never click your own ads in production; AdSense bans accounts for invalid
  traffic.
- No CSP header exists today. If one is added later, allow
  `*.googlesyndication.com`, `*.doubleclick.net`, `*.googleadservices.com`,
  `*.google.com`, `*.gstatic.com`.
