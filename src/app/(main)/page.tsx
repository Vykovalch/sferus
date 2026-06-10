import { HeroSection } from "@/components/home/HeroSection"
import { HowItWorks } from "@/components/home/HowItWorks"
import { PopularServices } from "@/components/home/PopularServices"
import { TopListings } from "@/components/home/TopListings"
import { CtaSection } from "@/components/home/CtaSection"

export default async function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <PopularServices />
      <TopListings />
      <HowItWorks />
      {/* <ReviewsCarousel /> */}
      <CtaSection />
    </div>      
  )
}
