"use client";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const products = useStore((s) => s.products);
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink/60 mb-6">You haven&apos;t saved anything yet.</p>
          <Link href="/shop" className="btn-primary px-6 py-3 text-sm rounded-sm">Explore jewellery</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}