"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { LayoutDashboard, Package, ClipboardList, Tag, Settings, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useStore((s) => s.isAdmin);
  const adminSessionChecked = useStore((s) => s.adminSessionChecked);
  const checkAdminSession = useStore((s) => s.checkAdminSession);
  const adminLogout = useStore((s) => s.adminLogout);

  useEffect(() => {
    // isAdmin no longer persists across a refresh (no localStorage), so on
    // every mount we re-verify against the real httpOnly session cookie set
    // by /api/admin/login. This is also more secure than trusting a client flag.
    checkAdminSession();
  }, [checkAdminSession]);

  useEffect(() => {
    if (adminSessionChecked && !isAdmin) router.replace("/admin/login");
  }, [adminSessionChecked, isAdmin, router]);

  if (!adminSessionChecked || !isAdmin) {
    return <div className="max-w-md mx-auto px-6 py-24 text-center text-ink/50 text-sm">Checking admin session…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="font-display text-xl mb-6">Hesma Admin</div>
        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm ${active ? "bg-oxblood text-ivory" : "hover:bg-parchment text-ink/80"}`}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
          <button onClick={() => { adminLogout(); router.push("/admin/login"); }} className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm text-oxblood hover:bg-parchment w-full mt-4">
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}