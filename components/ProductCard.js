"use client";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useStore, moneyFmt } from "@/lib/store";
import { onImgError } from "@/lib/imgFallback";

export default function ProductCard({ product }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const isWished = wishlist.includes(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-parchment rounded-sm card-hover">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={onImgError}
            className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500 bg-parchment"
          />
        </Link>
        {product.buy1get2 && (
          <span className="absolute top-3 left-3 bg-oxblood text-ivory text-[10px] tracking-wide px-2 py-1 rounded-sm">
            Buy 1 Get 2
          </span>
        )}
        {!product.buy1get2 && discount > 0 && (
          <span className="absolute top-3 left-3 bg-ink/85 text-ivory text-[10px] tracking-wide px-2 py-1 rounded-sm">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 bg-ivory/90 rounded-full p-1.5 hover:bg-ivory"
        >
          <Heart size={15} fill={isWished ? "#6E1F2A" : "none"} color={isWished ? "#6E1F2A" : "#2B2420"} />
        </button>
        <button
          onClick={() => addToCart(product.id, 1)}
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-ink text-ivory text-xs tracking-wide py-2.5"
        >
          Add to cart
        </button>
      </div>
      <Link href={`/product/${product.id}`} className="block mt-3">
        <div className="text-sm text-ink/90">{product.name}</div>
        <div className="flex items-center gap-1 text-[11px] text-bronze-dark mt-0.5">
          <Star size={11} fill="#A87C4F" /> {product.rating} ({product.reviews})
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium">{moneyFmt(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-ink/40 line-through">{moneyFmt(product.mrp)}</span>
          )}
        </div>
      </Link>
    </div>
  );
}
