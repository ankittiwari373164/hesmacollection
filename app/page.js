"use client";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, BUNDLES } from "@/lib/seed";
import ProductCard from "@/components/ProductCard";
import ResponsiveRow from "@/components/ResponsiveRow";
import { SectionHeader, BangleDivider } from "@/components/Section";
import { Star } from "lucide-react";

function byCat(slug, n) {
  return PRODUCTS.filter((p) => p.category === slug).slice(0, n);
}

function ProductRow({ products }) {
  return (
    <ResponsiveRow
      items={products}
      keyFn={(p) => p.id}
      renderItem={(p) => <ProductCard product={p} />}
      gridClassName="sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

export default function Home() {
  const buy1get2 = PRODUCTS.filter((p) => p.buy1get2).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-parchment via-ivory to-taupe/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow mb-4">Send love, wear it forever</div>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mb-6">
              Buy any <span className="italic text-oxblood">4 bracelets</span> &amp; get a tennis bracelet, free.
            </h1>
            <p className="text-ink/70 max-w-md mb-8 leading-relaxed">
              Anti-tarnish, 18k gold-plated jewellery designed for everyday wear — stack it, gift it, keep it forever.
            </p>
            <div className="flex gap-4">
              <Link href="/shop?category=bracelets" className="btn-primary px-7 py-3 text-sm tracking-wide rounded-sm">Shop the offer</Link>
              <Link href="/shop" className="btn-outline px-7 py-3 text-sm tracking-wide rounded-sm">Explore all</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop"
              alt="Model wearing Hesma bracelets"
              className="rounded-sm w-full aspect-[4/5] object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-ivory border border-taupe rounded-sm p-4 hidden sm:block shadow-lg">
              <div className="text-xs eyebrow mb-1">Total gifts worth</div>
              <div className="font-display text-2xl text-oxblood">₹4,999/-</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <BangleDivider />

        {/* BUILD YOUR BUNDLE */}
        <section id="section-1" className="scroll-mt-28">
          <SectionHeader eyebrow="Mix & save" title="Build Your Bundle" />
          <ResponsiveRow
            items={BUNDLES}
            keyFn={(b) => b.label}
            gridClassName="sm:grid-cols-2 lg:grid-cols-4"
            itemWidthClass="w-[62vw]"
            renderItem={(b) => (
              <Link
                href="/shop"
                className="bg-parchment rounded-sm p-8 text-center card-hover flex flex-col items-center gap-2 h-full justify-center"
              >
                <span className="eyebrow">{b.label}</span>
                <span className="font-display text-3xl text-oxblood">{b.price}</span>
              </Link>
            )}
          />
        </section>

        <BangleDivider />

        {/* SHOP BY COLLECTION */}
        <section id="section-2" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="Curated for you" title="Shop by Collection" />
          <ResponsiveRow
            items={CATEGORIES}
            keyFn={(c) => c.slug}
            gridClassName="sm:grid-cols-4 lg:grid-cols-5"
            itemWidthClass="w-[30vw]"
            renderItem={(c) => (
              <Link href={`/shop?category=${c.slug}`} className="group text-center block">
                <div className="overflow-hidden rounded-full aspect-square">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-xs mt-3 leading-tight">{c.name} →</div>
              </Link>
            )}
          />
        </section>

        <BangleDivider />

        {/* BUY 1 GET 2 */}
        <section id="section-3" className="scroll-mt-28">
          <SectionHeader eyebrow="Limited time" title="Buy 1 Get 2" viewAllHref="/shop" />
          <ProductRow products={buy1get2} />
        </section>

        <BangleDivider />

        {/* BABY SIZE / THIN WRIST */}
        <section id="section-4" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="For delicate wrists" title="Baby Size / Thin Wrist Bracelets" viewAllHref="/shop?category=bracelets-thin" />
          <ProductRow products={byCat("bracelets-thin", 6)} />
        </section>

        <BangleDivider />

        {/* WATCHES */}
        <section id="section-5" className="scroll-mt-28">
          <SectionHeader eyebrow="Timeless" title="Watches" viewAllHref="/shop?category=watches" />
          <ProductRow products={byCat("watches", 6)} />
        </section>

        <BangleDivider />

        {/* NEW ARRIVALS */}
        <section id="section-6" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="Fresh in" title="New Arrivals" viewAllHref="/shop" />
          <ProductRow products={newArrivals.length ? newArrivals : featured} />
        </section>

        <BangleDivider />

        {/* EARRINGS */}
        <section id="section-7" className="scroll-mt-28">
          <SectionHeader eyebrow="Sparkle daily" title="Anti Tarnish Earrings" viewAllHref="/shop?category=earrings" />
          <ProductRow products={byCat("earrings", 6)} />
        </section>

        <BangleDivider />

        {/* NECKLACES */}
        <section id="section-8" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="Because your neck deserves it" title="Necklaces" viewAllHref="/shop?category=necklaces" />
          <ProductRow products={byCat("necklaces", 6)} />
        </section>

        <BangleDivider />

        {/* RINGS */}
        <section id="section-9" className="scroll-mt-28">
          <SectionHeader eyebrow="A little reminder to love yourself" title="Rings" viewAllHref="/shop?category=rings" />
          <ProductRow products={byCat("rings", 6)} />
        </section>

        <BangleDivider />

        {/* BRACELETS */}
        <section id="section-10" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="Twinkle on your wrist" title="Bracelets" viewAllHref="/shop?category=bracelets" />
          <ProductRow products={byCat("bracelets", 6)} />
        </section>

        <BangleDivider />

        {/* FOUR LEAF */}
        <section id="section-11" className="scroll-mt-28">
          <SectionHeader eyebrow="Lucky charm" title="Four Leaf" viewAllHref="/shop?category=four-leaf" />
          <ProductRow products={byCat("four-leaf", 6)} />
        </section>

        <BangleDivider />

        {/* GIFT HAMPERS */}
        <section id="section-12" className="scroll-mt-28 bg-parchment/40 rounded-2xl px-4 sm:px-8 py-10 -mx-4 sm:-mx-8">
          <SectionHeader eyebrow="Gifting made easy" title="Gift Hampers" viewAllHref="/shop?category=gift-hampers" />
          <ProductRow products={byCat("gift-hampers", 6)} />
        </section>

        <BangleDivider />

        {/* MEN'S */}
        <section id="section-13" className="scroll-mt-28">
          <SectionHeader eyebrow="For him" title="Men's Collection" viewAllHref="/shop?category=mens" />
          <ProductRow products={byCat("mens", 6)} />
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="bg-parchment mt-24 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="eyebrow mb-2">Real stories</div>
            <h2 className="font-display text-3xl sm:text-4xl">Let customers speak for us</h2>
          </div>
          <ResponsiveRow
            items={[
              { name: "Ananya R.", text: "The anti-tarnish claim is real — I've worn my earrings daily for six months, still gold." },
              { name: "Priya S.", text: "Ordered the bracelet stack for my sister's birthday. Packaging felt genuinely premium." },
              { name: "Meera K.", text: "Customer support helped me track and re-deliver my order within a day. Excellent service." },
            ]}
            keyFn={(t) => t.name}
            gridClassName="sm:grid-cols-3"
            itemWidthClass="w-[80vw]"
            renderItem={(t) => (
              <div className="bg-ivory rounded-sm p-6 border border-taupe h-full">
                <div className="flex gap-1 text-bronze mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#B98D3E" />)}
                </div>
                <p className="text-sm text-ink/80 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="text-xs eyebrow">{t.name}</div>
              </div>
            )}
          />
        </div>
      </section>
    </div>
  );
}