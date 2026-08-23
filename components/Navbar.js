"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const currentUser = useStore((s) => s.currentUser);
  const cartCount = useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);

  function onSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-taupe">
      <div className="bg-oxblood text-ivory text-center text-[11px] sm:text-xs tracking-wide py-2 px-4">
        Buy 4 Bracelets, Get a Tennis Bracelet Free &nbsp;·&nbsp; Free shipping over ₹999
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-400.png" alt="Hesma Collection" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover" />
          <span className="font-display text-2xl sm:text-3xl tracking-wide text-ink hidden xs:block">
            Hesma <span className="text-oxblood italic">Collection</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="hover:text-oxblood transition-colors">
              {c.name.split("/")[0].trim()}
            </Link>
          ))}
          <Link href="/shop" className="hover:text-oxblood transition-colors">Shop all</Link>
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <form onSubmit={onSearch} className="hidden md:flex items-center border border-taupe rounded-full px-3 py-1.5 gap-2 w-52">
            <Search size={15} className="text-bronze-dark" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery"
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink/40"
            />
          </form>
          <Link href="/wishlist" className="relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </Link>
          <Link href={currentUser ? "/account" : "/login"} aria-label="Account">
            <User size={20} />
          </Link>
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <Badge n={cartCount} />}
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ivory p-5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-xl">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            <form onSubmit={onSearch} className="flex items-center border border-taupe rounded-full px-3 py-2 gap-2 mb-6">
              <Search size={15} className="text-bronze-dark" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search jewellery" className="bg-transparent outline-none text-sm w-full" />
            </form>
            <nav className="flex flex-col gap-4 text-sm">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} href={`/shop?category=${c.slug}`} onClick={() => setOpen(false)}>{c.name}</Link>
              ))}
              <div className="rule my-2" />
              <Link href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              <Link href="/track-order" onClick={() => setOpen(false)}>Track Order</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }) {
  return (
    <span className="absolute -top-2 -right-2 bg-oxblood text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
      {n}
    </span>
  );
}
