import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const FREE_SHIPPING_THRESHOLD = 150_00;
export const FLAT_SHIPPING = 12_00;

export const BRAND = {
  name: "Peregrine Goods Co.",
  short: "PEREGRINE",
  tagline: "Everything you carry, considered.",
  city: "Amsterdam",
  est: 2019,
};
