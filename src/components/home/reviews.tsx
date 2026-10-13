import Stars from "@/components/ui/stars";
import { Reveal } from "@/components/ui/reveal";

const REVIEWS = [
  {
    quote:
      "The Voyager has survived forty-one flights, two motorbike drops and one very jealous airline baggage carousel. It looks better than the day it arrived.",
    name: "Mara Jensen",
    role: "Travel photographer · Oslo",
    bought: "Voyager Weekender 45L",
  },
  {
    quote:
      "I bought the Midday Bento as a joke about desk salads being boring. Six months later I plan my lunches like a small daily ceremony.",
    name: "Theo Okafor",
    role: "Architect · London",
    bought: "Midday Bento — Olive",
  },
  {
    quote:
      "One pair of Transit Courts replaced three pairs of sneakers I would have churned through. They re-soled them last month for free. Unheard of.",
    name: "Anaïs Laurent",
    role: "Café owner · Paris",
    bought: "Transit Court Sneaker",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="shell py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
              Field notes — 04 / reviews
            </p>
            <p className="mt-6 font-display text-7xl font-semibold md:text-8xl">4.9</p>
            <Stars rating={5} size={20} className="mt-2" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Average across 3,100+ verified reviews — every one from someone
              who carries our goods daily.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:col-span-8 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={0.1 * i}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-parchment p-7 transition-colors hover:border-clay/60">
                <span aria-hidden className="font-display text-5xl leading-none text-clay">
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-display text-lg font-light italic leading-relaxed">
                  {r.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-taupe">
                    {r.role}
                  </p>
                  <p className="mt-1.5 text-[11px] text-clay">Carries: {r.bought}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
