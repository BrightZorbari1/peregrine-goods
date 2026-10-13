import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  dark = false,
  slow = true,
  className,
}: {
  items: string[];
  dark?: boolean;
  slow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y py-5",
        dark ? "border-bone/10 bg-ink text-bone" : "border-line/80 bg-clay text-bone",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max whitespace-nowrap",
          slow ? "animate-marquee-slow" : "animate-marquee"
        )}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={cn(
                    "font-display text-3xl font-light italic md:text-5xl",
                    dark && i % 2 === 0 && "text-outline-bone not-italic"
                  )}
                >
                  {item}
                </span>
                <Asterisk
                  className={cn(
                    "mx-6 h-6 w-6 md:mx-10 md:h-8 md:w-8",
                    dark ? "text-clay" : "text-ink"
                  )}
                  strokeWidth={1.25}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
