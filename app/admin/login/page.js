"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const adminLogin = useStore((s) => s.adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    adminLogin(password).then((ok) => {
      if (ok) router.push("/admin");
      else setError("Incorrect password.");
    });
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="font-display text-3xl text-center mb-2">Admin Panel</h1>
      <p className="text-center text-ink/60 text-sm mb-8">Hesma Collection back office</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-taupe rounded-sm px-3 py-2.5 text-sm"
        />
        {error && <div className="text-sm text-oxblood">{error}</div>}
        <button className="btn-primary w-full py-3 text-sm tracking-wide rounded-sm">Sign In</button>
      </form>
      <p className="text-xs text-ink/40 text-center mt-6">Default password: hesma@admin</p>
    </div>
  );
}
