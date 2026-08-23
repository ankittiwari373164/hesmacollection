"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useStore, moneyFmt } from "@/lib/store";

export default function AdminDashboard() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const coupons = useStore((s) => s.coupons);
  const fetchOrders = useStore((s) => s.fetchOrders);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const pending = orders.filter((o) => o.status !== "Delivered").length;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat label="Total Revenue" value={moneyFmt(revenue)} />
        <Stat label="Total Orders" value={orders.length} />
        <Stat label="Pending Orders" value={pending} />
        <Stat label="Active Products" value={products.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-taupe rounded-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-oxblood">View all</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex justify-between text-sm border-b border-taupe/60 pb-2">
                <span>#{o.id}</span>
                <span className="text-ink/60">{o.status}</span>
                <span>{moneyFmt(o.total)}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-ink/50">No orders placed yet.</p>}
          </div>
        </div>

        <div className="border border-taupe rounded-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl">Active Coupons</h2>
            <Link href="/admin/coupons" className="text-xs text-oxblood">Manage</Link>
          </div>
          <div className="space-y-3">
            {coupons.filter((c) => c.active).map((c) => (
              <div key={c.code} className="flex justify-between text-sm border-b border-taupe/60 pb-2">
                <span className="font-medium">{c.code}</span>
                <span className="text-ink/60">{c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-parchment rounded-sm p-5">
      <div className="text-xs text-ink/60 mb-1">{label}</div>
      <div className="font-display text-2xl text-oxblood">{value}</div>
    </div>
  );
}
