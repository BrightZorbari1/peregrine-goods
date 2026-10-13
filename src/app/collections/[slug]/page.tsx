import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import { getCategories, getCategoryBySlug, listProducts } from "@/db/queries";
import { toCardProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Collection not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, allCategories] = await Promise.all([
    listProducts({ categorySlug: slug, sort: "featured" }),
    getCategories(),
  ]);

  const others = allCategories.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <div className="pb-24">
      {/* banner */}
      <header className="shell grid items-end gap-8 pb-14 pt-12 md:grid-cols-2 md:pt-16 lg:gap-16">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            Collection — {category.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl font-light md:text-7xl">
            {category.name.split(" ")[0]}{" "}
            {category.name.split(" ").length > 1 && (
              <span className="italic text-clay">
                {category.name.split(" ").slice(1).join(" ")}
              </span>
            )}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            {category.description}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe">
            {products.length} goods in this collection
          </p>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-bone/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur">
            {category.tagline}
          </span>
        </div>
      </header>

      {/* grid */}
      <div className="shell grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={toCardProduct(p)} priority={i < 4} />
        ))}
      </div>

      {/* cross sell */}
      <div className="shell mt-24">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl font-light md:text-4xl">
            Keep <span className="italic text-clay">browsing</span>
          </h2>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft transition hover:text-clay"
          >
            All goods
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative flex h-28 items-end overflow-hidden rounded-2xl"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-ink/40 transition group-hover:bg-ink/55" />
              <span className="relative z-10 flex w-full items-center justify-between p-4 text-bone">
                <span className="font-display text-lg">{c.name}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
