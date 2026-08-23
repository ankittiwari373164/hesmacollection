"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Trash2, Plus } from "lucide-react";

const BLANK = { code: "", type: "percent", value: 10, minOrder: 0, active: true, description: "" };

export default function AdminCouponsPage() {
  const coupons = useStore((s) => s.coupons);
  const addCoupon = useStore((s) => s.addCoupon);
  const updateCoupon = useStore((s) => s.updateCoupon);
  const deleteCoupon = useStore((s) => s.deleteCoupon);
  const [form, setForm] = useState(BLANK);
  const [showForm, setShowForm] = useState(false);

  function save(e) {
    e.preventDefault();
    addCoupon({ ...form, value: Number(form.value), minOrder: Number(form.minOrder) });
    setForm(BLANK);
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Coupons</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-sm"><Plus size={16} /> New Coupon</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="border border-taupe bg-parchment rounded-sm p-5 mb-8 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-ink/60">Code</label>
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
          </div>
          <div>
            <label className="text-xs text-ink/60">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white">
              <option value="percent">Percentage off</option>
              <option value="flat">Flat amount off</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-ink/60">Value ({form.type === "percent" ? "%" : "₹"})</label>
            <input required type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
          </div>
          <div>
            <label className="text-xs text-ink/60">Minimum order (₹)</label>
            <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-ink/60">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2 text-sm bg-white" />
          </div>
          <div className="sm:col-span-2">
            <button className="btn-primary px-5 py-2 text-sm rounded-sm">Create Coupon</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.code} className="border border-taupe rounded-sm px-5 py-4 flex flex-wrap justify-between items-center gap-3">
            <div>
              <div className="font-medium text-sm">{c.code}</div>
              <div className="text-xs text-ink/60">{c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`} · min order ₹{c.minOrder} · {c.description}</div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={c.active} onChange={(e) => updateCoupon(c.code, { active: e.target.checked })} className="accent-oxblood" /> Active
              </label>
              <button onClick={() => deleteCoupon(c.code)} aria-label="Delete coupon"><Trash2 size={15} className="text-oxblood" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
