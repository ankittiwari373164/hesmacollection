"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) { setError(res.message); return; }
    router.push(redirect);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-4xl mb-2 text-center">Welcome Back</h1>
      <p className="text-center text-ink/60 mb-10 text-sm">
        {redirect === "/checkout" ? "Sign in to continue to checkout" : "Sign in to your Hesma account"}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <div className="text-sm text-oxblood">{error}</div>}
        <button className="btn-primary w-full py-3 text-sm tracking-wide rounded-sm">Sign In</button>
      </form>
      <p className="text-center text-sm text-ink/60 mt-6">
        New here? <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-oxblood">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-24 text-center text-ink/50 text-sm">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

export function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block text-xs text-ink/60">
      {label}
      <input type={type} value={value} required onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border border-taupe rounded-sm px-3 py-2.5 text-sm outline-none focus:border-oxblood bg-white" />
    </label>
  );
}
