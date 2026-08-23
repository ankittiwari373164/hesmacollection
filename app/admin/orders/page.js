"use client";
import { useEffect, useState } from "react";
import { useStore, moneyFmt } from "@/lib/store";

const STATUSES = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const orders = useStore((s) => s.orders);
  const fetchOrders = useStore((s) => s.fetchOrders);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      {orders.length === 0 && <p className="text-sm text-ink/50">No orders placed yet.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border border-taupe rounded-sm">
            <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="w-full flex flex-wrap justify-between items-center gap-3 px-5 py-4 text-left">
              <span className="text-sm font-medium">#{o.id}</span>
              <span className="text-xs text-ink/50">{new Date(o.createdAt).toLocaleString("en-IN")}</span>
              <span className="text-xs">{o.shipping.name}</span>
              <span className="text-sm">{moneyFmt(o.total)}</span>
              <span className="text-xs uppercase text-ink/50">{o.paymentMethod}</span>
              <select
                value={o.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                className="border border-taupe rounded-sm text-xs px-2 py-1 bg-white"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </button>
            {expanded === o.id && (
              <div className="border-t border-taupe px-5 py-4 text-sm space-y-3 bg-parchment/50">
                <div>
                  <div className="text-xs eyebrow mb-1">Shipping to</div>
                  {o.shipping.name}, {o.shipping.address1}, {o.shipping.city}, {o.shipping.state} - {o.shipping.pincode} · {o.shipping.phone}
                </div>
                <div>
                  <div className="text-xs eyebrow mb-1">Items</div>
                  {o.items.map((it) => (
                    <div key={it.productId} className="flex justify-between"><span>{it.name} × {it.qty}</span><span>{moneyFmt(it.price * it.qty)}</span></div>
                  ))}
                </div>
                <div className="text-xs text-ink/60">Payment status: {o.paymentStatus} {o.coupon ? `· Coupon: ${o.coupon}` : ""}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
