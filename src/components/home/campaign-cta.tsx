"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CampaignCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section ref={ref} className="relative h-[75vh] min-h-[540px] overflow-hidden md:h-[85vh]">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/img/campaign.jpg"
          alt="Flat lay of Peregrine goods — duffel, sneakers, bento, handbag and backpack"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />

      <div className="shell relative z-10 flex h-full flex-col items-start justify-end pb-16 text-bone md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] font-semibold uppercase tracking-[0.32em] text-bone/80"
        >
          FW26 Campaign — shot on medium format
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-4 max-w-3xl font-display text-5xl font-light leading-[1.02] md:text-7xl"
        >
          One shelf. Five objects.
          <span className="italic text-clay"> A considered life.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-clay hover:text-bone"
          >
            Shop the full edit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
          <Link
            href="/collections/travel-bags"
            className="inline-flex items-center gap-2 rounded-full border border-bone/40 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] backdrop-blur transition hover:border-bone hover:bg-bone/10"
          >
            Travel bags
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
