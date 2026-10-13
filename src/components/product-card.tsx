"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import Stars from "@/components/ui/stars";
import { useCart } from "@/store/cart";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type CardProduct = {
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  compareAtCents: number | null;
  badge: string | null;
  colors: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  category?: { slug: string; name: string } | null;
};

export default function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: CardProduct;
  priority?: boolean;
  className?: string;
}) {
  const add = useCart((s) => s.add);

  function quickAdd() {
    add({
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image,
      color: product.colors[0]?.name,
      size: product.sizes[0],
    });
  }

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-2xl bg-sand"
        aria-label={product.name}
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>

        {/* badge */}
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em]",
              product.badge === "Bestseller" && "bg-ink text-bone",
              product.badge === "New" && "bg-clay text-bone",
              product.badge === "Limited" && "bg-bone text-ink"
            )}
          >
            {product.badge}
          </span>
        )}

        {product.stock <= 8 && (
          <span className="absolute right-3 top-3 rounded-full bg-bone/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-clay-deep backdrop-blur">
            Only {product.stock} left
          </span>
        )}

        {/* quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              quickAdd();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-bone/95 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur transition hover:bg-ink hover:text-bone"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Quick add — {formatMoney(product.priceCents)}
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${product.slug}`}
              className="font-display text-lg leading-tight transition hover:text-clay"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-taupe">{product.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{formatMoney(product.priceCents)}</p>
            {product.compareAtCents && (
              <p className="text-xs text-taupe line-through">
                {formatMoney(product.compareAtCents)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.hex}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/15"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-taupe">
            <Stars rating={product.rating} size={11} />
            ({product.reviewCount})
          </span>
        </div>
      </div>
    </article>
  );
}
