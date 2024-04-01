import HomeBanner from "@/components/custom/swiper/homeBanner";
import MensFeatureSection from "@/components/custom/swiper/MensFeatureSection";
import WomensFeatureSection from "@/components/custom/swiper/WomensFeatureSection";
import FeaturesSection from "@/components/custom/swiper/FeatureSection";
import Categories from "@/components/custom/swiper/categoriesSection";
import TmpSection from "@/components/custom/swiper/tmp-section";

// Images
export default async function Home() {
  return (
    <main className="text-center">
      <HomeBanner />
      <FeaturesSection />
      <Categories />
      <MensFeatureSection />
      <WomensFeatureSection />
      {/* <TmpSection/> */}
    </main>
  );
}
