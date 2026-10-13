import { NextRequest, NextResponse } from "next/server";
import { listProducts, type ProductSort } from "@/db/queries";

const SORTS = ["featured", "newest", "price-asc", "price-desc", "rating"] as const;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const sort = (SORTS as readonly string[]).includes(sp.get("sort") ?? "")
    ? (sp.get("sort") as ProductSort)
    : "featured";

  try {
    const rows = await listProducts({
      categorySlug: sp.get("category") || undefined,
      sort,
      q: sp.get("q") || undefined,
      limit: Math.min(Number(sp.get("limit")) || 100, 100),
    });

    return NextResponse.json({
      ok: true,
      count: rows.length,
      products: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents,
        badge: p.badge,
        colors: p.colors,
        sizes: p.sizes,
        image: p.image,
        stock: p.stock,
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        featured: p.featured,
        category: p.category
          ? { slug: p.category.slug, name: p.category.name }
          : null,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Failed to load products" }, { status: 500 });
  }
}
