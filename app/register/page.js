"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Field } from "../login/page";

function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const register = useStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const res = register({ name, email, password });
    if (!res.ok) { setError(res.message); return; }
    router.push(redirect);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-4xl mb-2 text-center">Create Account</h1>
      <p className="text-center text-ink/60 mb-10 text-sm">
        {redirect === "/checkout" ? "Create an account to continue to checkout" : "Join Hesma Collection for faster checkout & order tracking"}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name" value={name} onChange={setName} />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <div className="text-sm text-oxblood">{error}</div>}
        <button className="btn-primary w-full py-3 text-sm tracking-wide rounded-sm">Create Account</button>
      </form>
      <p className="text-center text-sm text-ink/60 mt-6">
        Already have an account? <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-oxblood">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-24 text-center text-ink/50 text-sm">Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}
