import Hero from "@/components/home/hero";
import Marquee from "@/components/ui/marquee";
import CategoryIndex from "@/components/home/category-index";
import FeaturedRail from "@/components/home/featured-rail";
import Editorial from "@/components/home/editorial";
import Values from "@/components/home/values";
import CampaignCTA from "@/components/home/campaign-cta";
import Reviews from "@/components/home/reviews";
import {
  getCategories,
  getCategoryCounts,
  getFeaturedProducts,
} from "@/db/queries";
import { toCardProduct } from "@/lib/products";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, counts, featured] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
    getFeaturedProducts(8),
  ]);

  return (
    <>
      <Hero />
      <Marquee items={["Shoes", "Backpacks", "Lunch Boxes", "Handbags", "Travel Bags"]} />
      <CategoryIndex
        categories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          eyebrow: c.eyebrow,
          tagline: c.tagline,
          image: c.image,
          count: counts[c.slug] ?? 0,
        }))}
      />
      <FeaturedRail products={featured.map(toCardProduct)} />
      <Editorial />
      <Values />
      <CampaignCTA />
      <Reviews />
    </>
  );
}
