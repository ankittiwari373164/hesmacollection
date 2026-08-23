"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { clearSiteCache } from "@/lib/clearCache";

export default function AdminSettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function save(e) {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Settings</h1>
      <form onSubmit={save} className="space-y-10">
        <section>
          <h2 className="font-display text-xl mb-4">Store Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Store Name" value={form.storeName} onChange={(v) => set("storeName", v)} />
            <Field label="Support Email" value={form.supportEmail} onChange={(v) => set("supportEmail", v)} />
            <Field label="Support Phone" value={form.supportPhone} onChange={(v) => set("supportPhone", v)} />
            <Field label="Store Address" value={form.address} onChange={(v) => set("address", v)} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Shipping</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Standard Shipping Fee (₹)" type="number" value={form.shippingFee} onChange={(v) => set("shippingFee", Number(v))} />
            <Field label="Free Shipping Above (₹)" type="number" value={form.freeShippingThreshold} onChange={(v) => set("freeShippingThreshold", Number(v))} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 border border-taupe rounded-sm px-4 py-3">
              <input type="checkbox" checked={form.codEnabled} onChange={(e) => set("codEnabled", e.target.checked)} className="accent-oxblood" />
              <div>
                <div className="text-sm font-medium">Cash on Delivery (COD)</div>
                <div className="text-xs text-ink/60">Allow customers to pay on delivery</div>
              </div>
            </label>
            {form.codEnabled && (
              <Field label="Extra COD Handling Fee (₹, optional)" type="number" value={form.codExtraFee} onChange={(v) => set("codExtraFee", Number(v))} />
            )}

            <label className="flex items-center gap-3 border border-taupe rounded-sm px-4 py-3">
              <input type="checkbox" checked={form.onlinePaymentEnabled} onChange={(e) => set("onlinePaymentEnabled", e.target.checked)} className="accent-oxblood" />
              <div>
                <div className="text-sm font-medium">Online Payments</div>
                <div className="text-xs text-ink/60">Accept UPI, cards, netbanking via a payment gateway</div>
              </div>
            </label>

            {form.onlinePaymentEnabled && (
              <div className="border border-taupe rounded-sm p-4 space-y-4">
                <div>
                  <label className="text-xs text-ink/60">Gateway Provider</label>
                  <select value={form.paymentProvider} onChange={(e) => set("paymentProvider", e.target.value)} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white">
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                {form.paymentProvider === "razorpay" ? (
                  <Field label="Razorpay Key ID" value={form.razorpayKeyId} onChange={(v) => set("razorpayKeyId", v)} placeholder="rzp_live_xxxxxxxx" />
                ) : (
                  <Field label="Stripe Publishable Key" value={form.stripePublishableKey} onChange={(v) => set("stripePublishableKey", v)} placeholder="pk_live_xxxxxxxx" />
                )}
                <p className="text-xs text-ink/50 leading-relaxed">
                  Only the publishable/key ID is stored here for reference in the UI. Your secret key must live server-side
                  (e.g. an environment variable in a Next.js API route) and never in the browser — this demo store simulates
                  a successful payment on checkout since it has no backend server.
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Admin Access</h2>
          <p className="text-xs text-ink/60 leading-relaxed bg-parchment border border-taupe rounded-sm p-4">
            The admin password is set via the <code className="text-oxblood">ADMIN_PASSWORD</code> environment variable
            (see <code className="text-oxblood">.env.local</code>), not stored in the database — this keeps it out of
            the browser and out of Supabase. Update it in your hosting provider's environment settings and redeploy to change it.
          </p>
        </section>

        <button className="btn-primary px-6 py-3 text-sm rounded-sm">Save Settings</button>
        {saved && <span className="ml-4 text-sm text-green-700">Settings saved ✓</span>}
      </form>

      <section className="mt-12 pt-8 border-t border-taupe">
        <h2 className="font-display text-xl mb-2 text-oxblood">Danger Zone</h2>
        <p className="text-xs text-ink/60 mb-4 max-w-lg leading-relaxed">
          Clears your cart, wishlist, and saved login on this browser, then reloads. Useful if the storefront
          is showing stale or incorrect data after a database change. This does not delete anything from Supabase.
        </p>
        <ClearCacheButton />
      </section>
    </div>
  );
}

function ClearCacheButton() {
  const [cleared, setCleared] = useState(false);
  function handleClick() {
    clearSiteCache();
    setCleared(true);
    setTimeout(() => window.location.reload(), 900);
  }
  return (
    <button onClick={handleClick} className="btn-outline px-5 py-2.5 text-sm rounded-sm border-oxblood text-oxblood hover:bg-oxblood hover:text-ivory">
      {cleared ? "Cleared — reloading…" : "Clear local cache & reload"}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="text-xs text-ink/60 block">
      {label}
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white block" />
    </label>
  );
}