# Hosting optimisation: remaining work

MemeMe runs on the free plans of Vercel (app), Supabase (Postgres and media storage) and Cloudflare (proxy in front of Vercel). This document lists the optimisation work that has not been done yet, in the order it is worth doing.

All numbers below were measured on 2026-11-19.

## Already done

Shipped on 2026-11-19 to fix the exhausted Vercel Image Optimization quota (5K of 5K transformations):

- `next.config.ts`: optimized images are cached for 31 days instead of 4 hours, a single 640 px width is generated (see the next section), and the optimizer only accepts files from the `templates` bucket.
- `features/templates/components/HeroCarousel.tsx`: the hero image has a `sizes` value, so it no longer requests 1080 and 2048 px variants.
- `components/Navbar.tsx`: the logo is `unoptimized`.
- `vercel.json`: functions run in `hnd1` (Tokyo), next to the Supabase database in `ap-northeast-1`. They previously ran in `iad1` (US East).

One consequence to remember: a file overwritten at the same URL can show its old version for up to 31 days. Upload replacements under a new path.

### Optional, after the Vercel quota resets

While the quota is exhausted, every image variant that is not already cached returns 402 and the visitor sees the alt text. Measured on 2026-11-19 across all 119 image templates, the number that still loaded at each width was:

- 256 px: 15
- 384 px: 8
- 640 px: 61
- 828 px: 0
- 1200 px: 1

So `next.config.ts` serves only the 640 px width for now. The 58 images with no cached 640 px variant stay broken until the quota resets, then fix themselves with no change needed.

Nothing has to be changed back. One width is a valid permanent setting and uses the fewest transformations (at most 119 a month). The cost is that hero images are slightly soft on large high-resolution screens, and the small "related" thumbnails are heavier than they need to be.

To improve both, once the Image Optimization usage on the Vercel dashboard has reset, set this in `next.config.ts`:

```ts
deviceSizes: [640, 828, 1200],
imageSizes: [256, 384],
```

That allows at most 595 transformations a month, still well inside the 5K allowance.

## 1. Cut Supabase egress (do this next)

Supabase cached egress was at 3.8 GB of 5 GB (76%).

### Why it is high

- The source images are heavy. The bucket holds 101 PNGs totalling 95 MB (average 966 KB, 29 over 1 MB, largest 7.1 MB), 50 JPEGs totalling 6 MB, 10 WebPs totalling 0.3 MB, and 40 MP4s totalling 20 MB.
- The editor loads the original at full size straight from Supabase with a plain `<img>` (`features/templates/components/MemeEditor/EditorStage.tsx`), so every real template view downloads it.
- Vercel fetches the original from Supabase each time it creates an optimized variant.
- Every object is served with `Cache-Control: max-age=3600`, so browsers download the same file again after an hour. `scripts/migrate-templates-only.mjs` uploads without a `cacheControl` option, which leaves Supabase on its one-hour default.

### What to do

Write a one-off script (the `scripts/` folder is git-ignored, so it stays local). `scripts/migrate-templates-only.mjs` already has the storage client setup, download, upload and retry helpers to copy from. It needs `sharp` as a dev dependency.

For each row in `public.templates` where `media_type = 'image'`:

1. Download the object behind `media_url` from the `templates` bucket.
2. Resize to a maximum width of about 1600 px without enlarging, and encode as WebP at quality 80.
3. Upload to a new path, for example `templates/{slug}/{slug}-image.webp`, with `contentType: "image/webp"` and `cacheControl: "31536000"`.
4. Update `media_url` on the row to the new public URL.
5. Delete the old object once the new one is confirmed to load.

For the MP4s, upload each file again to a new path with `cacheControl: "31536000"` and update `media_url`. A new path matters because the old URL stays cached with the one-hour header.

Give the script a dry-run mode and a limit, and run it on three or four templates before the full set.

### Check before running on everything

- The editor still loads the image and exports a correct PNG from a WebP source.
- Link previews still work. Template pages use `media_url` as the Open Graph image (`app/template/[id]/page.tsx`), and a few older platforms do not render WebP previews. If that matters, encode as JPEG for images without transparency instead.
- New files return `cache-control: public, max-age=31536000` when requested directly.

### Expected result

Storage should fall from about 122 MB to roughly a tenth of that for images, and egress per view should fall by a similar factor. Browsers and Vercel will stop downloading unchanged files again.

## 2. Optional improvements

None of these is needed to stay inside the free plans at current traffic (about 8.8K template views in 30 days). They are listed from the best value for effort to the least.

### 2.1 Stop autoplaying videos in grids

The 32 video templates render as `<video autoPlay muted loop>` in every list and carousel (`features/templates/components/TemplateMediaThumb.tsx`). Each card downloads its full MP4, on average 514 KB and up to 2.1 MB, whether or not the visitor looks at it.

Change:

- Remove `autoPlay` and add `preload="metadata"`.
- Append `#t=0.001` to the `src` so Safari on iOS paints the first frame as a still.
- Move the `<video>` into a small client component that calls `play()` on pointer enter and `pause()` on pointer leave. On touch devices, play it when it scrolls into view using an `IntersectionObserver`.

### 2.2 Count views from the browser

`app/template/[id]/page.tsx` calls `await recordTemplateVisit(template.id)` while rendering the page. Bots and crawlers are counted, and the page cannot be cached while it writes on every render.

Evidence that counts are inflated: 8,848 template views were recorded in 30 days, while Vercel Web Analytics showed 3.1K events across all pages in the billing period. The two periods do not line up exactly and ad blockers hide some visits, so treat this as an indication.

Change:

- Remove the `recordTemplateVisit` call from the page.
- Add a client component on the template page that calls a server action from a `useEffect`, once per mount.
- Optionally skip the write when the same browser viewed the same template in the last few minutes (a `sessionStorage` flag is enough).

### 2.3 Cache the public pages

Every route is rendered on each request. `components/Navbar.tsx` calls `getAuth()` in the root layout, which reads cookies, so `/`, `/popular`, `/newest`, `/tags` and the template pages all return `Cache-Control: private, no-store`. Link prefetches invoke a function as well, and the home page has 32 template links.

Measured: 119K function invocations and 1h 18m of the 4h Active CPU allowance in the billing period.

Change, in this order:

1. Do 2.2 first, so template pages no longer write during render.
2. Move the signed-in parts of the navbar (`AccountDropdown`, the guest buttons) into a component that loads the user on the client, or wrap them in `<Suspense>`.
3. Stop calling `getAuth()` and `getBookmarkedTemplateIds()` in the page components. Load the bookmarked IDs once on the client and let `Bookmark` read its state from there.
4. Turn on caching for the public data queries (`getHomePopularTemplates`, `getHomeNewestTemplates`, `getTags`, `getTemplates`, `getTemplate`) with a lifetime of a few minutes.
5. Remove the `revalidatePath` calls in `features/bookmarks/actions/toggle-bookmark.ts`, since bookmark state will no longer be part of the cached pages.

Read the caching guide in `node_modules/next/dist/docs/` before starting. This project is on Next.js 16, where the caching APIs differ from earlier versions.

This is the largest change in the list. It becomes worth doing when Function Invocations or Active CPU approach their limits, or when page speed matters more.

### 2.4 Move media to Cloudflare R2

Only worth doing if Supabase egress is still high after section 1. R2 has no egress charge and its free tier covers this bucket many times over. The work is a bucket with a custom domain such as `media.mememe.hk`, a copy of the objects, an update of every `media_url`, and a change to `remotePatterns` in `next.config.ts`.

A further step is to generate one thumbnail per template at upload time and render it with `unoptimized`. That removes Vercel image transformations entirely.

### 2.5 Small clean-ups

- `tiny-slider` is in `package.json` and is not imported anywhere.
- `app/layout.tsx` loads the Geist Sans font, and `app/globals.css` never references `--font-geist-sans`.
- `pnpm lint` reports 2 errors and 11 warnings that predate this work, in `MemeEditor/DownloadAction.tsx`, `MemeEditor/utils/export-span.ts` and nine other files.

## What does not need work

- The database is at 36 MB of 500 MB. The main queries average under 6 ms, and the three-hourly `refresh-template-view-stats` cron job takes about 120 ms.
- `template_view` grows by about 1.4 MB a month. If it is ever pruned, note that the cron job recomputes `view_count` from that table, so deleting old rows would lower the all-time counts unless the job is changed first.
