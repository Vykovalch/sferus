import type { Metadata } from "next";
import { CtaSection } from "@/components/home/CtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { TopListings } from "@/components/home/TopListings";

/**
 * Заголовок и описание главная берёт из корневого layout — они там и заданы
 * для неё. Здесь только канонический адрес: в layout его держать нельзя,
 * он наследуется всеми страницами сразу.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <PopularCategories />
      <TopListings />
      <HowItWorks />
      <CtaSection />
    </div>
  );
}
