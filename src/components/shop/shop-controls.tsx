"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SORTS: { value: string; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "rating", label: "Top rated" },
];

export default function ShopControls({
  category,
  sort,
  q,
}: {
  category?: string;
  sort: string;
  q: string;
}) {
  const router = useRouter();
  const [term, setTerm] = useState(q);

  function push(next: { category?: string; sort?: string; q?: string }) {
    const params = new URLSearchParams();
    const cat = next.category ?? category;
    const srt = next.sort ?? sort;
    const query = next.q ?? q;
    if (cat) params.set("category", cat);
    if (srt && srt !== "featured") params.set("sort", srt);
    if (query) params.set("q", query);
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ""}`);
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    push({ q: term.trim() });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* search */}
      <form onSubmit={submitSearch} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" strokeWidth={1.5} />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search goods…"
          className={cn(
            "h-11 w-52 rounded-full border border-ink/15 bg-parchment pl-11 pr-4 text-sm transition",
            "placeholder:text-taupe focus:border-clay md:w-64"
          )}
          aria-label="Search products"
        />
      </form>

      {/* sort */}
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          className="h-11 appearance-none rounded-full border border-ink/15 bg-parchment pl-5 pr-10 text-sm font-medium transition focus:border-clay"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" strokeWidth={1.5} />
      </div>
    </div>
  );
}
