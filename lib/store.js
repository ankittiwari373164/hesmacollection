"use client";
import { create } from "zustand";
import { PRODUCTS } from "./seed";
import { supabase, supabaseEnabled } from "./supabaseClient";
import { productFromRow, couponFromRow, settingsFromRow, orderFromRow, orderToRow } from "./mappers";

const uid = (p = "") => p + Math.random().toString(36).slice(2, 10);

const DEFAULT_SETTINGS = {
  storeName: "Hesma Collection",
  supportEmail: "care@hesmacollection.com",
  supportPhone: "+91 98765 43210",
  address: "14 Ivory Lane, Zaveri Bazaar, Mumbai, MH 400002",
  codEnabled: true,
  codExtraFee: 0,
  onlinePaymentEnabled: true,
  paymentProvider: "razorpay", // razorpay | stripe
  razorpayKeyId: "",
  stripePublishableKey: "",
  freeShippingThreshold: 999,
  shippingFee: 79,
};

export const useStore = create((set, get) => ({
  // ---------- data source ----------
  dataSource: supabaseEnabled ? "supabase" : "local",
  hydrateFromSupabase: async () => {
    if (!supabaseEnabled) return;
    try {
      const [{ data: prodRows }, { data: couponRows }, { data: settingsRow }] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("coupons").select("*"),
        supabase.from("settings").select("*").eq("id", 1).single(),
      ]);
      set((s) => ({
        dataSource: "supabase",
        products: prodRows?.length ? prodRows.map(productFromRow) : s.products,
        coupons: couponRows?.length ? couponRows.map(couponFromRow) : s.coupons,
        settings: settingsRow ? { ...s.settings, ...settingsFromRow(settingsRow) } : s.settings,
      }));
    } catch (e) {
      console.warn("Supabase hydrate failed, staying on local data:", e.message);
    }
  },

  // ---------- catalog ----------
  // When Supabase is configured we start empty and load real products on
  // mount (see hydrateFromSupabase) instead of showing the demo catalog.
  products: supabaseEnabled ? [] : PRODUCTS,
  addProduct: async (product) => {
    const local = { ...product, id: uid("p_") };
    set((s) => ({ products: [local, ...s.products] }));
    if (!supabaseEnabled) return;
    try {
      const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) });
      const json = await res.json();
      if (json.ok) set((s) => ({ products: s.products.map((p) => (p.id === local.id ? productFromRow(json.data) : p)) }));
    } catch (e) { console.warn(e); }
  },
  updateProduct: async (id, patch) => {
    set((s) => ({ products: s.products.map((pr) => (pr.id === id ? { ...pr, ...patch } : pr)) }));
    if (!supabaseEnabled) return;
    try {
      const merged = { ...get().products.find((p) => p.id === id) };
      await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...merged }) });
    } catch (e) { console.warn(e); }
  },
  deleteProduct: async (id) => {
    set((s) => ({ products: s.products.filter((pr) => pr.id !== id) }));
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); } catch (e) { console.warn(e); }
  },

  // ---------- cart ----------
  // In-memory only (no localStorage) — resets on a hard refresh. See lib/store.js
  // notes: this trades a small UX nicety for zero chance of ever showing stale
  // cached data again.
  cart: [], // { productId, qty }
  addToCart: (productId, qty = 1) =>
    set((s) => {
      const existing = s.cart.find((c) => c.productId === productId);
      if (existing) {
        return { cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c)) };
      }
      return { cart: [...s.cart, { productId, qty }] };
    }),
  setQty: (productId, qty) =>
    set((s) => ({
      cart: qty <= 0 ? s.cart.filter((c) => c.productId !== productId) : s.cart.map((c) => (c.productId === productId ? { ...c, qty } : c)),
    })),
  removeFromCart: (productId) => set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),
  clearCart: () => set({ cart: [] }),

  // ---------- wishlist ----------
  wishlist: [],
  toggleWishlist: (productId) =>
    set((s) => ({
      wishlist: s.wishlist.includes(productId) ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId],
    })),

  // ---------- coupons ----------
  coupons: [
    { code: "HESMA10", type: "percent", value: 10, minOrder: 500, active: true, description: "10% off on orders above ₹500" },
    { code: "WELCOME100", type: "flat", value: 100, minOrder: 999, active: true, description: "Flat ₹100 off for new customers" },
  ],
  addCoupon: async (c) => {
    const local = { ...c, code: c.code.toUpperCase() };
    set((s) => ({ coupons: [local, ...s.coupons] }));
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(local) }); } catch (e) { console.warn(e); }
  },
  updateCoupon: async (code, patch) => {
    set((s) => ({ coupons: s.coupons.map((c) => (c.code === code ? { ...c, ...patch } : c)) }));
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/coupons", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, patch }) }); } catch (e) { console.warn(e); }
  },
  deleteCoupon: async (code) => {
    set((s) => ({ coupons: s.coupons.filter((c) => c.code !== code) }));
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/coupons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }); } catch (e) { console.warn(e); }
  },
  appliedCoupon: null,
  applyCoupon: (code, subtotal) => {
    const c = get().coupons.find((x) => x.code === code.toUpperCase() && x.active);
    if (!c) return { ok: false, message: "Invalid or expired coupon code." };
    if (subtotal < c.minOrder) return { ok: false, message: `Add items worth ₹${c.minOrder - subtotal} more to use this coupon.` };
    set({ appliedCoupon: c });
    return { ok: true, message: `Coupon ${c.code} applied!` };
  },
  removeCoupon: () => set({ appliedCoupon: null }),

  // ---------- auth (customers) ----------
  // Also in-memory only for now — signing in again after a refresh is a known
  // trade-off of removing localStorage. A real fix is Supabase Auth (cookie-based
  // sessions), which is a natural next step given the real schema now has a
  // `profiles` table wired to auth.users.
  users: [],
  currentUser: null,
  register: (user) => {
    const exists = get().users.find((u) => u.email === user.email);
    if (exists) return { ok: false, message: "An account with this email already exists." };
    const newUser = { ...user, id: uid("u_"), addresses: [] };
    set((s) => ({ users: [...s.users, newUser], currentUser: newUser }));
    return { ok: true };
  },
  login: (email, password) => {
    const u = get().users.find((x) => x.email === email && x.password === password);
    if (!u) return { ok: false, message: "Incorrect email or password." };
    set({ currentUser: u });
    return { ok: true };
  },
  logout: () => set({ currentUser: null }),
  addAddress: (address) =>
    set((s) => {
      if (!s.currentUser) return {};
      const addr = { ...address, id: uid("a_") };
      const updatedUser = { ...s.currentUser, addresses: [...(s.currentUser.addresses || []), addr] };
      return {
        currentUser: updatedUser,
        users: s.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      };
    }),

  // ---------- orders ----------
  orders: [],
  placeOrder: async (order) => {
    const newOrder = {
      ...order,
      id: "HES" + Math.floor(100000 + Math.random() * 899999),
      status: "Placed",
      createdAt: new Date().toISOString(),
      userId: get().currentUser?.id || null,
    };
    set((s) => ({ orders: [newOrder, ...s.orders], cart: [], appliedCoupon: null }));
    if (supabaseEnabled) {
      try { await supabase.from("orders").insert(orderToRow(newOrder)); } catch (e) { console.warn("Order insert to Supabase failed:", e.message); }
    }
    return newOrder;
  },
  fetchOrders: async () => {
    if (!supabaseEnabled) return;
    try {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) set({ orders: data.map(orderFromRow) });
    } catch (e) { console.warn(e); }
  },
  updateOrderStatus: async (id, status) => {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) }));
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) }); } catch (e) { console.warn(e); }
  },

  // ---------- admin ----------
  // isAdmin is just a UI flag now (not persisted). The real source of truth is
  // the httpOnly session cookie set by /api/admin/login — checkAdminSession()
  // re-verifies against that on every admin page load.
  isAdmin: false,
  adminSessionChecked: false,
  checkAdminSession: async () => {
    try {
      const res = await fetch("/api/admin/session");
      const json = await res.json();
      set({ isAdmin: !!json.ok, adminSessionChecked: true });
    } catch (e) {
      set({ isAdmin: false, adminSessionChecked: true });
    }
  },
  adminLogin: async (password) => {
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const json = await res.json();
      if (json.ok) { set({ isAdmin: true, adminSessionChecked: true }); return true; }
      return false;
    } catch (e) { console.warn(e); return false; }
  },
  adminLogout: async () => {
    set({ isAdmin: false });
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch (e) { console.warn(e); }
  },

  // ---------- settings ----------
  settings: DEFAULT_SETTINGS,
  updateSettings: async (patch) => {
    const merged = { ...get().settings, ...patch };
    set({ settings: merged });
    if (!supabaseEnabled) return;
    try { await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(merged) }); } catch (e) { console.warn(e); }
  },
}));

export function moneyFmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}