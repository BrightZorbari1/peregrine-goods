"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard, { type CardProduct } from "@/components/product-card";

export default function FeaturedRail({ products }: { products: CardProduct[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    railRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <section className="py-6 md:py-10">
      <div className="shell mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            Most carried
          </p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-6xl">
            The <span className="italic text-clay">icons</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition hover:border-ink hover:bg-ink hover:text-bone"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition hover:border-ink hover:bg-ink hover:text-bone"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 md:px-10"
      >
        {products.map((p, i) => (
          <div key={p.slug} className="w-[248px] shrink-0 snap-start md:w-[300px]">
            <ProductCard product={p} priority={i < 3} />
          </div>
        ))}
        {/* trailing CTA card */}
        <Link
          href="/shop"
          className="group relative flex w-[248px] shrink-0 snap-start flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-ink text-bone md:w-[300px]"
        >
          <span className="text-outline-bone font-display text-7xl font-bold">20+</span>
          <span className="px-8 text-center font-display text-2xl font-light italic">
            goods waiting to be carried
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition group-hover:border-clay group-hover:bg-clay">
            View all goods
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </span>
        </Link>
      </div>
    </section>
  );
}
