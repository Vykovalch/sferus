import type { Metadata } from "next";
import { headers } from "next/headers";
import { CtaSection } from "@/components/home/CtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PopularCategories } from "@/components/home/PopularCategories";
import { TopListings } from "@/components/home/TopListings";
import { auth } from "@/lib/auth";

/**
 * Заголовок и описание главная берёт из корневого layout — они там и заданы
 * для неё. Здесь только канонический адрес: в layout его держать нельзя,
 * он наследуется всеми страницами сразу.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Нужна только для CtaSection — знать, залогинен ли человек, чтобы вести
  // его сразу на /services/new, а не на /register, где middleware и так
  // отправит его обратно на эту же страницу (см. authRoutes в middleware.ts).
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="">
      <HeroSection />
      <PopularCategories />
      <TopListings />
      <HowItWorks />
      <CtaSection isAuthenticated={!!session} />
    </div>
  );
}
