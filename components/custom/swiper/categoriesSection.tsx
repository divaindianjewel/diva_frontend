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
import { domain } from "@/components/backend/apiRouth";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [product, setProduct] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${domain}/api/categories?populate=*`);
        const data = await response.json();
        setCategories(data.data);
        setLoading(false);
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
            {loading ? (
              <div className="flex gap-8 my-5">
                {product.map((item, index) => (
                  <Skeleton
                    key={index}
                    className="h-[200px] w-[200px] rounded-full skeleton-bg"
                  />
                ))}
              </div>
            ) : (
              categories.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-1/4 flex items-center justify-center "
                >
                  <Link href={`category/${item.id}`}>
                    <div className="flex items-center justify-center flex-col">
                      <Image
                        src={`${item.attributes.home_pic.data.attributes.url}`}
                        alt="category"
                        width={width}
                        height={height}
                        className={categoriesImgClass}
                      />
                      <h2 className="text-2xl mb-10 w-[7.5rem] md:w-[13rem] lg:w-[18rem] overflow-hidden whitespace-nowrap overflow-ellipsis">{item.attributes.name}</h2>
                    </div>
                  </Link>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;
