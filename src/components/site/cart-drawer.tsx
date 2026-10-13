"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart, cartSubtotal, itemKey } from "@/store/cart";
import { formatMoney, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { startLenis, stopLenis } from "@/components/providers";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (drawerOpen) stopLenis();
    else startLenis();
  }, [drawerOpen]);

  const subtotal = cartSubtotal(items);
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
  const away = FREE_SHIPPING_THRESHOLD - subtotal;

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[85]">
          <motion.button
            aria-label="Close bag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full bg-ink/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-parchment shadow-2xl"
          >
            {/* head */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-2xl font-light">
                Your <span className="italic text-clay">bag</span>
                <span className="ml-2 text-sm text-taupe">
                  ({items.reduce((s, i) => s + i.qty, 0)})
                </span>
              </h2>
              <button
                onClick={closeDrawer}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-bone"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-sand">
                  <ShoppingBag className="h-6 w-6 text-ink-soft" strokeWidth={1.25} />
                </span>
                <p className="font-display text-xl font-light italic text-ink-soft">
                  Nothing carried yet.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push("/shop");
                  }}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone transition hover:bg-clay"
                >
                  Browse the goods <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <>
                {/* free shipping meter */}
                <div className="border-b border-line px-6 py-4">
                  <p className="text-xs text-ink-soft">
                    {away > 0 ? (
                      <>
                        <span className="font-semibold text-clay">{formatMoney(away)}</span>{" "}
                        away from free shipping
                      </>
                    ) : (
                      <span className="font-semibold text-olive">
                        Free shipping unlocked
                      </span>
                    )}
                  </p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                    <motion.div
                      className="h-full rounded-full bg-clay"
                      initial={false}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ type: "spring", damping: 25 }}
                    />
                  </div>
                </div>

                {/* items */}
                <ul data-lenis-prevent className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {items.map((item) => {
                    const key = itemKey(item);
                    return (
                      <motion.li
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-4 py-5"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeDrawer}
                                className="font-display text-base leading-tight hover:text-clay"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-taupe">
                                {[item.color, item.size].filter(Boolean).join(" · ") || "Standard"}
                              </p>
                            </div>
                            <p className="text-sm font-semibold">
                              {formatMoney(item.priceCents * item.qty)}
                            </p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                onClick={() => setQty(key, item.qty - 1)}
                                className="grid h-8 w-8 place-items-center transition hover:text-clay"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(key, item.qty + 1)}
                                className="grid h-8 w-8 place-items-center transition hover:text-clay"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(key)}
                              className="text-[11px] uppercase tracking-[0.15em] text-taupe underline-offset-2 transition hover:text-clay hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* foot */}
                <div className="border-t border-line bg-bone px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="font-display text-2xl">{formatMoney(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-taupe">
                    Shipping calculated at checkout · 60-day returns
                  </p>
                  <button
                    onClick={() => {
                      closeDrawer();
                      router.push("/checkout");
                    }}
                    className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-bone transition hover:bg-clay"
                  >
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
