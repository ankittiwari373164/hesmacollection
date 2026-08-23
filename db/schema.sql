-- Hesma Collection — Supabase schema
-- Run this in your Supabase project's SQL editor (Database → SQL Editor).

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- Products
-- ────────────────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,
  price        numeric not null,
  mrp          numeric not null default 0,
  images       text[] not null default '{}',
  description  text default '',
  sku          text,
  stock        integer not null default 0,
  featured     boolean not null default false,
  new_arrival  boolean not null default false,
  buy1get2     boolean not null default false,
  rating       numeric default 4.7,
  reviews      integer default 0,
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- Coupons
-- ────────────────────────────────────────────────────────────
create table if not exists coupons (
  code         text primary key,
  type         text not null check (type in ('percent', 'flat')),
  value        numeric not null,
  min_order    numeric not null default 0,
  active       boolean not null default true,
  description  text default '',
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- Orders
-- ────────────────────────────────────────────────────────────
create table if not exists orders (
  id             text primary key,                 -- e.g. HES123456
  user_id        uuid references auth.users(id),
  items          jsonb not null,                    -- [{productId,name,price,qty,image}]
  shipping       jsonb not null,                    -- {name,email,phone,address1,city,state,pincode}
  payment_method text not null,                      -- 'cod' | 'online'
  payment_status text not null default 'Pending',
  subtotal       numeric not null,
  discount       numeric not null default 0,
  shipping_fee   numeric not null default 0,
  cod_fee        numeric not null default 0,
  total          numeric not null,
  coupon         text,
  status         text not null default 'Placed',
  created_at     timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- Store settings (single row)
-- ────────────────────────────────────────────────────────────
create table if not exists settings (
  id                        int primary key default 1,
  store_name                text not null default 'Hesma Collection',
  support_email             text not null default 'care@hesmacollection.com',
  support_phone             text not null default '+91 98765 43210',
  address                   text not null default '14 Ivory Lane, Zaveri Bazaar, Mumbai, MH 400002',
  cod_enabled               boolean not null default true,
  cod_extra_fee             numeric not null default 0,
  online_payment_enabled    boolean not null default true,
  payment_provider          text not null default 'razorpay',
  razorpay_key_id           text default '',
  stripe_publishable_key    text default '',
  free_shipping_threshold   numeric not null default 999,
  shipping_fee              numeric not null default 79,
  constraint singleton check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- Contact / enquiry messages
-- ────────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table products enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;
alter table messages enable row level security;

-- Public (anon) can read products, active coupons, and settings — needed for the storefront.
create policy "public read products" on products for select using (true);
create policy "public read coupons" on coupons for select using (true);
create policy "public read settings" on settings for select using (true);

-- Anyone can place an order or send a message (insert-only for anon).
create policy "public insert orders" on orders for insert with check (true);
create policy "public insert messages" on messages for insert with check (true);

-- This demo does not implement Supabase Auth for customers (accounts are kept
-- client-side), so Track Order / My Orders look orders up by id + email rather
-- than by auth.uid(). Reflect that with a public read policy. If you add real
-- Supabase Auth for customers later, tighten this to `auth.uid() = user_id`.
create policy "public read orders" on orders for select using (true);

-- Writes to products/coupons/settings and order status updates should go through
-- the service-role key from a server route (see app/api/admin/*), not the anon key,
-- since RLS above only grants public read + order/message insert.
