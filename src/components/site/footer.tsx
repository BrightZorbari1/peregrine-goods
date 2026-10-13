import Link from "next/link";
import { ArrowUpRight, Globe, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { getCategories } from "@/db/queries";
import NewsletterForm from "./newsletter-form";

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer className="bg-ink text-bone">
      {/* newsletter band */}
      <div className="shell grid gap-10 border-b border-bone/10 py-16 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-bone/50">
            The Carry Report
          </p>
          <h3 className="mt-3 font-display text-3xl font-light leading-tight md:text-5xl">
            First dibs on <span className="italic text-clay">drops</span>,
            <br />
            never spam.
          </h3>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <NewsletterForm dark />
          <p className="text-xs text-bone/40">
            One considered email a month. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* link columns */}
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="font-display text-3xl font-semibold tracking-wide">
            PEREGRINE<span className="text-clay">.</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">
            Premium shoes, packs and leather goods for people who move through
            the world with intent. Everything you carry, considered.
          </p>
          <div className="mt-6 grid max-w-sm grid-cols-2 gap-3 text-xs text-bone/60">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-clay" strokeWidth={1.5} /> Free ship over $150
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-clay" strokeWidth={1.5} /> 60-day returns
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-clay" strokeWidth={1.5} /> Lifetime repairs
            </span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-clay" strokeWidth={1.5} /> Ships worldwide
            </span>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-bone/50">Shop</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <FooterLink href="/shop">All Goods</FooterLink>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <FooterLink href={`/collections/${c.slug}`}>{c.name}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-bone/50">Atelier</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <FooterLink href="/#story">Our philosophy</FooterLink>
            </li>
            <li>
              <FooterLink href="/#values">Repairs & guarantee</FooterLink>
            </li>
            <li>
              <FooterLink href="/#reviews">Field notes</FooterLink>
            </li>
            <li>
              <FooterLink href="/checkout">Checkout</FooterLink>
            </li>
          </ul>
          <Link
            href="/shop"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-bone/25 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:border-clay hover:bg-clay"
          >
            Shop the full range
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="overflow-hidden border-t border-bone/10">
        <p
          aria-hidden
          className="text-outline-bone shell select-none pt-6 text-center font-display text-[18vw] font-bold leading-[0.8] tracking-tight md:text-[15vw]"
        >
          PEREGRINE
        </p>
      </div>

      <div className="shell flex flex-col items-center justify-between gap-3 border-t border-bone/10 py-6 text-[10px] uppercase tracking-[0.25em] text-bone/40 md:flex-row">
        <span>© {new Date().getFullYear()} Peregrine Goods Co.</span>
        <span>Herengracht 420, Amsterdam</span>
        <span>Made to be kept</span>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-bone/70 transition hover:text-clay"
    >
      {children}
    </Link>
  );
}
