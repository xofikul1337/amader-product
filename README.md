# Amader Product

Modern ecommerce landing site built with Next.js App Router and React. Optimized for fast loading, SEO metadata, and Facebook Pixel tracking.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the site.

## Configuration

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=YOUR_PIXEL_ID
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` enables Facebook Pixel tracking globally.
- `NEXT_PUBLIC_SITE_URL` is used for absolute URLs in metadata or sitemaps if you add them later.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for auth and public reads.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and powers admin APIs.

## Product Data

Update products in `src/data/products.ts`.

## Admin Panel

- Admin URL: `/admin`
- Login uses Supabase Auth.
- Make your user admin:

```
update public.profiles
set is_admin = true
where id = 'YOUR_USER_UUID';
```

- Admin schema extensions: run `supabase/admin_schema.sql` in Supabase SQL Editor.

## Storage

Create a public bucket named `files` for product image uploads.

## Build

```bash
npm run build
npm run start
```
