"use client";
import { useEffect, useState } from "react";
import { useStore, moneyFmt } from "@/lib/store";
import { Check } from "lucide-react";

const STEPS = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

export default function TrackOrderPage() {
  const orders = useStore((s) => s.orders);
  const fetchOrders = useStore((s) => s.fetchOrders);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(undefined);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleSubmit(e) {
    e.preventDefault();
    const found = orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase() && o.shipping.email.toLowerCase() === email.trim().toLowerCase());
    setResult(found || null);
  }

  const stepIndex = result ? Math.max(0, STEPS.indexOf(result.status)) : -1;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="eyebrow mb-3 text-center">Where's my order</div>
      <h1 className="font-display text-4xl text-center mb-10">Track Your Order</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input required placeholder="Order ID (e.g. HES123456)" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="flex-1 border border-taupe rounded-sm px-3 py-2.5 text-sm" />
        <input required type="email" placeholder="Email used at checkout" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 border border-taupe rounded-sm px-3 py-2.5 text-sm" />
        <button className="btn-primary px-6 py-2.5 text-sm rounded-sm">Track</button>
      </form>

      {result === null && <p className="text-center text-oxblood text-sm">No order found with those details. Please check and try again.</p>}

      {result && (
        <div className="border border-taupe rounded-sm p-6">
          <div className="flex justify-between mb-6 text-sm">
            <span className="font-medium">#{result.id}</span>
            <span>{new Date(result.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex items-center mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && <div className={`absolute top-3 right-1/2 w-full h-0.5 ${i <= stepIndex ? "bg-oxblood" : "bg-taupe"}`} />}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] z-10 ${i <= stepIndex ? "bg-oxblood text-ivory" : "bg-taupe text-ink/50"}`}>
                  {i <= stepIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-[10px] mt-2 text-center leading-tight">{s}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            {result.items.map((it) => (
              <div key={it.productId} className="flex justify-between"><span>{it.name} × {it.qty}</span><span>{moneyFmt(it.price * it.qty)}</span></div>
            ))}
          </div>
          <div className="border-t border-taupe mt-4 pt-4 flex justify-between font-medium text-sm">
            <span>Total</span><span>{moneyFmt(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
