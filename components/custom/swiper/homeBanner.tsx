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

const swiperProps = {
  loop: true,
  effect: "fade",
  grabCursor: true,
  autoplay: {
    delay: 4000,
  },
};
const HomeBanner = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${domain}/api/hero-imgs?populate=*`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        const urls = data.data.map(
          (item: any) =>
            item.attributes.hero_img.data.attributes.formats.large.url
        );
        setImageUrls(urls);
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
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} >
            <Image
              src={`${domain}${url}`}
              alt={`Image ${index}`}
              width={3000}
              height={700}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default HomeBanner;
