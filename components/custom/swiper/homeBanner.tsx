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
    hero_img: {
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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${domain}/api/hero-imgs?populate=*`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setBanner(data.data);

        console.log(data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
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
                src={`${domain}${banner.attributes.hero_img.data.attributes.url}`}
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
