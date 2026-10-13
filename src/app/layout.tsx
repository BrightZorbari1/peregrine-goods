import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import CartDrawer from "@/components/site/cart-drawer";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: {
    default: "Peregrine Goods Co. — Everything you carry, considered.",
    template: "%s · Peregrine Goods Co.",
  },
  description:
    "Premium shoes, backpacks, lunch boxes, handbags and travel bags — everyday carry goods designed in Amsterdam, built to be repaired, not replaced.",
};

export const viewport: Viewport = {
  themeColor: "#f1ebdf",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body className="bg-bone text-ink font-sans antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          {/* film grain veil */}
          <div
            aria-hidden
            className="grain-overlay pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-multiply"
          />
        </Providers>
      </body>
    </html>
  );
}
