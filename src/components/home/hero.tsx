"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ghost type backdrop */}
      <span
        aria-hidden
        className="text-outline-faint pointer-events-none absolute -right-8 top-10 hidden select-none font-display text-[11rem] font-bold leading-none tracking-tight lg:block"
      >
        GOODS
      </span>

      <div className="shell grid items-center gap-12 pb-16 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-20">
        {/* copy */}
        <div className="relative z-10 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-clay"
          >
            <span className="h-px w-10 bg-clay" />
            Est. 2019 — Amsterdam · Everyday Carry Atelier
          </motion.p>

          <h1 className="mt-6 font-display text-[13.5vw] font-light leading-[0.95] tracking-[-0.02em] sm:text-7xl lg:text-[6.2rem]">
            {["Everything you", "carry,"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
                className="block italic text-clay"
              >
                considered.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg"
          >
            Shoes, packs, lunchware and travel goods — five categories, one
            obsession: objects that earn their place in your day and keep it
            for decades.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-bone transition hover:bg-clay"
            >
              Shop the goods
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <Link
              href="#collections"
              className="group inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-ink underline-offset-8 transition hover:text-clay hover:underline"
            >
              Explore collections
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" strokeWidth={1.5} />
            </Link>
          </motion.div>

          {/* stats */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-7"
          >
            {[
              { k: "05", v: "goods categories" },
              { k: "92k", v: "travellers equipped" },
              { k: "4.9/5", v: "across 3,100 reviews" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-3xl font-semibold md:text-4xl">{s.k}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.2em] text-taupe">
                  {s.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* image */}
        <div className="relative lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
            className="relative mx-auto max-w-md lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-t-[11rem] rounded-b-3xl border border-line/70 bg-sand shadow-[0_40px_80px_-40px_rgba(27,21,16,0.4)]">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/img/hero.jpg"
                  alt="Model carrying Peregrine pack, handbag and weekender with sneakers"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* spinning badge */}
            <div className="absolute -left-8 -top-8 hidden h-32 w-32 md:block lg:-left-12">
              <CircularBadge />
            </div>

            {/* floating product chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
              className="absolute -bottom-6 -left-4 md:-left-12"
            >
              <Link
                href="/product/tiffin-stack-sage"
                className="group flex items-center gap-3 rounded-2xl border border-line bg-parchment/95 p-3 pr-5 shadow-xl backdrop-blur transition hover:border-clay"
              >
                <span className="relative h-14 w-14 overflow-hidden rounded-xl">
                  <Image
                    src="/img/lunch-hero.jpg"
                    alt="Tiffin Stack — Sage"
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-clay">
                    <Sparkles className="h-3 w-3" strokeWidth={1.5} /> New drop
                  </span>
                  <span className="block font-display text-base leading-tight">
                    Tiffin Stack — Sage
                  </span>
                  <span className="text-xs text-taupe">$68 · ships free over $150</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CircularBadge() {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow text-ink">
        <defs>
          <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-current text-[8.5px] font-semibold uppercase tracking-[0.32em]">
          <textPath href="#circlePath">
            Peregrine Goods Co · Considered Carry ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-clay text-bone">
          <ArrowDown className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </span>
    </div>
  );
}
