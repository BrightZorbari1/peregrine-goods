import type { ProductWithCategory } from "@/db/queries";
import type { CardProduct } from "@/components/product-card";

export function toCardProduct(p: ProductWithCategory): CardProduct {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    badge: p.badge,
    colors: p.colors,
    sizes: p.sizes,
    image: p.image,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    stock: p.stock,
    category: p.category
      ? { slug: p.category.slug, name: p.category.name }
      : null,
  };
}
