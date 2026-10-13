import { Leaf, PackageCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const VALUES = [
  {
    icon: PackageCheck,
    num: "01",
    title: "60-day home trial",
    copy: "Carry it, pack it, scuff it through two months of real life. Not in love? Send it back — we refurbish and re-home every return.",
  },
  {
    icon: Wrench,
    num: "02",
    title: "Repaired for life",
    copy: "Free repairs, forever, couriered both ways. Broken buckle or worn sole, our workshop brings it back — most goods return within a week.",
  },
  {
    icon: Leaf,
    num: "03",
    title: "Materials with receipts",
    copy: "LWG-gold leather, GRS recycled shells, FSC bamboo lids. Every material in every product is traceable to the tier-one mill.",
  },
];

export default function Values() {
  return (
    <section id="values" className="bg-ink py-20 text-bone md:py-28">
      <div className="shell">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
            <h2 className="font-display text-4xl font-light md:text-6xl">
              The Peregrine <span className="italic text-clay">promise</span>
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-bone/50">
              Three commitments stitched into everything that leaves our
              workshop.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/10 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.num} delay={0.1 * i} y={20}>
              <div className="group flex h-full flex-col bg-ink p-8 transition-colors duration-500 hover:bg-[#241d16] md:p-10">
                <div className="flex items-center justify-between">
                  <v.icon className="h-7 w-7 text-clay" strokeWidth={1.25} />
                  <span className="text-outline-bone font-display text-4xl font-bold">
                    {v.num}
                  </span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-light md:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-bone/60">{v.copy}</p>
                <span className="mt-8 block h-px w-full bg-bone/10 transition-colors duration-500 group-hover:bg-clay" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
