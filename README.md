# Amader Product

Modern ecommerce storefront built with Next.js App Router and React. Optimized for fast loading, SEO metadata, and GTM-managed analytics tracking.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the site.

## Configuration

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
REVIEW_HASH_SALT=LONG_RANDOM_SECRET
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

- `NEXT_PUBLIC_SITE_URL` is used for absolute URLs in metadata or sitemaps if you add them later.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for auth and public reads.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and powers admin APIs.
- `REVIEW_HASH_SALT` is used for secure guest-review dedup hashing.
- `NEXT_PUBLIC_GTM_ID` is optional fallback if `tracking_settings` table has no GTM value.

No Supabase credentials are hardcoded in source code.

## Admin Panel

- Admin URL: `/admin`
- Login uses Supabase Auth.
- GTM settings URL: `/admin/tracking`
- Make your user admin:

```
update public.profiles
set is_admin = true
where id = 'YOUR_USER_UUID';
```

- Admin schema extensions: run `supabase/admin_schema.sql` in Supabase SQL Editor.

## Tracking (GA4 + Facebook Pixel via GTM)

- GTM container ID is configured in admin panel and stored in `tracking_settings`.
- All frontend tracking is pushed through `window.dataLayer`.
- GA4 and Facebook Pixel should both be configured inside GTM.
- Event map and setup guide: `docs/tracking-gtm.md`

## Storage

Create a public bucket named `files` for product image uploads.

## Build

```bash
npm run build
npm run start
```
