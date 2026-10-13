"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatMoney, cn } from "@/lib/utils";

export default function Purchase({
  product,
}: {
  product: {
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    colors: { name: string; hex: string }[];
    sizes: string[];
    stock: number;
  };
}) {
  const add = useCart((s) => s.add);
  const router = useRouter();

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const color = product.colors[colorIdx]?.name;
  const out = product.stock === 0;

  function toCart(openCheckout: boolean) {
    if (out) return;
    add(
      {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.image,
        color,
        size,
      },
      qty
    );
    if (openCheckout) router.push("/checkout");
    else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  }

  return (
    <div className="mt-8 space-y-7">
      {/* colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Colour — <span className="font-normal normal-case tracking-normal text-taupe">{color}</span>
          </p>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.hex}
                onClick={() => setColorIdx(i)}
                title={c.name}
                aria-label={`Colour ${c.name}`}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition",
                  i === colorIdx
                    ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-bone"
                    : "border-ink/15 hover:border-ink/40"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* sizes */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Size
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition",
                  size === s
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/15 bg-parchment hover:border-ink/50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* qty + actions */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-ink/15">
          <button
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            className="grid h-full w-11 place-items-center transition hover:text-clay"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button
            onClick={() => setQty((v) => Math.min(10, v + 1))}
            className="grid h-full w-11 place-items-center transition hover:text-clay"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={() => toCart(false)}
          disabled={out}
          className={cn(
            "group flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition",
            added
              ? "bg-olive text-bone"
              : "bg-ink text-bone hover:bg-clay",
            out && "cursor-not-allowed opacity-40"
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2} /> Added to bag
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              Add to bag — {formatMoney(product.priceCents * qty)}
            </>
          )}
        </button>

        <button
          onClick={() => setWished((w) => !w)}
          aria-label="Save to wishlist"
          className={cn(
            "grid w-14 place-items-center rounded-full border transition",
            wished
              ? "border-clay bg-clay text-bone"
              : "border-ink/15 hover:border-ink/50"
          )}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-current")} strokeWidth={1.5} />
        </button>
      </div>

      <button
        onClick={() => toCart(true)}
        disabled={out}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-full border border-ink py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-sand",
          out && "cursor-not-allowed opacity-40"
        )}
      >
        <Zap className="h-4 w-4 text-clay" strokeWidth={1.5} />
        Buy it now
      </button>

      <p className="text-xs leading-relaxed text-taupe">
        Free shipping over $150 · 60-day home trial · lifetime repairs ·
        carbon-neutral delivery.
      </p>
    </div>
  );
}
