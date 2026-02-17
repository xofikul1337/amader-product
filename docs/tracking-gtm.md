# GTM Tracking Guide (GA4 + Facebook Pixel)

## Overview

Tracking is managed through Google Tag Manager only.

- GTM ID source: `public.tracking_settings` (`key='gtm_id'`)
- Admin page: `/admin/tracking`
- Frontend source: `window.dataLayer` events from `src/lib/tracking.client.ts`

## Data Layer Events

These events are pushed from the user panel:

- `page_view`
- `search`
- `select_item`
- `view_item`
- `add_to_cart`
- `begin_checkout`
- `add_shipping_info`
- `add_payment_info`
- `purchase`
- `buy_now_click`
- `checkout_error`

Each event includes:

- `event`
- `event_id` (random unique id)
- `event_source` (`web`)

## Ecommerce Payload Format

GA4-style `ecommerce.items` is used:

- `item_id`
- `item_name`
- `item_brand` (`Amader Product`)
- `item_category` (if available)
- `item_variant` (if available)
- `price`
- `quantity`

Purchase-specific payload includes:

- `transaction_id`
- `currency` (`BDT`)
- `value`
- `shipping`
- `ecommerce`

## GTM Setup

1. Create GA4 Configuration tag.
2. Create GA4 Event tags for each data layer event above.
3. Create Meta Pixel tag(s) and map data layer events:
   - `page_view` -> `PageView`
   - `view_item` -> `ViewContent`
   - `add_to_cart` -> `AddToCart`
   - `begin_checkout` -> `InitiateCheckout`
   - `purchase` -> `Purchase`
4. Use `transaction_id` as dedupe key in Meta event configuration where applicable.
5. Publish container.

## QA Checklist

Run all checks in staging and production:

1. GA4 DebugView shows each event once per user action.
2. Meta Pixel Helper shows expected events with required params.
3. `purchase` includes `transaction_id`, `value`, `currency`, and item list.
4. No double events when navigating between pages.
5. Search, add-to-cart, and checkout events fire on mobile and desktop.
6. GTM disabled state works when `gtm_id` is empty.

## SQL Requirement

Run `supabase/admin_schema.sql` to create:

- `public.tracking_settings`
- RLS policies for admin write and public read of GTM key
