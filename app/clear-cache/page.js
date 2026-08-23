"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearSiteCache } from "@/lib/clearCache";
import { RefreshCcw, CheckCircle2 } from "lucide-react";

export default function ClearCachePage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  function handleClear() {
    clearSiteCache();
    setDone(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      {done ? (
        <>
          <CheckCircle2 className="mx-auto text-oxblood mb-5" size={40} />
          <h1 className="font-display text-3xl mb-2">Cache cleared</h1>
          <p className="text-ink/60 text-sm">Taking you back to the homepage with a clean slate…</p>
        </>
      ) : (
        <>
          <RefreshCcw className="mx-auto text-bronze mb-5" size={36} />
          <h1 className="font-display text-3xl mb-3">Clear site data</h1>
          <p className="text-ink/60 text-sm mb-8 leading-relaxed">
            If you're seeing outdated products, an incorrect cart, or anything else that looks wrong,
            this will reset your saved cart, wishlist, and login on this device, then reload the site fresh.
            It won't affect your account or orders — those live on the server.
          </p>
          <button onClick={handleClear} className="btn-primary px-8 py-3 text-sm tracking-wide rounded-sm">
            Clear cache & reload
          </button>
        </>
      )}
    </div>
  );
}