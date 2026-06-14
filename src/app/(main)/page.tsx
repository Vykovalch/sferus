import { HeroSection } from "@/components/home/HeroSection"
import { HowItWorks } from "@/components/home/HowItWorks"
import { PopularCategories } from "@/components/home/PopularCategories"
import { TopListings } from "@/components/home/TopListings"
import { CtaSection } from "@/components/home/CtaSection"

export default async function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <PopularCategories />
      <TopListings />
      <HowItWorks />
      {/* <ReviewsCarousel /> */}
      <CtaSection />
    </div>      
  )
}
