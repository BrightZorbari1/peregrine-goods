import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { categories, products } from "./schema";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200`;

const C = {
  bone: { name: "Bone", hex: "#EFE7DB" },
  ink: { name: "Ink", hex: "#1C1713" },
  clay: { name: "Clay", hex: "#C05B2B" },
  olive: { name: "Olive", hex: "#6C7256" },
  tan: { name: "Tan", hex: "#B08A5E" },
  sage: { name: "Sage", hex: "#9BA58A" },
  noir: { name: "Noir", hex: "#23201C" },
  slate: { name: "Slate", hex: "#5B5E60" },
  sand: { name: "Sand", hex: "#D9CCB8" },
  teal: { name: "Teal", hex: "#4E6E6A" },
};

const SHOE_SIZES = ["EU 36", "EU 38", "EU 40", "EU 42", "EU 44", "EU 46"];

const categoryRows = [
  {
    slug: "shoes",
    name: "Shoes",
    eyebrow: "Footwear",
    tagline: "Everyday leather & knit footwear",
    description:
      "Full-grain leather courts and breathable knit runners — bench-made in Portugal, broken in by you.",
    image: px(10726876),
    sortOrder: 1,
  },
  {
    slug: "backpacks",
    name: "Backpacks",
    eyebrow: "Carry",
    tagline: "Packs engineered for the daily move",
    description:
      "Weatherproof canvas, full-grain trims and laptop-first interiors, balanced for two shoulders or one hand.",
    image: px(13693319),
    sortOrder: 2,
  },
  {
    slug: "lunch-boxes",
    name: "Lunch Boxes",
    eyebrow: "Tableware",
    tagline: "Insulated bento & steel tiffinware",
    description:
      "Vacuum-sealed, leak-proof lunch systems in sage and steel that make the meal as considered as the commute.",
    image: "/img/lunch-hero.jpg",
    sortOrder: 3,
  },
  {
    slug: "handbags",
    name: "Handbags",
    eyebrow: "Leather Goods",
    tagline: "Structured totes & soft satchels",
    description:
      "Vegetable-tanned silhouettes that hold a day's essentials and age into something entirely yours.",
    image: px(10919291),
    sortOrder: 4,
  },
  {
    slug: "travel-bags",
    name: "Travel Bags",
    eyebrow: "Journey",
    tagline: "Weekenders, rollers & trunks",
    description:
      "Carry-on sized, cabin-legal and built to be dragged through a hundred departures halls.",
    image: px(22744594),
    sortOrder: 5,
  },
] as const;

type CatSlug = (typeof categoryRows)[number]["slug"];

const productRows: Array<{
  slug: string;
  name: string;
  category: CatSlug;
  tagline: string;
  description: string;
  details: string[];
  priceCents: number;
  compareAtCents?: number;
  badge?: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  image: string;
  gallery?: string[];
  stock?: number;
  rating: string;
  reviewCount: number;
  featured?: boolean;
}> = [
  // ─── SHOES ────────────────────────────────────────────────────────────
  {
    slug: "transit-court-sneaker",
    name: "Transit Court",
    category: "shoes",
    tagline: "Full-grain leather court sneaker",
    description:
      "Our signature court profile cut from LWG-gold-rated full-grain leather, lined in soft recycled mesh and set on a natural rubber cupsole. Minimal branding, maximal mileage.",
    details: [
      "LWG gold-rated full-grain leather upper",
      "Natural rubber cupsole, stitched and glued",
      "Recycled mesh lining & cork-bed insole",
      "Handmade in Portugal",
    ],
    priceCents: 14800,
    compareAtCents: 17800,
    badge: "Bestseller",
    colors: [C.bone, C.ink, C.clay],
    sizes: SHOE_SIZES,
    image: px(10726876),
    gallery: [px(12628400), px(35865087)],
    rating: "4.9",
    reviewCount: 412,
    featured: true,
  },
  {
    slug: "reactive-runner-90",
    name: "Reactive Runner 90",
    category: "shoes",
    tagline: "Featherweight knit performance runner",
    description:
      "A sock-fit engineered knit upper over a nitrogen-infused midsole that returns energy with every stride — equally at home on treadmills and terminal sprints.",
    details: [
      "One-piece engineered knit upper",
      "Nitrogen-infused EVA midsole",
      "Weight: 228g (EU 42)",
      "Vegan materials throughout",
    ],
    priceCents: 16400,
    badge: "New",
    colors: [C.bone, C.clay, C.ink],
    sizes: SHOE_SIZES,
    image: px(28645957),
    gallery: [px(11559288), px(11324546)],
    rating: "4.7",
    reviewCount: 189,
    featured: true,
  },
  {
    slug: "field-knit-trainer",
    name: "Field Knit Trainer",
    category: "shoes",
    tagline: "Suede-trim everyday trainer",
    description:
      "Muted tones and mixed textures — a breathable knit body wrapped in soft suede overlays, tuned for twelve-hour days on your feet.",
    details: [
      "Engineered knit body with suede overlays",
      "OrthoLite comfort insole",
      "Grippy herringbone outsole",
      "Machine-washable laces included",
    ],
    priceCents: 13200,
    colors: [C.sand, C.ink, C.olive],
    sizes: SHOE_SIZES,
    image: px(18255344),
    gallery: [px(14214618)],
    rating: "4.6",
    reviewCount: 97,
  },
  {
    slug: "velocity-court-low",
    name: "Velocity Court Low",
    category: "shoes",
    tagline: "Colour-blocked retro court shoe",
    description:
      "A '90s court classic reissued with modern cushioning. Blue accents on a bone leather base — the loudest shoe we make, which is to say: not very.",
    details: [
      "Tumbled leather upper with suede heel tab",
      "Dual-density foam midsole",
      "Padded collar for all-day wear",
      "Two lace sets included",
    ],
    priceCents: 15600,
    colors: [C.bone, C.teal, C.ink],
    sizes: SHOE_SIZES,
    image: px(17931134),
    gallery: [px(14212621)],
    rating: "4.8",
    reviewCount: 154,
  },

  // ─── BACKPACKS ────────────────────────────────────────────────────────
  {
    slug: "atlas-daypack-22",
    name: "Atlas Daypack 22L",
    category: "backpacks",
    tagline: "Weatherproof everyday carry",
    description:
      "Twenty-two litres of thoughtfully divided space: padded 16-inch laptop bay, fleece-lined glasses pocket, hidden passport sleeve and a magnetic top that closes itself.",
    details: [
      "22L capacity · 16\" padded laptop sleeve",
      "Weatherproof 900D recycled shell",
      "Hidden passport & AirTag pockets",
      "Lifetime repair guarantee",
    ],
    priceCents: 12800,
    compareAtCents: 15800,
    badge: "Bestseller",
    colors: [C.slate, C.ink, C.clay],
    image: px(13693319),
    gallery: [px(13692714)],
    stock: 18,
    rating: "4.9",
    reviewCount: 356,
    featured: true,
  },
  {
    slug: "cargo-field-pack",
    name: "Cargo Field Pack",
    category: "backpacks",
    tagline: "Waxed canvas rucksack",
    description:
      "Heavy 18oz waxed canvas that scuffs beautifully, brass hardware that outlives zips, and a roll-top that swallows groceries, gym kits and overnight plans.",
    details: [
      "18oz waxed canvas, water-repellent",
      "Roll-top expands 18L → 24L",
      "Solid brass hardware",
      "Padded 15\" laptop compartment",
    ],
    priceCents: 14500,
    colors: [C.olive, C.tan, C.ink],
    image: px(13693103),
    gallery: [px(36958694)],
    rating: "4.8",
    reviewCount: 203,
  },
  {
    slug: "meridian-leather-pack",
    name: "Meridian Leather Pack",
    category: "backpacks",
    tagline: "Full-grain leather work pack",
    description:
      "The boardroom-proof backpack. Structured full-grain leather, suede-lined tech bays and a silhouette that stands upright on its own.",
    details: [
      "Full-grain aniline leather",
      "Suede-lined 16\" laptop bay",
      "Self-standing structured frame",
      "Cotton twill lining",
    ],
    priceCents: 28900,
    badge: "New",
    colors: [C.noir, C.tan],
    image: px(15246346),
    stock: 9,
    rating: "4.9",
    reviewCount: 64,
  },
  {
    slug: "porto-city-pack",
    name: "Porto City Pack",
    category: "backpacks",
    tagline: "Slim café-to-studio pack",
    description:
      "A slim 14-litre silhouette for the light packer: notebook, headphones, water bottle and a jumper — compressed into something you'll forget you're wearing.",
    details: [
      "14L capacity · 14\" laptop sleeve",
      " recycled nylon twill shell",
      "AirMesh back panel",
      "Internal key leash & bottle loop",
    ],
    priceCents: 11900,
    colors: [C.sand, C.olive, C.ink],
    image: px(14976127),
    stock: 22,
    rating: "4.6",
    reviewCount: 118,
  },

  // ─── LUNCH BOXES ──────────────────────────────────────────────────────
  {
    slug: "midday-bento-olive",
    name: "Midday Bento — Olive",
    category: "lunch-boxes",
    tagline: "Leak-proof insulated bento",
    description:
      "Two sealed tiers, a vacuum-insulated base that keeps lunch warm for six hours, and an olive shell that belongs on your desk, not hidden in a drawer.",
    details: [
      "Two-tier 1.2L capacity",
      "Vacuum-insulated base — warm 6h, cold 8h",
      "100% leak-proof silicone seals",
      "Dishwasher-safe (top rack)",
    ],
    priceCents: 5400,
    compareAtCents: 6800,
    badge: "Bestseller",
    colors: [C.olive, C.sand, C.clay],
    image: px(12861383),
    stock: 30,
    rating: "4.8",
    reviewCount: 521,
    featured: true,
  },
  {
    slug: "duo-bento-set",
    name: "Duo Bento Set",
    category: "lunch-boxes",
    tagline: "Two-box nesting lunch set",
    description:
      "A pair of nesting lunch boxes with a shared cutlery tray and elastic carry band. Pack the big one, pack both, or pack one inside the other on the way home.",
    details: [
      "950ml + 400ml nesting boxes",
      "Included cutlery tray & carry band",
      "BPA-free wheat-fibre composite",
      "Microwave-safe without lids",
    ],
    priceCents: 4200,
    colors: [C.clay, C.bone],
    image: px(5971976),
    stock: 40,
    rating: "4.7",
    reviewCount: 233,
  },
  {
    slug: "trio-prep-set-teal",
    name: "Trio Prep Set — Teal",
    category: "lunch-boxes",
    tagline: "Three-piece meal-prep containers",
    description:
      "Sunday-night meal prep, made beautiful. Three gradient-sized containers in a matte teal finish with snap-tight lids and measurement marks inside.",
    details: [
      "Set of three: 400 / 700 / 1,100ml",
      "Snap-tight leak-proof lids",
      "Internal measurement markings",
      "Freezer, microwave & dishwasher safe",
    ],
    priceCents: 3800,
    colors: [C.teal, C.sage],
    image: px(5972006),
    stock: 55,
    rating: "4.6",
    reviewCount: 174,
  },
  {
    slug: "tiffin-stack-sage",
    name: "Tiffin Stack — Sage",
    category: "lunch-boxes",
    tagline: "Steel tiffin with bamboo lid",
    description:
      "Our signature three-tier stainless tiffin with a bamboo board lid that doubles as a plate, cinched by a vegetable-tanned leather strap. Lunch, elevated.",
    details: [
      "Three-tier 18/8 stainless steel",
      "Bamboo lid doubles as serving board",
      "Veg-tan leather cinch strap",
      "Includes insulated carry sleeve",
    ],
    priceCents: 6800,
    badge: "New",
    colors: [C.sage, C.ink],
    image: "/img/lunch-hero.jpg",
    stock: 14,
    rating: "4.9",
    reviewCount: 89,
    featured: true,
  },

  // ─── HANDBAGS ─────────────────────────────────────────────────────────
  {
    slug: "structure-tote-tan",
    name: "Structure Tote — Tan",
    category: "handbags",
    tagline: "Architectural leather tote",
    description:
      "Clean geometry in vegetable-tanned leather that holds its shape — and your 13-inch laptop, novel and market flowers — without ever bulging.",
    details: [
      "Vegetable-tanned full-grain leather",
      "Interior fits 13\" laptop",
      "Magnetic top closure",
      "Unlined raw interior, debossed logo",
    ],
    priceCents: 24000,
    compareAtCents: 28000,
    badge: "Bestseller",
    colors: [C.tan, C.ink, C.clay],
    image: px(10919291),
    gallery: [px(26316185)],
    stock: 12,
    rating: "4.9",
    reviewCount: 268,
    featured: true,
  },
  {
    slug: "geo-satchel",
    name: "Geo Satchel",
    category: "handbags",
    tagline: "Sculptural flap satchel",
    description:
      "A study in proportion: structured body, softened corners, and a single magnetic flap that opens with one finger. Comes with a detachable crossbody strap.",
    details: [
      "Smooth Italian calfskin",
      "Detachable crossbody strap",
      "Suede lining, three compartments",
      "Protective metal feet",
    ],
    priceCents: 19800,
    colors: [C.noir, C.clay, C.tan],
    image: px(7953286),
    gallery: [px(7821329)],
    stock: 16,
    rating: "4.7",
    reviewCount: 142,
  },
  {
    slug: "atelier-tote-ivory",
    name: "Atelier Tote — Ivory",
    category: "handbags",
    tagline: "Soft-slouch studio tote",
    description:
      "Unstructured ivory leather that collapses into itself like a well-worn studio bag should. Wide shoulder straps, interior zip pocket, endless capacity.",
    details: [
      "Pebble-grain tumbled leather",
      "Reinforced wide shoulder straps",
      "Interior zip & slip pockets",
      "Cotton dust bag included",
    ],
    priceCents: 22400,
    colors: [C.bone, C.tan],
    image: px(5717972),
    gallery: [px(21897316)],
    stock: 11,
    rating: "4.8",
    reviewCount: 156,
  },
  {
    slug: "billie-crossbody",
    name: "Billie Crossbody",
    category: "handbags",
    tagline: "Compact rope-accent crossbody",
    description:
      "Phone, cardholder, keys, lip balm — exactly enough. A compact crossbody with a woven rope accent strap and a surprising amount of interior organisation.",
    details: [
      "Structured pebble leather",
      "Adjustable 55–125cm strap",
      "Six interior card slots",
      "Fits plus-size phones",
    ],
    priceCents: 17600,
    badge: "New",
    colors: [C.sand, C.clay, C.ink],
    image: px(19197736),
    gallery: [px(21897309)],
    stock: 20,
    rating: "4.8",
    reviewCount: 97,
    featured: true,
  },

  // ─── TRAVEL BAGS ──────────────────────────────────────────────────────
  {
    slug: "voyager-weekender-45",
    name: "Voyager Weekender 45L",
    category: "travel-bags",
    tagline: "Cabin-sized canvas duffel",
    description:
      "Exactly maximum cabin dimensions. Waxed canvas body, full-grain handles, a separate shoe garage underneath and a trolley strap that works.",
    details: [
      "45L · 55 × 35 × 23cm cabin-legal",
      "Separate ventilated shoe compartment",
      "Waxed canvas + full-grain leather",
      "Trolley sleeve & detachable strap",
    ],
    priceCents: 26800,
    compareAtCents: 31000,
    badge: "Bestseller",
    colors: [C.noir, C.olive, C.tan],
    image: px(14037876),
    gallery: [px(18561846), px(6211653)],
    stock: 10,
    rating: "4.9",
    reviewCount: 301,
    featured: true,
  },
  {
    slug: "overnight-roller-ink",
    name: "Overnight Roller — Ink",
    category: "travel-bags",
    tagline: "Hard-shell cabin roller",
    description:
      "A whisper-quiet polycarbonate shell on magnetic Japanese spinner wheels, with a compression system that squeezes a week's packing into cabin size.",
    details: [
      "38L expandable to 42L",
      "Hinomoto Lisof silent wheels",
      "TSA-approved integrated lock",
      "Aerospace-grade polycarbonate",
    ],
    priceCents: 31200,
    colors: [C.ink, C.sage, C.sand],
    image: px(22744594),
    gallery: [px(22744062)],
    stock: 8,
    rating: "4.8",
    reviewCount: 187,
    featured: true,
  },
  {
    slug: "heritage-trunk-set",
    name: "Heritage Trunk Set",
    category: "travel-bags",
    tagline: "Vintage-profile luggage duo",
    description:
      "Two pieces — cabin and check-in — with vegetable-tanned corner guards and buckle straps, built on modern spinner frames. Old souls, young bones.",
    details: [
      "Cabin 38L + check-in 75L duo",
      "Veg-tan leather corner guards",
      "Hinomoto spinner wheels",
      "10-year structural warranty",
    ],
    priceCents: 38800,
    badge: "Limited",
    colors: [C.tan, C.ink],
    image: px(11499403),
    stock: 5,
    rating: "4.9",
    reviewCount: 76,
  },
  {
    slug: "cabin-shell-bone",
    name: "Cabin Shell — Bone",
    category: "travel-bags",
    tagline: "Featherlight hard cabin case",
    description:
      "2.8 kilograms of matte bone polycarbonate with a grooved shell that shrugs off baggage handlers and a lining made from fourteen recycled bottles.",
    details: [
      "Weight: 2.8kg empty",
      "36L compression interior",
      "Recycled PET lining",
      "TSA lock + dual-spinner wheels",
    ],
    priceCents: 24600,
    colors: [C.bone, C.sage],
    image: px(7368309),
    gallery: [px(24024924)],
    stock: 15,
    rating: "4.7",
    reviewCount: 203,
  },
];

async function main() {
  console.log("Seeding Peregrine Goods Co. catalog…");

  await db.execute(sql`TRUNCATE TABLE order_items, orders, products, categories RESTART IDENTITY CASCADE`);

  const insertedCats = await db
    .insert(categories)
    .values(categoryRows.map((c) => ({ ...c })))
    .returning();

  const catId = Object.fromEntries(insertedCats.map((c) => [c.slug, c.id]));

  await db.insert(products).values(
    productRows.map((p) => ({
      slug: p.slug,
      name: p.name,
      categoryId: catId[p.category],
      tagline: p.tagline,
      description: p.description,
      details: p.details,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents ?? null,
      badge: p.badge ?? null,
      colors: p.colors,
      sizes: p.sizes ?? [],
      image: p.image,
      gallery: p.gallery ?? [],
      stock: p.stock ?? 25,
      rating: p.rating,
      reviewCount: p.reviewCount,
      featured: p.featured ?? false,
    }))
  );

  console.log(
    `Seeded ${insertedCats.length} categories and ${productRows.length} products.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
