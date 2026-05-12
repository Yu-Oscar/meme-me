# SEO techniques used in this project

This document summarizes search-related techniques implemented in the MemeMe.hk Next.js app: where they live in the codebase and what they accomplish.

## 1. HTML language

- **`lang="zh-HK"`** on the root `<html>` element (`app/layout.tsx`) so crawlers and assistive tech treat the site as Traditional Chinese (Hong Kong).

## 2. Next.js Metadata API

- **Root defaults** (`app/layout.tsx`): global `title`, `description`, `icons`, **Open Graph**, and **Twitter** metadata apply to pages that do not override them.
- **Static page metadata**: `export const metadata` on listing pages such as `app/popular/page.tsx`, `app/newest/page.tsx`, and `app/tags/page.tsx`.
- **Dynamic `generateMetadata`**: server-side metadata built from data for:
  - **Template detail** — `app/template/[slug]/page.tsx` (title, description from name/tags, OG image from thumbnail or main image).
  - **User profile** — `app/user/[id]/page.tsx` (title/description from profile; OG `type: "profile"`).
  - **Search** — `app/search/page.tsx` (title/description reflect query and sort; canonical built from `q` and `s` params).

Pages without their own metadata (for example legal content under `app/tos/`) inherit the root layout metadata.

## 3. Open Graph (social previews)

- Each major route sets **`openGraph.title`**, **`description`**, **`url`**, **`siteName`** (`MemeMe.hk`), and **`type`** (`website`, `article` for templates, `profile` for users).
- **Images**: default OG image on the home layout; template pages use the template image with **`alt`** where applicable; listing pages use text-focused cards without custom OG images in metadata.

## 4. Twitter Cards

- **`summary_large_image`** for the home layout and template pages (matches large preview images).
- **`summary`** for search, tags, newest, popular, and user pages where a smaller card style is used.

## 5. Canonical URLs

- **`alternates.canonical`** is set on template pages, user pages, tags, newest, popular, and search (search canonical includes only meaningful query/sort params) to reduce duplicate-URL issues.

## 6. Crawl directives (`robots`)

- **Global** — `app/robots.ts` exposes `/robots.txt`: allow all agents on `/`, disallow `/api/`, `/edit/`, and `/bookmarks/`, and reference the sitemap URL.
- **Search** — `app/search/page.tsx` sets **`robots.index`** to `false` when there is no search query (empty search UI should not be indexed as many thin URLs) and **`follow: true`**; when a query exists, indexing is allowed.

## 7. XML sitemap

- **`app/sitemap.ts`** generates **`sitemap.xml`** with:
  - Static URLs: home, popular, newest, tags, search (with **`lastModified`**, **`changeFrequency`**, **`priority`**).
  - **Dynamic URLs** for every **public** template (`/template/[slug]`), with **`lastModified`** from `updated_at` or `created_at`.

## 8. Structured data (JSON-LD)

Implemented in `components/JsonLd.tsx` and wired from pages/layout:

| Type | Purpose |
|------|--------|
| **Organization** | Brand entity: name, URL, logo (`ImageObject`) in root layout. |
| **WebSite** | Site name, URL, description, comma-joined **keywords**, and **`SearchAction`** / **`EntryPoint`** pointing at `/search?q={search_term_string}` (sitelinks search box pattern). |
| **CreativeWork** | Per-template page: name, URL, image, optional `dateCreated`, creator (`Person`), keywords from tags. |
| **BreadcrumbList** | Template page: Home → template name with positions and URLs. |

### `WebSiteJsonLd` (`components/JsonLd.tsx`)

React helper that renders one **`WebSite`** JSON-LD script. It is only used in **`app/layout.tsx`** (global, every page).

**Props:**

| Prop | Role |
|------|------|
| `name` | Site title shown in the structured data. |
| `url` | Canonical site origin (e.g. `https://www.mememe.hk`); also used to build the search URL template. |
| `description` | Optional; mirrors the marketing/SEO description. |
| `keywords` | Optional string array; emitted as a single comma-separated **`keywords`** field (English + Chinese + Hong Kong–focused terms in this project). |

**`potentialAction`:** Always outputs a **`SearchAction`** whose `target` is an **`EntryPoint`** with  
`urlTemplate: {url}/search?q={search_term_string}` and `query-input: required name=search_term_string`.  
That matches [Google’s sitelinks search box](https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox) shape so Google *may* associate the site with an internal search URL; it is not a guarantee of a search box in results.

Scripts use `type="application/ld+json"` and `dangerouslySetInnerHTML` with JSON from `schema.org` `@context`.

## 9. Favicon

- Declared in root **`metadata.icons`** and duplicated with **`<link rel="icon" href="/favicon.ico" sizes="any" />`** in the layout `<head>`.

## 10. Analytics (not ranking signals, supports measurement)

- **Google Analytics (gtag)** loaded with `next/script` in `app/layout.tsx` for traffic and discovery measurement.
- **Vercel Analytics** component in the layout for product analytics; it does not replace technical SEO but helps observe organic traffic if configured in Vercel.

## 11. Rendering note

- Root layout is intentionally **non-async** so the shell can be statically generated; page-level metadata and JSON-LD still run on the server for crawlers that execute JavaScript.

## File map (quick reference)

| Concern | Primary files |
|--------|----------------|
| Global metadata & sitewide JSON-LD | `app/layout.tsx` |
| Robots.txt | `app/robots.ts` |
| Sitemap | `app/sitemap.ts` |
| JSON-LD components | `components/JsonLd.tsx` |
| Per-route metadata | `app/template/[slug]/page.tsx`, `app/user/[id]/page.tsx`, `app/search/page.tsx`, `app/tags/page.tsx`, `app/newest/page.tsx`, `app/popular/page.tsx` |
