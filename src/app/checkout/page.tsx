"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { cn, formatMoney, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from "@/lib/utils";

const COUNTRIES = [
  "Netherlands",
  "Germany",
  "France",
  "United Kingdom",
  "Spain",
  "Italy",
  "United States",
  "Canada",
  "Australia",
  "Japan",
];

type Placed = {
  orderNumber: string;
  summary: { subtotal: number; shipping: number; total: number; itemCount: number };
};

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    postal: "",
    country: "Netherlands",
  });

  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    if (placing || items.length === 0) return;
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            postal: form.postal,
            country: form.country,
          },
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            color: i.color,
            size: i.size,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not place the order. Please try again.");
        setPlacing(false);
        return;
      }
      setPlaced({ orderNumber: data.orderNumber, summary: data.summary });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please try again.");
      setPlacing(false);
    }
  }

  if (!mounted) {
    return <div className="shell min-h-[60vh] py-20" />;
  }

  // ── confirmation ─────────────────────────────────────────────
  if (placed) {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 14 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-olive/15"
        >
          <CheckCircle2 className="h-10 w-10 text-olive" strokeWidth={1.25} />
        </motion.div>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
            Order confirmed
          </p>
          <h1 className="mt-4 font-display text-5xl font-light md:text-7xl">
            Safe <span className="italic text-clay">travels.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Order <span className="font-mono font-semibold text-ink">{placed.orderNumber}</span>{" "}
            is packed and moving to our dispatch shelf. A confirmation is on its
            way to your inbox.
          </p>

          <dl className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 rounded-3xl border border-line bg-parchment p-6 text-left">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-taupe">Items</dt>
              <dd className="mt-1 font-display text-2xl">{placed.summary.itemCount}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-taupe">Shipping</dt>
              <dd className="mt-1 font-display text-2xl">
                {placed.summary.shipping === 0 ? "Free" : formatMoney(placed.summary.shipping)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-taupe">Total</dt>
              <dd className="mt-1 font-display text-2xl text-clay">
                {formatMoney(placed.summary.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-bone transition hover:bg-clay"
            >
              Keep shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition hover:border-ink"
            >
              Back home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── empty bag ────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-sand">
          <ShoppingBag className="h-6 w-6 text-ink-soft" strokeWidth={1.25} />
        </span>
        <h1 className="font-display text-4xl font-light italic">Your bag is empty.</h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Browse the goods and add something worth carrying before heading to
          checkout.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full bg-ink px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-bone transition hover:bg-clay"
        >
          Browse the goods
        </Link>
      </div>
    );
  }

  // ── checkout form ────────────────────────────────────────────
  return (
    <div className="shell pb-24 pt-10 md:pt-14">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-taupe transition hover:text-clay"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Continue shopping
      </Link>

      <h1 className="mt-4 font-display text-5xl font-light md:text-7xl">
        Check<span className="italic text-clay">out</span>
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        {/* form */}
        <form id="checkout-form" onSubmit={placeOrder} className="space-y-8 lg:order-1 lg:col-span-7">
          <Section num="01" title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email address" span2>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Full name" span2>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jamie Peregrine"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section num="02" title="Shipping address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street & number" span2>
                <input
                  type="text"
                  required
                  value={form.line1}
                  onChange={set("line1")}
                  placeholder="Herengracht 420"
                  className={inputCls}
                />
              </Field>
              <Field label="Apartment, suite (optional)" span2>
                <input
                  type="text"
                  value={form.line2}
                  onChange={set("line2")}
                  placeholder="Unit II"
                  className={inputCls}
                />
              </Field>
              <Field label="City">
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Amsterdam"
                  className={inputCls}
                />
              </Field>
              <Field label="Postal code">
                <input
                  type="text"
                  required
                  value={form.postal}
                  onChange={set("postal")}
                  placeholder="1017 BZ"
                  className={inputCls}
                />
              </Field>
              <Field label="Country" span2>
                <select value={form.country} onChange={set("country")} className={inputCls}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section num="03" title="Payment">
            <div className="flex items-start gap-4 rounded-2xl border border-dashed border-ink/25 bg-parchment p-5">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed text-ink-soft">
                This atelier runs in <span className="font-semibold text-ink">showroom mode</span> —
                no card is charged. Your order is recorded instantly and
                appears in our order book with full details.
              </p>
            </div>
          </Section>

          {error && (
            <p className="rounded-2xl border border-clay/40 bg-clay/10 px-5 py-4 text-sm font-medium text-clay-deep">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={placing}
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-ink py-5 text-[12px] font-bold uppercase tracking-[0.22em] text-bone transition hover:bg-clay disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                Placing order…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" strokeWidth={1.5} />
                Place order — {formatMoney(total)}
              </>
            )}
          </button>
        </form>

        {/* summary */}
        <aside className="lg:order-2 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-line bg-parchment p-6 md:p-8">
              <h2 className="flex items-center justify-between font-display text-2xl font-light">
                Order <span className="italic text-clay">summary</span>
                <span className="text-sm text-taupe">({items.reduce((s, i) => s + i.qty, 0)})</span>
              </h2>

              <ul className="mt-6 max-h-[340px] space-y-5 overflow-y-auto pr-1" data-lenis-prevent>
                {items.map((i) => (
                  <li key={`${i.slug}-${i.color}-${i.size}`} className="flex gap-4">
                    <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                      <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />
                      <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-bone">
                        {i.qty}
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="font-display text-base leading-tight">{i.name}</span>
                      <span className="mt-1 text-[11px] uppercase tracking-[0.12em] text-taupe">
                        {[i.color, i.size].filter(Boolean).join(" · ") || "Standard"}
                      </span>
                      <span className="mt-auto text-sm font-semibold">
                        {formatMoney(i.priceCents * i.qty)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-medium">{formatMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5 text-ink-soft">
                    <Truck className="h-3.5 w-3.5 text-clay" strokeWidth={1.5} /> Shipping
                  </dt>
                  <dd className={cn("font-medium", shipping === 0 && "text-olive")}>
                    {shipping === 0 ? "Free" : formatMoney(shipping)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display text-3xl">{formatMoney(total)}</dd>
                </div>
              </dl>

              <p className="mt-4 flex items-center gap-2 text-xs text-taupe">
                <PackageCheck className="h-4 w-4 text-olive" strokeWidth={1.5} />
                60-day home trial on every order
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-full border border-ink/15 bg-parchment px-5 py-3.5 text-sm transition placeholder:text-taupe focus:border-clay";

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-3">
        <span className="font-display text-sm italic text-clay">{num}</span>
        <span className="font-display text-2xl font-light">{title}</span>
        <span className="h-px flex-1 bg-line" />
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  children,
  span2,
}: {
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <label className={cn("block", span2 && "sm:col-span-2")}>
      <span className="mb-1.5 block pl-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
