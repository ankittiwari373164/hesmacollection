"use client";
import { use } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useStore, moneyFmt } from "@/lib/store";

export default function OrderSuccessPage({ params }) {
  const { id } = use(params);
  const orders = useStore((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-ink/60">Order not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <CheckCircle2 className="mx-auto text-oxblood mb-6" size={48} />
      <h1 className="font-display text-4xl mb-3">Thank you, your order is confirmed</h1>
      <p className="text-ink/60 mb-8">
        Order <b>#{order.id}</b> has been placed. A confirmation has been sent to {order.shipping.email}.
      </p>
      <div className="bg-parchment rounded-sm p-6 text-left space-y-3 mb-10">
        {order.items.map((it) => (
          <div key={it.productId} className="flex justify-between text-sm">
            <span>{it.name} × {it.qty}</span>
            <span>{moneyFmt(it.price * it.qty)}</span>
          </div>
        ))}
        <div className="border-t border-taupe pt-3 flex justify-between font-medium">
          <span>Total ({order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"})</span>
          <span>{moneyFmt(order.total)}</span>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Link href="/track-order" className="btn-outline px-6 py-3 text-sm rounded-sm">Track Order</Link>
        <Link href="/shop" className="btn-primary px-6 py-3 text-sm rounded-sm">Continue Shopping</Link>
      </div>
    </div>
  );
}
