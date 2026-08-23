"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, moneyFmt } from "@/lib/store";

export default function AccountPage() {
  const router = useRouter();
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);
  const orders = useStore((s) => s.orders);
  const fetchOrders = useStore((s) => s.fetchOrders);
  const addAddress = useStore((s) => s.addAddress);
  const [tab, setTab] = useState("orders");
  const [addr, setAddr] = useState({ label: "Home", line1: "", city: "", state: "", pincode: "" });

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="mb-6 text-ink/60">Please sign in to view your account.</p>
        <Link href="/login" className="btn-primary px-6 py-3 text-sm rounded-sm">Sign In</Link>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="eyebrow mb-1">My Account</div>
          <h1 className="font-display text-4xl">Hi, {currentUser.name.split(" ")[0]}</h1>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="btn-outline px-5 py-2 text-sm rounded-sm">Log out</button>
      </div>

      <div className="flex gap-6 border-b border-taupe mb-8 text-sm">
        {["orders", "addresses", "profile"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-3 capitalize border-b-2 -mb-px ${tab === t ? "border-oxblood text-oxblood" : "border-transparent text-ink/60"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-4">
          {myOrders.length === 0 && <p className="text-ink/50 text-sm">No orders yet. <Link href="/shop" className="text-oxblood underline">Start shopping</Link></p>}
          {myOrders.map((o) => (
            <div key={o.id} className="border border-taupe rounded-sm p-5">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">#{o.id}</span>
                <span className="text-oxblood">{o.status}</span>
              </div>
              <div className="text-xs text-ink/50 mb-3">{new Date(o.createdAt).toLocaleString("en-IN")}</div>
              <div className="text-sm">{o.items.map((i) => i.name).join(", ")}</div>
              <div className="text-sm font-medium mt-2">{moneyFmt(o.total)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "addresses" && (
        <div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {(currentUser.addresses || []).map((a) => (
              <div key={a.id} className="border border-taupe rounded-sm p-4 text-sm">
                <div className="font-medium mb-1">{a.label}</div>
                <div className="text-ink/60">{a.line1}, {a.city}, {a.state} - {a.pincode}</div>
              </div>
            ))}
            {(currentUser.addresses || []).length === 0 && <p className="text-ink/50 text-sm">No saved addresses.</p>}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); addAddress(addr); setAddr({ label: "Home", line1: "", city: "", state: "", pincode: "" }); }}
            className="grid sm:grid-cols-2 gap-3 max-w-lg"
          >
            <input placeholder="Label (Home/Work)" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} className="border border-taupe rounded-sm px-3 py-2 text-sm" />
            <input placeholder="Pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} className="border border-taupe rounded-sm px-3 py-2 text-sm" />
            <input placeholder="Address line" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} className="border border-taupe rounded-sm px-3 py-2 text-sm sm:col-span-2" />
            <input placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} className="border border-taupe rounded-sm px-3 py-2 text-sm" />
            <input placeholder="State" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className="border border-taupe rounded-sm px-3 py-2 text-sm" />
            <button className="btn-primary py-2.5 text-sm rounded-sm sm:col-span-2">Save Address</button>
          </form>
        </div>
      )}

      {tab === "profile" && (
        <div className="max-w-sm text-sm space-y-3">
          <div><span className="text-ink/50">Name: </span>{currentUser.name}</div>
          <div><span className="text-ink/50">Email: </span>{currentUser.email}</div>
        </div>
      )}
    </div>
  );
}
