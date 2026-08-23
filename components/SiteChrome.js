"use client";
import { usePathname } from "next/navigation";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return children;
}
