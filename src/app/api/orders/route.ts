import { NextRequest, NextResponse } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

type IncomingItem = { slug?: unknown; qty?: unknown; color?: unknown; size?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `PRG-${stamp}${rand}`;
}

export async function POST(req: NextRequest) {
  let body: {
    email?: unknown;
    name?: unknown;
    address?: Record<string, unknown>;
    items?: IncomingItem[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const a = body.address ?? {};
  const address = {
    line1: typeof a.line1 === "string" ? a.line1.trim() : "",
    line2: typeof a.line2 === "string" ? a.line2.trim() : "",
    city: typeof a.city === "string" ? a.city.trim() : "",
    postal: typeof a.postal === "string" ? a.postal.trim() : "",
    country: typeof a.country === "string" ? a.country.trim() : "",
  };

  if (!EMAIL_RE.test(email))
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  if (name.length < 2)
    return NextResponse.json({ ok: false, error: "Full name is required" }, { status: 400 });
  if (!address.line1 || !address.city || !address.postal || !address.country)
    return NextResponse.json({ ok: false, error: "Complete shipping address is required" }, { status: 400 });

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0 || items.length > 20)
    return NextResponse.json({ ok: false, error: "Your bag is empty" }, { status: 400 });

  const parsed = items.map((it) => ({
    slug: typeof it.slug === "string" ? it.slug : "",
    qty: typeof it.qty === "number" && Number.isInteger(it.qty) ? it.qty : NaN,
    color: typeof it.color === "string" ? it.color : undefined,
    size: typeof it.size === "string" ? it.size : undefined,
  }));
  if (parsed.some((p) => !p.slug || !Number.isInteger(p.qty) || p.qty < 1 || p.qty > 10))
    return NextResponse.json({ ok: false, error: "Invalid items in bag" }, { status: 400 });

  // merge duplicate slugs
  const merged: { slug: string; qty: number; color?: string; size?: string }[] = [];
  for (const p of parsed) {
    const existing = merged.find((m) => m.slug === p.slug && m.color === p.color && m.size === p.size);
    if (existing) existing.qty = Math.min(existing.qty + p.qty, 10);
    else merged.push(p);
  }

  try {
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.slug, merged.map((m) => m.slug)));

    if (dbProducts.length !== new Set(merged.map((m) => m.slug)).size) {
      return NextResponse.json({ ok: false, error: "Some items are no longer available" }, { status: 400 });
    }

    const bySlug = new Map(dbProducts.map((p) => [p.slug, p]));
    const lines = merged.map((m) => {
      const p = bySlug.get(m.slug)!;
      return { ...m, product: p, lineTotal: p.priceCents * m.qty };
    });

    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const total = subtotal + shipping;

    const result = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: orderNumber(),
          email,
          name,
          address,
          subtotalCents: subtotal,
          shippingCents: shipping,
          totalCents: total,
          status: "placed",
        })
        .returning({ id: orders.id, orderNumber: orders.orderNumber });

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: order.id,
          productId: l.product.id,
          name: l.product.name,
          image: l.product.image,
          priceCents: l.product.priceCents,
          qty: l.qty,
          color: l.color ?? null,
          size: l.size ?? null,
        }))
      );

      for (const l of lines) {
        await tx
          .update(products)
          .set({ stock: sql`GREATEST(${products.stock} - ${l.qty}, 0)` })
          .where(eq(products.id, l.product.id));
      }

      return order;
    });

    return NextResponse.json(
      {
        ok: true,
        orderNumber: result.orderNumber,
        summary: {
          subtotal,
          shipping,
          total,
          itemCount: lines.reduce((s, l) => s + l.qty, 0),
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Could not place order" }, { status: 500 });
  }
}
