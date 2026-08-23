"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/lib/seed";
import ProductCard from "@/components/ProductCard";

function ShopInner() {
  const params = useSearchParams();
  const initialCategory = params.get("category") || "all";
  const initialQ = params.get("q") || "";
  const [category, setCategory] = useState(initialCategory);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(3000);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => (category === "all" ? true : p.category === category));
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, q, sort, maxPrice]);

  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="eyebrow mb-2">Shop</div>
        <h1 className="font-display text-4xl">{categoryName || "All Jewellery"}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="lg:w-64 shrink-0 space-y-8">
          <div>
            <div className="text-xs eyebrow mb-3">Search</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full border border-taupe rounded-sm px-3 py-2 text-sm outline-none focus:border-oxblood"
            />
          </div>
          <div>
            <div className="text-xs eyebrow mb-3">Category</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCategory("all")} className={category === "all" ? "text-oxblood font-medium" : "text-ink/70 hover:text-ink"}>
                  All categories
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <button onClick={() => setCategory(c.slug)} className={category === c.slug ? "text-oxblood font-medium" : "text-ink/70 hover:text-ink"}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs eyebrow mb-3">Max price: ₹{maxPrice}</div>
            <input type="range" min={300} max={3000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-oxblood" />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-ink/60">{filtered.length} products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-taupe rounded-sm text-sm px-3 py-2 outline-none">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-ink/50">No products match your filters. Try widening your search.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-24 text-center text-ink/50">Loading…</div>}>
      <ShopInner />
    </Suspense>
  );
}
