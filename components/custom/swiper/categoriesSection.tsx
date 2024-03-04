"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface categories {
  id: number;
  attributes: {
    name: string;
    home_pic: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
    banner: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
  };
}

const Categories = () => {
  const [categories, setCategories] = useState<categories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/categories?populate=*"
        );
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, []);

  const width = 200;
  const height = 200;

  const categoriesImgClass = "rounded-full border-2 border-yellow-600 my-5";

  return (
    <div className="bg-white my-10 w-full shadow-2xl">
      <h2 className="text-left p-10 text-3xl font-medium">our Categories</h2>
      <div className="flex items-center justify-center mb-5 ">
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-screen px-10 "
        >
          <CarouselContent>
            {categories.map((item) => (
              <CarouselItem className="lg:basis-1/4 md:basis-1/3 sm:basis-1/2 flex items-center justify-center ">
                <Link href={`category/${item.id}`}>
                  <div>
                    <Image
                      src={`http://localhost:1337${item.attributes.home_pic.data.attributes.url}`}
                      alt="category"
                      width={width}
                      height={height}
                      className={categoriesImgClass}
                    />
                    <h2 className="text-2xl mb-10">{item.attributes.name}</h2>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;
