import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo-400.png" alt="Hesma Collection" className="w-10 h-10 rounded-full object-cover" />
            <div className="font-display text-2xl text-ivory">Hesma Collection</div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Anti-tarnish, everyday fine jewellery designed in-house — worn by thousands, made to last.
          </p>
          <div className="flex gap-3 mt-5">
            {["IG", "FB", "YT"].map((s) => (
              <span key={s} className="w-8 h-8 rounded-full border border-ivory/25 flex items-center justify-center text-[10px] tracking-wide">{s}</span>
            ))}
          </div>
        </div>
        <FooterCol title="Quick Links" links={[
          ["Home", "/"], ["Shop All", "/shop"], ["About Us", "/about"], ["Contact", "/contact"],
        ]} />
        <FooterCol title="Help" links={[
          ["Track Order", "/track-order"], ["Refund Policy", "/refund-policy"], ["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy-policy"],
        ]} />
        <FooterCol title="Account" links={[
          ["My Account", "/account"], ["Wishlist", "/wishlist"], ["Cart", "/cart"], ["Admin Login", "/admin/login"], ["Clear Cache", "/clear-cache"],
        ]} />
      </div>
      <div className="border-t border-ivory/10 text-center text-xs py-5 text-ivory/50">
        © {new Date().getFullYear()} Hesma Collection. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="eyebrow text-bronze-light mb-4">{title}</div>
      <ul className="flex flex-col gap-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={href}><Link href={href} className="hover:text-ivory transition-colors">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}