"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  color?: string;
  size?: string;
  qty: number;
};

export function itemKey(item: Pick<CartItem, "slug" | "color" | "size">) {
  return `${item.slug}__${item.color ?? ""}__${item.size ?? ""}`;
}

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      add: (item, qty = 1) =>
        set((state) => {
          const key = itemKey(item);
          const existing = state.items.find((i) => itemKey(i) === key);
          const items = existing
            ? state.items.map((i) =>
                itemKey(i) === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
              )
            : [...state.items, { ...item, qty }];
          return { items, drawerOpen: true };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => itemKey(i) !== key)
              : state.items.map((i) =>
                  itemKey(i) === key ? { ...i, qty: Math.min(qty, 10) } : i
                ),
        })),
      remove: (key) =>
        set((state) => ({ items: state.items.filter((i) => itemKey(i) !== key) })),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "peregrine-cart-v1",
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export const cartCount = (items: CartItem[]) => items.reduce((s, i) => s + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.qty * i.priceCents, 0);
