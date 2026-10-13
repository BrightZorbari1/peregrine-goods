"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type IndexCategory = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  image: string;
  count: number;
};

export default function CategoryIndex({
  categories,
}: {
  categories: IndexCategory[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 24, mass: 0.6 });

  function onMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <section id="collections" ref={sectionRef} onMouseMove={onMove} className="shell relative py-20 md:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            The Collections — 01 to 05
          </p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-6xl">
            Pick your <span className="italic text-clay">carry</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft transition hover:text-clay"
        >
          Shop everything
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </Link>
      </div>

      {/* floating follower (desktop) */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="follower"
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 6 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative -ml-36 -mt-48 h-96 w-72 overflow-hidden rounded-3xl shadow-2xl"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={categories[active].slug}
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={categories[active].image}
                    alt={categories[active].name}
                    fill
                    sizes="288px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="border-t border-ink/15">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="group relative flex items-center gap-5 border-b border-ink/15 py-6 transition-colors md:gap-10 md:py-8"
          >
            {/* hover wash */}
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-sand/70 transition-transform duration-300 ease-out group-hover:scale-y-100" />

            <span className="relative z-10 w-10 shrink-0 font-display text-sm italic text-taupe md:text-base">
              /0{i + 1}
            </span>

            {/* mobile thumb */}
            <span className="relative z-10 block h-16 w-14 shrink-0 overflow-hidden rounded-xl lg:hidden">
              <Image src={c.image} alt={c.name} fill sizes="56px" className="object-cover" />
            </span>

            <span className="relative z-10 flex-1">
              <span className="block font-display text-3xl font-light transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl md:group-hover:translate-x-4 lg:text-6xl">
                {c.name}
              </span>
              <span className="mt-1 block text-xs text-taupe md:hidden">{c.tagline}</span>
            </span>

            <span className="relative z-10 hidden max-w-[220px] text-right text-xs leading-relaxed text-ink-soft md:block">
              {c.tagline}
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-taupe">
                {c.count} goods
              </span>
            </span>

            <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-bone">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.5} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
