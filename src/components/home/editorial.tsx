"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealLine } from "@/components/ui/reveal";

export default function Editorial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="story" className="shell grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
      {/* image with parallax */}
      <div ref={ref} className="relative order-2 lg:order-1">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
            <Image
              src="/img/lookbook.jpg"
              alt="Hands fastening the brass buckle of a leather weekender"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <div className="absolute -bottom-6 -right-4 rounded-2xl border border-line bg-parchment px-6 py-5 shadow-xl md:-right-8">
          <p className="font-display text-4xl font-semibold text-clay">03×</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-taupe">
            longer product life
            <br />
            than fast fashion
          </p>
        </div>
      </div>

      {/* copy */}
      <div className="order-1 lg:order-2">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            Our philosophy — 02 / keeponomics
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.05] md:text-6xl">
            Built to be <span className="italic text-clay">kept</span>,
            <br />
            not replaced.
          </h2>
        </Reveal>
        <RevealLine className="mt-8 h-px w-full bg-ink/20" />
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-soft md:text-lg">
            We design every shoe, pack and box backwards from a decade of daily
            abuse. Full-grain leather that scuffs into character. Zips rated to
            10,000 cycles. Seams you can resole, re-stitch and re-love —
            because the greenest product is the one you never throw away.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <blockquote className="mt-8 border-l-2 border-clay pl-5 font-display text-xl font-light italic leading-relaxed text-ink md:text-2xl">
            “If it can&apos;t be repaired in our Amsterdam workshop,
            it doesn&apos;t carry our name.”
          </blockquote>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
            <div>
              <p className="font-display text-3xl font-semibold">96%</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-taupe">
                components are repairable
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">1%</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-taupe">
                of revenue to rewilding
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-ink hover:text-bone"
          >
            Shop considered goods
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
