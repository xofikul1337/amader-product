-- =============================================================
-- Admin Extensions (Brands, Coupons, Couriers, Variants, Notes)
-- =============================================================

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage','fixed')),
  value numeric(12,2) not null,
  min_order numeric(12,2),
  max_discount numeric(12,2),
  expiry_date date,
  usage_limit_total int,
  usage_limit_per_user int,
  times_used int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.couriers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  zone text,
  active_orders int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  note text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  size text,
  color text,
  price_override numeric(12,2),
  sale_price_override numeric(12,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.variant_inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.tracking_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now(),
  constraint tracking_settings_gtm_format_chk check (
    key <> 'gtm_id' or value is null or value ~ '^GTM-[A-Za-z0-9]+$'
  )
);

-- Trigger to keep updated_at consistent (uses existing set_updated_at)
drop trigger if exists set_brands_updated_at on public.brands;
create trigger set_brands_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

drop trigger if exists set_coupons_updated_at on public.coupons;
create trigger set_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists set_couriers_updated_at on public.couriers;
create trigger set_couriers_updated_at
before update on public.couriers
for each row execute function public.set_updated_at();

drop trigger if exists set_variants_updated_at on public.product_variants;
create trigger set_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

do $$
begin
  if exists (
    select 1
    from pg_proc
    where pronamespace = 'public'::regnamespace
      and proname = 'set_updated_at'
  ) then
    drop trigger if exists set_tracking_settings_updated_at on public.tracking_settings;
    create trigger set_tracking_settings_updated_at
    before update on public.tracking_settings
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- RLS
alter table public.brands enable row level security;
alter table public.coupons enable row level security;
alter table public.couriers enable row level security;
alter table public.order_notes enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_inventory enable row level security;
alter table public.order_status_history enable row level security;
alter table public.tracking_settings enable row level security;

drop policy if exists "Brands: admin manage" on public.brands;
create policy "Brands: admin manage"
on public.brands for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Coupons: admin manage" on public.coupons;
create policy "Coupons: admin manage"
on public.coupons for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Couriers: admin manage" on public.couriers;
create policy "Couriers: admin manage"
on public.couriers for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Order notes: admin manage" on public.order_notes;
create policy "Order notes: admin manage"
on public.order_notes for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Product variants: admin manage" on public.product_variants;
create policy "Product variants: admin manage"
on public.product_variants for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Variant inventory: admin manage" on public.variant_inventory;
create policy "Variant inventory: admin manage"
on public.variant_inventory for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Order status history: admin manage" on public.order_status_history;
create policy "Order status history: admin manage"
on public.order_status_history for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Tracking settings: admin manage" on public.tracking_settings;
create policy "Tracking settings: admin manage"
on public.tracking_settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Tracking settings: public read gtm" on public.tracking_settings;
create policy "Tracking settings: public read gtm"
on public.tracking_settings for select
using (key = 'gtm_id');

create index if not exists brands_slug_idx on public.brands (slug);
create index if not exists coupons_code_idx on public.coupons (code);
create index if not exists order_notes_order_idx on public.order_notes (order_id);
create index if not exists variants_product_idx on public.product_variants (product_id);

insert into public.tracking_settings (key, value)
values ('gtm_id', null)
on conflict (key) do nothing;
