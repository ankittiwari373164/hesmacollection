"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/seed";
import { useStore, moneyFmt } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const settings = useStore((s) => s.settings);
  const appliedCoupon = useStore((s) => s.appliedCoupon);
  const placeOrder = useStore((s) => s.placeOrder);
  const currentUser = useStore((s) => s.currentUser);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (hydrated && !currentUser) {
      router.replace("/login?redirect=/checkout");
    }
  }, [hydrated, currentUser, router]);

  const items = useMemo(
    () => cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) || PRODUCTS.find((p) => p.id === c.productId) })).filter((i) => i.product),
    [cart, products]
  );
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const discount = appliedCoupon ? (appliedCoupon.type === "percent" ? Math.round((subtotal * appliedCoupon.value) / 100) : appliedCoupon.value) : 0;
  const shipping = subtotal === 0 || subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [method, setMethod] = useState(settings.codEnabled ? "cod" : "online");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const codFee = method === "cod" ? settings.codExtraFee : 0;
  const total = Math.max(0, subtotal - discount) + shipping + codFee;

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function validate() {
    for (const k of ["name", "email", "phone", "address1", "city", "state", "pincode"]) {
      if (!form[k].trim()) return "Please fill in all shipping details.";
    }
    if (!/^\d{10}$/.test(form.phone)) return "Enter a valid 10-digit phone number.";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter a valid 6-digit pincode.";
    return "";
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    setError("");
    setProcessing(true);

    // Simulated processing delay. In production, this is where you'd call
    // Razorpay/Stripe with settings.razorpayKeyId / settings.stripePublishableKey
    // via a server route to create + confirm the payment before placing the order.
    setTimeout(() => {
      placeOrder({
        items: items.map((i) => ({ productId: i.product.id, name: i.product.name, price: i.product.price, qty: i.qty, image: i.product.images[0] })),
        shipping: form,
        paymentMethod: method,
        paymentStatus: method === "cod" ? "Pending (COD)" : "Paid",
        subtotal,
        discount,
        shippingFee: shipping,
        codFee,
        total,
        coupon: appliedCoupon?.code || null,
      })
        .then((order) => {
          if (!order?.id) throw new Error("Order was not created.");
          router.push(`/order-success/${order.id}`);
        })
        .catch((err) => {
          setProcessing(false);
          setError(err.message || "Something went wrong placing your order. Please try again.");
        });
    }, method === "online" ? 1400 : 500);
  }

  if (!hydrated || !currentUser) {
    return <div className="max-w-md mx-auto px-6 py-24 text-center text-ink/50 text-sm">Checking your session…</div>;
  }

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink/60">Your cart is empty. <a href="/shop" className="text-oxblood underline">Go shopping</a></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-display text-2xl mb-4">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={(v) => update("name", v)} />
              <Input label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
              <Input label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
              <Input label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v)} />
              <Input label="Address" value={form.address1} onChange={(v) => update("address1", v)} className="sm:col-span-2" />
              <Input label="City" value={form.city} onChange={(v) => update("city", v)} />
              <Input label="State" value={form.state} onChange={(v) => update("state", v)} />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl mb-4">Payment Method</h2>
            <div className="space-y-3">
              {settings.codEnabled && (
                <PayOption id="cod" method={method} setMethod={setMethod} title="Cash on Delivery" desc={settings.codExtraFee > 0 ? `Extra fee of ${moneyFmt(settings.codExtraFee)} applies` : "Pay when your order arrives"} />
              )}
              {settings.onlinePaymentEnabled && (
                <PayOption id="online" method={method} setMethod={setMethod} title={`Pay Online (${settings.paymentProvider === "razorpay" ? "Razorpay" : "Stripe"})`} desc="UPI, cards, netbanking & wallets" />
              )}
              {!settings.codEnabled && !settings.onlinePaymentEnabled && (
                <div className="text-sm text-oxblood">No payment methods are currently enabled. Please contact support.</div>
              )}
            </div>
          </div>

          {error && <div className="text-sm text-oxblood bg-oxblood/5 border border-oxblood/30 rounded-sm px-4 py-2">{error}</div>}

          <button
            type="submit"
            disabled={processing || (!settings.codEnabled && !settings.onlinePaymentEnabled)}
            className="btn-primary w-full py-3.5 text-sm tracking-wide rounded-sm disabled:opacity-50"
          >
            {processing ? (method === "online" ? "Processing payment…" : "Placing order…") : `Place Order · ${moneyFmt(total)}`}
          </button>
        </div>

        <div className="bg-parchment rounded-sm p-6 h-fit">
          <h2 className="font-display text-2xl mb-5">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-auto pr-1">
            {items.map((i) => (
              <div key={i.productId} className="flex gap-3 text-sm">
                <img src={i.product.images[0]} className="w-12 h-12 rounded-sm object-cover" alt={i.product.name} />
                <div className="flex-1">
                  <div>{i.product.name}</div>
                  <div className="text-ink/50 text-xs">Qty {i.qty}</div>
                </div>
                <div>{moneyFmt(i.product.price * i.qty)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-taupe pt-4">
            <Row label="Subtotal" value={moneyFmt(subtotal)} />
            {discount > 0 && <Row label="Coupon discount" value={"-" + moneyFmt(discount)} />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : moneyFmt(shipping)} />
            {codFee > 0 && <Row label="COD fee" value={moneyFmt(codFee)} />}
            <div className="border-t border-taupe pt-3 flex justify-between font-medium text-base">
              <span>Total</span><span>{moneyFmt(total)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", className = "" }) {
  return (
    <label className={`text-xs text-ink/60 ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm outline-none focus:border-oxblood bg-ivory block"
      />
    </label>
  );
}

function PayOption({ id, method, setMethod, title, desc }) {
  return (
    <label className={`flex items-start gap-3 border rounded-sm px-4 py-3 cursor-pointer ${method === id ? "border-oxblood bg-oxblood/5" : "border-taupe"}`}>
      <input type="radio" name="pay" checked={method === id} onChange={() => setMethod(id)} className="mt-1 accent-oxblood" />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-ink/60">{desc}</div>
      </div>
    </label>
  );
}

function Row({ label, value }) {
  return <div className="flex justify-between text-ink/70"><span>{label}</span><span>{value}</span></div>;
}
