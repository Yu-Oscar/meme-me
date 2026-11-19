# Ads implementation plan

Goal: monetise MemeMe with Google AdSense first, with ad slots built so a
different network (Ezoic, Mediavine, Raptive) can be swapped in later without
touching page code.

Progress legend: `[ ]` not started, `[~]` in progress, `[x]` done.

## Phase 1: code scaffolding (no AdSense account needed)

- [x] `lib/ads.ts`: reads `NEXT_PUBLIC_ADSENSE_CLIENT` and one
      `NEXT_PUBLIC_ADSENSE_SLOT_*` per placement. Exposes `adsEnabled`.
- [x] `components/ads/AdSlot.tsx`: client component that renders an
      `<ins class="adsbygoogle">`, pushes to `window.adsbygoogle` once per
      mount, remounts on route change, reserves height to avoid CLS, and
      renders nothing when the client id or slot id is missing.
- [x] `app/layout.tsx`: load `adsbygoogle.js` with `next/script`
      (`afterInteractive`), only when `adsEnabled`.
- [x] `public/ads.txt`: placeholder to be filled with the line AdSense gives.
- [x] Template page (`app/template/[id]/page.tsx`): rectangle in the right
      column between the editor sidebar and 相關推薦; fluid unit under
      `TemplateDescription`. Both branches (editable and static media).
- [x] `TemplateList.tsx`: in-feed unit after every 8 cards, styled as a card.
      `/bookmarks` passes `showAds={false}`; `/popular`, `/newest`, `/search`
      and `/profile/[id]` keep the default.
- [x] `/privacy` and `/terms` pages (Traditional Chinese, written register,
      not Cantonese colloquial), linked from `Footer` below the social icons,
      added to `sitemap.ts`. AdSense will not approve a site without them.
- [x] `tsc --noEmit` and `eslint` pass (one pre-existing warning about
      `bookmarkedSet` in the template page, unrelated).
- [x] Smoke-tested on a local dev server, 2026-11-19:
  - env unset: `/privacy`, `/terms`, `/popular`, `/template/[id]` return 200
    with no `adsbygoogle` markup at all.
  - env set with dummy ids: loader script, sidebar and description slots
    appear on the template page with `data-adtest="on"`; `/popular` shows 2
    in-feed units with the layout key; `/privacy` shows none.

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
  - In-feed: template grid (copy the generated `data-ad-layout-key`)
- [ ] Add env vars on Vercel (production only; leave preview/dev unset so no
      ads render there):
  - `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_SIDEBAR=XXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_SLOT_TEMPLATE_DESCRIPTION=XXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_SLOT_LIST_INFEED=XXXXXXXXXX`
  - `NEXT_PUBLIC_ADSENSE_INFEED_LAYOUT_KEY=-xx+xx+xx-xx` (from the in-feed unit)
- [ ] Replace the placeholder line in `public/ads.txt` with
      `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
- [ ] Redeploy.

## Phase 3: after launch

- [ ] Watch CLS in Vercel Analytics for a week. If the sidebar unit causes
      shifts, raise its `minHeight`.
- [ ] Check AdSense Policy Center for flagged pages. Ads are deliberately not
      placed on `/sign-in`, `/sign-up`, `/create`, `/bookmarks`.
- [ ] Once traffic clears roughly 50k sessions/month, evaluate Ezoic or
      Mediavine. Swapping networks means editing `AdSlot.tsx` and the loader
      in `layout.tsx` only.

## Notes

- Ads never show on `localhost`. Outside production the `<ins>` gets
  `data-adtest="on"` so AdSense does not count test impressions.
- Never click your own ads in production; AdSense bans accounts for invalid
  traffic.
- No CSP header exists today. If one is added later, allow
  `*.googlesyndication.com`, `*.doubleclick.net`, `*.googleadservices.com`,
  `*.google.com`, `*.gstatic.com`.
