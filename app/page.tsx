import HomeBanner from "@/components/custom/swiper/homeBanner";
import FeatureSection from "@/components/custom/swiper/FeatureSection";
import Categories from "@/components/custom/swiper/categoriesSection";
import { auth, currentUser } from "@clerk/nextjs";
import { User } from "lucide-react";
// Images

export default async function Home() {
  const { userId } = auth();

  console.log(userId);
  if (userId) {
  }

  const user = await currentUser();

  return (
    <main className="text-center">
      <HomeBanner />
      <FeatureSection />
      <Categories />
    </main>
  );
}


