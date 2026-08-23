"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Grid2x2 },
  { href: "/wishlist", label: "Saved", icon: Heart },
  { href: "/cart", label: "Bag", icon: ShoppingBag },
  { href: "/account", label: "Account", icon: User },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur border-t border-taupe pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const count = href === "/cart" ? cartCount : href === "/wishlist" ? wishlist.length : 0;
          return (
            <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 py-2.5 relative">
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} color={active ? "#5B2A63" : "#2E2233"} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-oxblood text-ivory text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </span>
              <span className={`text-[10px] ${active ? "text-oxblood font-medium" : "text-ink/60"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
