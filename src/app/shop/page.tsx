import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/product-card";
import ShopControls from "@/components/shop/shop-controls";
import { getCategories, getCategoryCounts, listProducts } from "@/db/queries";
import { toCardProduct } from "@/lib/products";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all goods",
  description:
    "Browse the full Peregrine range — shoes, backpacks, lunch boxes, handbags and travel bags.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";
  const q = typeof sp.q === "string" ? sp.q : "";

  const [categories, counts, products] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    listProducts({
      categorySlug: category,
      sort: (["featured", "newest", "price-asc", "price-desc", "rating"].includes(sort)
        ? sort
        : "featured") as "featured",
      q: q || undefined,
    }),
  ]);

  const chipHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (sort !== "featured") params.set("sort", sort);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  const totalCount = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <div className="shell pb-24 pt-12 md:pt-16">
      {/* heading */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            Shop — every category
          </p>
          <h1 className="mt-3 font-display text-5xl font-light md:text-7xl">
            All <span className="italic text-clay">goods</span>
            <sup className="ml-3 align-super font-sans text-sm font-medium text-taupe md:text-base">
              ({q || category ? products.length : totalCount})
            </sup>
          </h1>
        </div>
        <ShopControls category={category} sort={sort} q={q} />
      </header>

      {/* category chips */}
      <nav className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-y border-line py-4">
        <Chip href={chipHref()} active={!category}>
          All ({totalCount})
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} href={chipHref(c.slug)} active={category === c.slug}>
            {c.name} ({counts[c.slug] ?? 0})
          </Chip>
        ))}
      </nav>

      {q && (
        <p className="mt-6 text-sm text-ink-soft">
          Results for <span className="font-semibold text-ink">“{q}”</span> —{" "}
          <Link href="/shop" className="text-clay underline underline-offset-4">
            clear search
          </Link>
        </p>
      )}

      {/* grid */}
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={toCardProduct(p)} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-sand">
            <SearchX className="h-6 w-6 text-ink-soft" strokeWidth={1.25} />
          </span>
          <p className="font-display text-2xl font-light italic">Nothing matches that search.</p>
          <Link
            href="/shop"
            className="rounded-full bg-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-bone transition hover:bg-clay"
          >
            View all goods
          </Link>
        </div>
      )}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition",
        active
          ? "border-ink bg-ink text-bone"
          : "border-ink/15 bg-parchment text-ink-soft hover:border-ink/50 hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}
