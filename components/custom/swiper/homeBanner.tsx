"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import { domain } from "@/components/backend/apiRouth";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const swiperProps = {
  loop: true,
  effect: "fade",
  grabCursor: true,
  autoplay: {
    delay: 4000,
  },
};

interface bannerProps {
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
  };
}

const HomeBanner = () => {
  const [banner, setBanner] = useState<bannerProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${domain}/api/home-banners?populate=*`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setBanner(data.data);
        setLoading(false);
        console.log(data.data);
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
        {...swiperProps}
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {banner.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={`/category/${banner.attributes.category.data.id}`}>
              <Image
                src={`https://diva-images.blr1.digitaloceanspaces.com/4c7ffa2a3089c833182d160b38dcd0c3.jpg`}
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
