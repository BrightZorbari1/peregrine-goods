import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, getRelatedProducts } from "@/db/queries";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    const related = await getRelatedProducts(product.id, product.categoryId, 4);
    return NextResponse.json({
      ok: true,
      product: {
        ...product,
        rating: Number(product.rating),
        category: product.category
          ? {
              slug: product.category.slug,
              name: product.category.name,
              tagline: product.category.tagline,
            }
          : null,
      },
      related: related.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents,
        badge: p.badge,
        colors: p.colors,
        image: p.image,
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        category: p.category ? { slug: p.category.slug, name: p.category.name } : null,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Failed to load product" }, { status: 500 });
  }
}
