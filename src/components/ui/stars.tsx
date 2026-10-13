import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stars({
  rating,
  className,
  size = 13,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating >= i + 1 - 0.25;
        return (
          <Star
            key={i}
            className={cn(filled ? "fill-clay text-clay" : "text-line")}
            style={{ width: size, height: size }}
            strokeWidth={1.5}
          />
        );
      })}
    </span>
  );
}
