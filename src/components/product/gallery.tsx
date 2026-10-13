"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Gallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge: string | null;
}) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={images[index]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {badge && (
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]",
              badge === "Bestseller" && "bg-ink text-bone",
              badge === "New" && "bg-clay text-bone",
              badge === "Limited" && "bg-bone text-ink"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl ring-2 transition",
                i === index ? "ring-clay" : "ring-transparent hover:ring-line"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
