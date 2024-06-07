import HomeBanner from "@/components/custom/swiper/homeBanner";
import MensFeatureSection from "@/components/custom/swiper/MensFeatureSection";
import WomensFeatureSection from "@/components/custom/swiper/WomensFeatureSection";
import FeaturesSection from "@/components/custom/swiper/FeatureSection";
import Categories from "@/components/custom/swiper/categoriesSection";
import Navbar from "@/components/custom/navbar";
import FadingBanner from "@/components/custom/Fade";

export default async function Home() {
  return (
    <main className="text-center">
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <HomeBanner />
      <FeaturesSection />
      <Categories />
      <MensFeatureSection />
      <WomensFeatureSection />
    </main>
  );
}
