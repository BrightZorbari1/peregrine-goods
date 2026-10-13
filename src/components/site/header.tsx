"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Shoes", href: "/collections/shoes" },
  { label: "Backpacks", href: "/collections/backpacks" },
  { label: "Lunch Boxes", href: "/collections/lunch-boxes" },
  { label: "Handbags", href: "/collections/handbags" },
  { label: "Travel Bags", href: "/collections/travel-bags" },
];

const TICKER = [
  "Free shipping on orders over $150",
  "Repaired for life — our guarantee",
  "Designed in Amsterdam · Est. 2019",
  "New drop: Tiffin Stack — Sage",
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const openDrawer = useCart((s) => s.openDrawer);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const count = mounted ? cartCount(items) : 0;

  return (
    <>
      {/* announcement ticker */}
      <div className="relative z-[60] overflow-hidden bg-ink text-bone">
        <div className="flex w-max animate-marquee whitespace-nowrap py-2">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {TICKER.concat(TICKER).map((t, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="mx-6 flex items-center gap-6 text-[10px] font-medium uppercase tracking-[0.22em]"
                >
                  {t}
                  <span className="inline-block h-1 w-1 rounded-full bg-clay" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line/80 bg-bone/85 backdrop-blur-md"
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 md:h-[72px]">
          {/* left: mobile burger + desktop nav */}
          <div className="flex flex-1 items-center gap-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-sand lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink",
                    pathname === n.href && "text-ink"
                  )}
                >
                  {n.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full",
                      pathname === n.href && "w-full"
                    )}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* center: wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-center leading-none"
            aria-label="Peregrine Goods Co. home"
          >
            <span className="font-display text-[22px] font-semibold tracking-[0.08em] md:text-2xl">
              PEREGRINE
              <span className="text-clay">.</span>
            </span>
            <span className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.42em] text-taupe">
              Goods Co.
            </span>
          </Link>

          {/* right: cart */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={openDrawer}
              className="group relative flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 transition hover:border-ink hover:bg-ink hover:text-bone"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.5} />
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block">
                Bag
              </span>
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold text-bone transition-transform",
                  count === 0 && "scale-75 opacity-60"
                )}
              >
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink text-bone"
          >
            <div className="shell flex h-16 items-center justify-between">
              <span className="font-display text-xl font-semibold">
                PEREGRINE<span className="text-clay">.</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-bone/25 transition hover:bg-bone hover:text-ink"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="shell mt-8 flex flex-col gap-1">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between border-b border-bone/10 py-4"
                  >
                    <span className="font-display text-4xl font-light italic transition group-hover:text-clay">
                      {n.label}
                    </span>
                    <ArrowUpRight className="h-6 w-6 text-bone/40 transition group-hover:text-clay" strokeWidth={1.5} />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="shell mt-auto pb-10 text-[11px] uppercase tracking-[0.25em] text-bone/50">
              Designed in Amsterdam — Est. 2019
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-[0.08em]", className)}>
      PEREGRINE<span className="text-clay">.</span>
    </span>
  );
}
