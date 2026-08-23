export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="eyebrow mb-3 text-center">Our story</div>
      <h1 className="font-display text-5xl text-center mb-10">About Hesma Collection</h1>
      <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1400&auto=format&fit=crop" alt="Hesma studio" className="w-full aspect-[16/7] object-cover rounded-sm mb-10" />
      <div className="prose max-w-none text-ink/80 leading-relaxed space-y-5 text-[15px]">
        <p>Hesma Collection was founded on a simple idea: fine jewellery should be worn every single day, not saved for special occasions. Every piece we design is anti-tarnish, waterproof-friendly, and built to hold its shine through years of everyday life — the gym, the shower, the beach, the 9-to-5.</p>
        <p>We work with 18k gold-plated brass and hand-set cubic zirconia to create pieces that look and feel premium without the price tag or the upkeep of solid gold. Our design team draws from minimalist, stackable silhouettes so you can build a look that's entirely your own.</p>
        <p>From our studio, every order is quality-checked, wrapped in a signature Hesma box, and shipped with care across India. We stand behind every piece with a 7-day easy return policy and responsive customer support.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 mt-14 text-center">
        {[
          ["10,000+", "Happy customers"],
          ["100%", "Anti-tarnish guarantee"],
          ["7 days", "Easy returns"],
        ].map(([n, l]) => (
          <div key={l} className="bg-parchment rounded-sm py-8">
            <div className="font-display text-4xl text-oxblood">{n}</div>
            <div className="text-xs text-ink/60 mt-2">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
