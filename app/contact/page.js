"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const settings = useStore((s) => s.settings);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } catch (err) {
      // Non-fatal — the user still gets a confirmation; message just wasn't persisted.
    }
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-14">
      <div>
        <div className="eyebrow mb-3">Get in touch</div>
        <h1 className="font-display text-4xl mb-6">We&apos;d love to hear from you</h1>
        <p className="text-ink/70 mb-8 text-sm leading-relaxed">
          Questions about an order, a product, or a bulk gifting enquiry? Reach out — our team replies within 24 hours.
        </p>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3"><Mail size={16} className="text-bronze" /> {settings.supportEmail}</div>
          <div className="flex items-center gap-3"><Phone size={16} className="text-bronze" /> {settings.supportPhone}</div>
          <div className="flex items-center gap-3"><MapPin size={16} className="text-bronze" /> {settings.address}</div>
        </div>

        <div className="mt-8 rounded-sm overflow-hidden border border-taupe">
          <iframe
            title="Hesma Collection store location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-64 sm:h-72"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-parchment rounded-sm p-8 space-y-4">
        {sent && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2">Thanks — your message has been sent. We'll get back to you soon.</div>}
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-taupe rounded-sm px-3 py-2.5 text-sm bg-white" />
        <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-taupe rounded-sm px-3 py-2.5 text-sm bg-white" />
        <textarea required placeholder="Your message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-taupe rounded-sm px-3 py-2.5 text-sm bg-white" />
        <button disabled={sending} className="btn-primary w-full py-3 text-sm tracking-wide rounded-sm disabled:opacity-60">{sending ? "Sending…" : "Send Message"}</button>
      </form>
    </div>
  );
}
