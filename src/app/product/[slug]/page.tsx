import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronDown, ChevronRight, Package, RotateCcw, Wrench } from "lucide-react";
import Gallery from "@/components/product/gallery";
import Purchase from "@/components/product/purchase";
import ProductCard from "@/components/product-card";
import Stars from "@/components/ui/stars";
import { getProductBySlug, getRelatedProducts } from "@/db/queries";
import { toCardProduct } from "@/lib/products";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);
  const rating = Number(product.rating);
  const gallery = [product.image, ...product.gallery];
  const savings = product.compareAtCents
    ? product.compareAtCents - product.priceCents
    : 0;

  return (
    <div className="pb-24">
      {/* breadcrumbs */}
      <nav className="shell flex items-center gap-1.5 pt-8 text-[11px] uppercase tracking-[0.18em] text-taupe">
        <Link href="/" className="transition hover:text-clay">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="transition hover:text-clay">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/collections/${product.category.slug}`}
              className="transition hover:text-clay"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="shell mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={gallery} name={product.name} badge={product.badge} />

        {/* info */}
        <div className="lg:py-4">
          {product.category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
              {product.category.eyebrow} — {product.category.name}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl font-light leading-tight md:text-6xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <Stars rating={rating} size={15} />
            <span className="text-sm text-ink-soft">
              {rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="font-display text-3xl md:text-4xl">
              {formatMoney(product.priceCents)}
            </p>
            {product.compareAtCents && (
              <>
                <p className="text-lg text-taupe line-through">
                  {formatMoney(product.compareAtCents)}
                </p>
                <span className="rounded-full bg-clay/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-clay-deep">
                  Save {formatMoney(savings)}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <Purchase
            product={{
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              image: product.image,
              colors: product.colors,
              sizes: product.sizes,
              stock: product.stock,
            }}
          />

          {/* accordions */}
          <div className="mt-10 divide-y divide-line border-y border-line">
            <Accordion title="Materials & details" defaultOpen>
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                    {d}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion
              title="Shipping & returns"
              icon={<Package className="h-4 w-4 text-clay" strokeWidth={1.5} />}
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                Orders ship within 24h from our Amsterdam warehouse, free
                worldwide over $150 (otherwise $12 flat). Every order carries a
                60-day home trial — return it used, we refurbish and re-home it.
              </p>
            </Accordion>
            <Accordion
              title="Lifetime repairs"
              icon={<Wrench className="h-4 w-4 text-clay" strokeWidth={1.5} />}
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                Buckles, soles, straps and seams — repaired free, forever,
                couriered both ways. Register your good with the number stamped
                inside to activate.
              </p>
            </Accordion>
            <Accordion
              title="Stock & delivery"
              icon={<RotateCcw className="h-4 w-4 text-clay" strokeWidth={1.5} />}
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                {product.stock <= 8
                  ? `Low stock — only ${product.stock} left in this run. Next restock lands in ~6 weeks.`
                  : `${product.stock} units ready to ship today. Typical delivery: 2–4 days EU, 4–8 days worldwide.`}
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="shell mt-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-light md:text-5xl">
              Complete the <span className="italic text-clay">carry</span>
            </h2>
            {product.category && (
              <Link
                href={`/collections/${product.category.slug}`}
                className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft transition hover:text-clay md:block"
              >
                More {product.category.name.toLowerCase()}
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={toCardProduct(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Accordion({
  title,
  icon,
  children,
  defaultOpen,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group py-1" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          {icon}
          {title}
        </span>
        <ChevronDown className="h-4 w-4 text-taupe transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <div className="pb-5 pl-0">{children}</div>
    </details>
  );
}
