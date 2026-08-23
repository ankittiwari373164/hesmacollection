# Hesma Collection — E-commerce Website

A full storefront + admin panel for **Hesma Collection**, built with Next.js (App Router), React, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

For a production build:
```bash
npm run build
npm run start
```

## What's included

**Storefront**
- Home — hero, bundle offers, shop-by-collection, Buy 1 Get 2, new arrivals, every product category rail, testimonials
- Shop — search, category filter, price filter, sorting
- Product detail — gallery, qty selector, add to cart, buy now, wishlist, related products
- Cart — quantity edit, coupon codes, free-shipping threshold
- Checkout — shipping form, Cash on Delivery or Online Payment, order placement
- Order success + Track Order (by order ID + email)
- Account — login/register, order history, saved addresses, profile
- Wishlist
- About, Contact (working enquiry form), Privacy Policy, Terms & Conditions, Refund Policy

## Data layer

The app can run in two modes:

**Local demo mode (default, no setup needed)** — if no Supabase environment variables are set, all data (products, cart, wishlist, accounts, orders, coupons, settings) lives in the browser via a Zustand store persisted to `localStorage`. Great for trying the site out immediately with `npm run dev`.

**Connected to Supabase (recommended for real use)** — once you add your Supabase keys (see below), the store automatically hydrates products, coupons, settings, and orders from your database, and admin writes go through server-side API routes instead of `localStorage`. Customer accounts (login/register) and the cart/wishlist stay client-side for simplicity — see "What's not migrated" below.

### Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `db/schema.sql` from this repo — it creates the `products`, `coupons`, `orders`, `settings`, and `messages` tables with Row Level Security policies already configured.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Project Settings → API. Safe for the browser.
   - `SUPABASE_SERVICE_ROLE_KEY` — also from Project Settings → API. **Keep this secret** — it's only read by server-side API routes (`app/api/admin/*`) and must never be prefixed with `NEXT_PUBLIC_`.
   - `ADMIN_PASSWORD` — the password for `/admin/login`. Read only on the server; never stored in the database or shipped to the browser.
4. Restart the dev server. The homepage/shop will now read live product data from Supabase, and admin CRUD (products, coupons, settings) and order status updates will persist there too.
5. To seed your Supabase `products` table with the built-in demo catalog, you can temporarily add a product from the Admin → Products screen, or bulk-insert rows using `lib/seed.js` as a reference for the shape.

### What's not migrated to Supabase
- **Customer accounts** (login/register) are still local-only (`localStorage`), not Supabase Auth — this keeps the demo simple. Because of that, Track Order and My Orders look orders up by order ID + email rather than a real session, and the `orders` table's read policy is intentionally public rather than restricted to `auth.uid()`. If you want real customer accounts, swap in Supabase Auth and tighten that RLS policy (the schema file has a comment showing exactly what to change).
- **Cart and wishlist** stay in `localStorage` per device/browser, which is standard for most storefronts.

## Admin panel

`/admin/login` — password comes from the `ADMIN_PASSWORD` environment variable (default `hesma@admin` if unset — change this before deploying). On successful login the server sets an httpOnly session cookie; all admin write operations (`/api/admin/*`) re-verify that cookie server-side before touching the database, so the password itself is never exposed to the browser or stored in Supabase.

- Dashboard — revenue, order count, active coupons
- Products — full CRUD (name, category, price, MRP, stock, images, flags)
- Orders — view details, update fulfillment status
- Coupons — create/edit/delete percent or flat discounts with minimum order rules
- Settings — store info, shipping fees/threshold, toggle COD on/off (+ optional handling fee), toggle online payments on/off, choose Razorpay or Stripe and store the publishable key

## Connecting real online payments

The Settings page lets you toggle "Online Payments" and store a **publishable/key ID** for Razorpay or Stripe — that part is safe to keep client-side. Checkout currently *simulates* a successful payment after a short delay so the flow works end-to-end today.

To accept real payments:
1. Add a Next.js API route (e.g. `app/api/create-order/route.js`) that uses your **secret key** (stored in an environment variable, never in the browser) to create a Razorpay order / Stripe PaymentIntent.
2. Call that route from `app/checkout/page.js` instead of the `setTimeout` simulation, then confirm payment client-side with Razorpay Checkout.js or Stripe.js using the publishable key from Settings.
3. Verify the payment server-side (webhook or signature check) before marking the order as paid.

## Tech stack
- Next.js 16 (App Router), React 19
- Tailwind CSS v4
- Supabase (Postgres + Row Level Security) for products, coupons, orders, settings, and contact messages
- Zustand (client state, with `localStorage` fallback when Supabase isn't configured)
- lucide-react (icons)

## Design
- Palette and mark: adapted from the Hesma Collection logo — plum (`#5B2A63`) and warm gold (`#B98D3E`) accents on a soft lavender-tinted ivory background
- Type: Fraunces (display) + Work Sans (body)
- Mobile navigation: an app-style bottom tab bar (Home / Shop / Saved / Bag / Account), matching native app conventions on small screens
