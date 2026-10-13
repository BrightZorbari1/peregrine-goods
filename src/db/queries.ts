import { and, desc, asc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, type Category, type Product } from "@/db/schema";

export type ProductWithCategory = Product & { category: Category | null };

export type ProductSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

const sortMap: Record<ProductSort, SQL[]> = {
  featured: [desc(products.featured), desc(products.rating)],
  newest: [desc(products.createdAt)],
  "price-asc": [asc(products.priceCents)],
  "price-desc": [desc(products.priceCents)],
  rating: [desc(products.rating), desc(products.reviewCount)],
};

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0];
}

export async function listProducts(opts: {
  categorySlug?: string;
  sort?: ProductSort;
  q?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  const sort = opts.sort ?? "featured";
  const conditions: SQL[] = [];

  if (opts.categorySlug) {
    conditions.push(eq(categories.slug, opts.categorySlug));
  }
  if (opts.featuredOnly) {
    conditions.push(eq(products.featured, true));
  }
  if (opts.q) {
    const term = `%${opts.q.trim()}%`;
    conditions.push(
      or(ilike(products.name, term), ilike(products.tagline, term))!
    );
  }

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...sortMap[sort], asc(products.name))
    .limit(opts.limit ?? 100);

  return rows.map((r) => ({ ...r.product, category: r.category }));
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | undefined> {
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  const row = rows[0];
  return row ? { ...row.product, category: row.category } : undefined;
}

export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  limit = 4
): Promise<ProductWithCategory[]> {
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.categoryId, categoryId))
    .orderBy(desc(products.rating), sql`random()`)
    .limit(limit + 1);

  return rows
    .map((r) => ({ ...r.product, category: r.category }))
    .filter((p) => p.id !== productId)
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  return listProducts({ featuredOnly: true, limit });
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      slug: categories.slug,
      count: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.slug);
  return Object.fromEntries(rows.map((r) => [r.slug, r.count]));
}
