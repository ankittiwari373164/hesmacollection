// Seed catalog data for Hesma Collection.
// Images use Unsplash source photos (placeholder product photography).

export const CATEGORIES = [
  { slug: "earrings", name: "Anti-Tarnish Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop" },
  { slug: "necklaces", name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop" },
  { slug: "bracelets-thin", name: "Thin Wrist / Baby Size Bracelets", img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop" },
  { slug: "rings", name: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop" },
  { slug: "bracelets", name: "Bracelets", img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop" },
  { slug: "watches", name: "Watches", img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop" },
  { slug: "chains", name: "The Chain Bracelets", img: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?q=80&w=800&auto=format&fit=crop" },
  { slug: "four-leaf", name: "Four Leaf", img: "https://images.unsplash.com/photo-1602751584547-6d1b0a5f9f9c?q=80&w=800&auto=format&fit=crop" },
  { slug: "gift-hampers", name: "Gift Hampers", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" },
  { slug: "mens", name: "Men's Collection", img: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?q=80&w=800&auto=format&fit=crop" },
];

const img = (seed) => `https://images.unsplash.com/${seed}?q=80&w=900&auto=format&fit=crop`;

let id = 1;
const nextId = () => String(id++);

function p(name, category, price, mrp, images, opts = {}) {
  return {
    id: nextId(),
    name,
    category,
    price,
    mrp,
    images,
    description:
      opts.description ||
      `${name} — handcrafted in anti-tarnish 18k gold plated brass, designed to be worn every day and gifted for a lifetime.`,
    tags: opts.tags || [],
    stock: opts.stock ?? 25,
    sku: `HES-${category.toUpperCase().slice(0, 3)}-${1000 + Number(id)}`,
    featured: !!opts.featured,
    newArrival: !!opts.newArrival,
    buy1get2: !!opts.buy1get2,
    rating: opts.rating ?? 4.7,
    reviews: opts.reviews ?? Math.floor(Math.random() * 180) + 12,
  };
}

export const PRODUCTS = [
  // Earrings
  p("Ivy Stud Earring", "earrings", 349, 899, [img("photo-1535632066927-ab7c9ab60908")], { buy1get2: true, featured: true }),
  p("Chloe Earring", "earrings", 379, 949, [img("photo-1599643478518-a784e5dc4c8f")], { buy1get2: true }),
  p("Yash Huggie Earring", "earrings", 449, 999, [img("photo-1584302179602-e4c3d3fd629d")], { buy1get2: true }),
  p("Leora White Stone Earring", "earrings", 449, 999, [img("photo-1587467512961-120760940315")], { buy1get2: true, newArrival: true }),
  p("Tara Earring", "earrings", 449, 1049, [img("photo-1611591437281-460bfbe1220a")]),
  p("Anaisha White Stone Earring", "earrings", 449, 1049, [img("photo-1626784215021-2e39ccf971cd")], { newArrival: true }),

  // Necklaces
  p("Katrina Necklace", "necklaces", 1299, 2499, [img("photo-1599643478518-a784e5dc4c8f")], { featured: true }),
  p("Isabella Necklace", "necklaces", 1299, 2499, [img("photo-1611652022419-a9419f74343d")]),
  p("Elisa Necklace", "necklaces", 1299, 2499, [img("photo-1573408301185-9146fe634ad0")]),
  p("Tiara Necklace", "necklaces", 1299, 2499, [img("photo-1620656798579-1984d9e87df7")]),

  // Baby / Thin Wrist bracelets
  p("Ursa Thin Wrist / Baby Size Bracelet", "bracelets-thin", 340, 640, [img("photo-1611652022419-a9419f74343d")], { newArrival: true }),
  p("Zara Thin Wrist / Baby Size Bracelet", "bracelets-thin", 340, 640, [img("photo-1573408301185-9146fe634ad0")], { newArrival: true }),
  p("Ariaan Thin Wrist / Baby Size Bracelet", "bracelets-thin", 340, 640, [img("photo-1620656798579-1984d9e87df7")]),
  p("Elyssa Thin Wrist / Baby Size Bracelet Stack", "bracelets-thin", 1049, 2049, [img("photo-1611591437281-460bfbe1220a")], { featured: true }),

  // Rings
  p("Aira Ring", "rings", 1449, 2599, [img("photo-1605100804763-247f67b3557e")]),
  p("Maria Ring - Adjustable", "rings", 1349, 2399, [img("photo-1603561596112-0a132b757442")]),
  p("Tull Ring", "rings", 1359, 2399, [img("photo-1603974372039-adc49044b6bd")]),
  p("Aileen Ring - Adjustable", "rings", 1359, 2399, [img("photo-1586104195951-8f358d9c4e28")]),

  // Bracelets
  p("Corinne Bracelet", "bracelets", 340, 649, [img("photo-1611652022419-a9419f74343d")]),
  p("Denise Bracelet", "bracelets", 340, 649, [img("photo-1573408301185-9146fe634ad0")]),
  p("Brigette Bracelet", "bracelets", 340, 649, [img("photo-1620656798579-1984d9e87df7")]),
  p("Aagya G Bracelet", "bracelets", 340, 649, [img("photo-1611591437281-460bfbe1220a")]),

  // Watches
  p("Ansel White Sun Watch", "watches", 1499, 3999, [img("photo-1524805444758-089113d48a6d")]),
  p("Ansel Black Dial Watch", "watches", 1499, 3999, [img("photo-1518131672697-613becd4fab5")]),
  p("Tara Rose Gold Watch", "watches", 1499, 3999, [img("photo-1548171915-e79a380a2a4b")]),
  p("Madelene Green Dial Watch", "watches", 1499, 3999, [img("photo-1533139502658-0198f920d8e8")]),

  // Chains
  p("Golden Fine Chain Bracelet", "chains", 449, 999, [img("photo-1620656798579-1984d9e87df7")], { newArrival: true }),

  // Four leaf
  p("Golden Four Leaf Clover Bracelet", "four-leaf", 340, 640, [img("photo-1602751584547-6d1b0a5f9f9c")]),
  p("Black Four Leaf Bracelet", "four-leaf", 340, 640, [img("photo-1611591437281-460bfbe1220a")]),
  p("White Four Leaf Clover Bracelet", "four-leaf", 340, 640, [img("photo-1573408301185-9146fe634ad0")]),
  p("The Sixty Bracelet - Gold", "four-leaf", 340, 640, [img("photo-1620656798579-1984d9e87df7")]),

  // Gift Hampers
  p("Everyday Necklace Gift Box", "gift-hampers", 2799, 3799, [img("photo-1549465220-1a8b9238cd48")]),
  p("Festive Jewellery Gift Box", "gift-hampers", 2799, 3799, [img("photo-1607083206968-13611e3d76db")]),
  p("Elegant Diamonds Gift Box", "gift-hampers", 2799, 3799, [img("photo-1608042314453-ae338d80c427")]),
  p("Rose Gold Layer Gift Box", "gift-hampers", 2799, 3799, [img("photo-1611591437281-460bfbe1220a")]),

  // Men's
  p("Gil Gold Twisted Chain For Men", "mens", 999, 1899, [img("photo-1618403088890-3d9ff6f4c8b1")]),
  p("Kai Gold Bracelet For Men", "mens", 899, 1699, [img("photo-1611591437281-460bfbe1220a")]),
  p("Silas Thick Chain For Men", "mens", 1099, 1999, [img("photo-1620656798579-1984d9e87df7")]),
  p("Silas Rope Chain For Men", "mens", 999, 1799, [img("photo-1573408301185-9146fe634ad0")]),
];

export const HERO_SLIDE = {
  eyebrow: "Send love, wear it forever",
  title: "Buy Any 4 Bracelets & Get a Tennis Bracelet + Jewellery Organiser Free",
  cta: "Shop the offer",
};

export const BUNDLES = [
  { label: "Any 8 Earrings at", price: "₹1749/-" },
  { label: "Any 3 Bracelets at", price: "₹999/-" },
  { label: "Any 20 Studs at", price: "₹1990/-" },
  { label: "Any 11 Rings at", price: "₹1999/-" },
];
