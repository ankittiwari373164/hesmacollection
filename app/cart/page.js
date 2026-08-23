"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/seed";
import { useStore, moneyFmt } from "@/lib/store";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const removeCoupon = useStore((s) => s.removeCoupon);
  const appliedCoupon = useStore((s) => s.appliedCoupon);
  const settings = useStore((s) => s.settings);
  const currentUser = useStore((s) => s.currentUser);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);

  const items = useMemo(
    () => cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) || PRODUCTS.find((p) => p.id === c.productId) })).filter((i) => i.product),
    [cart, products]
  );

  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;
  const shipping = subtotal === 0 || subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const total = Math.max(0, subtotal - discount) + shipping;

  function onApply(e) {
    e.preventDefault();
    if (!code.trim()) return;
    const res = applyCoupon(code.trim(), subtotal);
    setMsg(res);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Looks like you haven&apos;t added anything to your bag yet.</p>
        <Link href="/shop" className="btn-primary inline-block px-8 py-3 text-sm tracking-wide rounded-sm">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Shopping Bag</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 divide-y divide-taupe">
          {items.map(({ product, qty, productId }) => (
            <div key={productId} className="flex gap-4 py-6">
              <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-sm bg-parchment" />
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <Link href={`/product/${product.id}`} className="font-medium hover:text-oxblood">{product.name}</Link>
                  <div className="text-sm text-ink/60 mt-1">{moneyFmt(product.price)} each</div>
                  <button onClick={() => removeFromCart(productId)} className="flex items-center gap-1 text-xs text-oxblood mt-3">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex items-center border border-taupe rounded-sm h-9">
                    <button onClick={() => setQty(productId, qty - 1)} className="w-8 h-full">−</button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button onClick={() => setQty(productId, qty + 1)} className="w-8 h-full">+</button>
                  </div>
                  <div className="font-medium w-20 text-right">{moneyFmt(product.price * qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-parchment rounded-sm p-6 h-fit">
          <h2 className="font-display text-2xl mb-5">Order Summary</h2>
          <form onSubmit={onApply} className="flex gap-2 mb-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border border-taupe rounded-sm px-3 py-2 text-sm outline-none focus:border-oxblood bg-ivory"
            />
            <button className="btn-outline px-4 text-sm rounded-sm">Apply</button>
          </form>
          {msg && <div className={`text-xs mb-4 ${msg.ok ? "text-green-700" : "text-oxblood"}`}>{msg.message}</div>}
          {appliedCoupon && (
            <div className="flex justify-between items-center text-xs bg-ivory border border-taupe rounded-sm px-3 py-2 mb-4">
              <span>Coupon <b>{appliedCoupon.code}</b> applied</span>
              <button onClick={removeCoupon} className="text-oxblood">Remove</button>
            </div>
          )}
          <div className="space-y-2 text-sm border-t border-taupe pt-4">
            <Row label="Subtotal" value={moneyFmt(subtotal)} />
            {discount > 0 && <Row label="Coupon discount" value={"-" + moneyFmt(discount)} />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : moneyFmt(shipping)} />
            <div className="border-t border-taupe pt-3 flex justify-between font-medium text-base">
              <span>Total</span><span>{moneyFmt(total)}</span>
            </div>
          </div>
          <Link href={currentUser ? "/checkout" : "/login?redirect=/checkout"} className="btn-primary block text-center mt-6 py-3 text-sm tracking-wide rounded-sm">
            Proceed to Checkout
          </Link>
          {!currentUser && <p className="text-xs text-ink/50 text-center mt-2">You'll need to sign in first</p>}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-ink/70">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
