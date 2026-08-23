"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/seed";
import { useStore, moneyFmt } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import { Heart, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const products = useStore((s) => s.products);
  const product = products.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === id);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const currentUser = useStore((s) => s.currentUser);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center">Product not found.</div>;
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const isWished = wishlist.includes(product.id);

  function handleBuyNow() {
    addToCart(product.id, qty);
    router.push(currentUser ? "/checkout" : "/login?redirect=/checkout");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-xs text-ink/50 mb-8">
        <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${product.category}`} className="capitalize">{product.category}</Link> / <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <h1 className="font-display text-4xl mb-2">{product.name}</h1>
          <div className="flex items-center gap-1 text-sm text-bronze-dark mb-4">
            <Star size={14} fill="#A87C4F" /> {product.rating} · {product.reviews} reviews
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-medium">{moneyFmt(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-ink/40 line-through">{moneyFmt(product.mrp)}</span>
                <span className="text-oxblood text-sm">{discount}% off</span>
              </>
            )}
          </div>
          <p className="text-xs text-ink/50 mb-6">Inclusive of all taxes</p>

          <p className="text-sm text-ink/70 leading-relaxed mb-6">{product.description}</p>

          <div className="text-xs text-ink/60 mb-6">SKU: {product.sku} &nbsp;·&nbsp; {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-taupe rounded-sm">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 hover:bg-parchment" aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-9 h-9 hover:bg-parchment" aria-label="Increase quantity">+</button>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="flex items-center gap-2 text-sm border border-taupe rounded-sm px-4 py-2 hover:border-oxblood"
            >
              <Heart size={16} fill={isWished ? "#6E1F2A" : "none"} color={isWished ? "#6E1F2A" : "#2B2420"} />
              Wishlist
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => { addToCart(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
              className="btn-outline flex-1 py-3 text-sm tracking-wide rounded-sm"
              disabled={product.stock === 0}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button onClick={handleBuyNow} className="btn-primary flex-1 py-3 text-sm tracking-wide rounded-sm" disabled={product.stock === 0}>
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-taupe pt-6 text-center text-xs text-ink/60">
            <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-bronze" /> Free shipping over ₹999</div>
            <div className="flex flex-col items-center gap-1"><ShieldCheck size={18} className="text-bronze" /> Anti-tarnish guarantee</div>
            <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-bronze" /> 7-day easy returns</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-3xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}