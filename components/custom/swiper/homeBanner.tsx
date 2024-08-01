"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../css/swiper.css";

// import required modules
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { domain } from "@/components/backend/apiRouth";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// const swiperProps = {
//   loop: true,
//   effect: "fade",
//   grabCursor: true,
//   autoplay: {
//     delay: 4000,
//   },
// };

interface BannerProps {
  id: number;
  attributes: {
    banner: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
    category: {
      data: {
        id: number;
      };
    };
    priority: number;
  };
}

const HomeBanner = () => {
  const [banner, setBanner] = useState<BannerProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${domain}/api/home-banners?populate=*`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        const sortedBanners = data.data.sort(
          (a: BannerProps, b: BannerProps) =>
            b.attributes.priority - a.attributes.priority
        );
        setBanner(sortedBanners);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return loading ? (
    <Skeleton className="h-[500px] lg:w-[1519px] skeleton-bg" />
  ) : (
    <>
      <Swiper
        effect="coverflow"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        loop={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        className="mySwiper custom-swiper "
      >
        {banner.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={`/category/${banner.attributes.category.data.id}`}>
              <Image
                src={`${banner.attributes.banner.data.attributes.url}`}
                alt={`Image ${index}`}
                width={3000}
                height={700}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default HomeBanner;
