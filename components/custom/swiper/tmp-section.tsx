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

interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    compare_price: number;
    feature: boolean;
    gender: string;
    images: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      }[];
    };
  };
}

const TmpSection = () => {
  const [products, setProducts] = useState<Product[]>([]); // Define the type of products

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${domain}/api/products?populate=*`);
        const data = await response.json();
        const filteredProducts = data.data.filter(
          (product: { attributes: { feature: any; gender: string } }) =>
            product.attributes.feature == true
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="lg:basis-1/4 md:basis-1/3 sm:basis-1/2 flex items-center justify-center "
              >
                <Link href={`/products/${product.id}`} key={index}>
                  <div
                    key={product.id}
                    className="flex-col w-[20rem] items-center justify-center mb-5 shadow-xl"
                  >
                    <div className="card p-3">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-80"
                      >
                        <CarouselContent className="flex items-center justify-center">
                          {product.attributes.images.data.map((image) => (
                            <CarouselItem
                              className="shadow-lg flex items-center justify-center"
                              key={image.id}
                            >
                              <Image
                                className="rounded-md"
                                src={`${image.attributes.url}`}
                                alt={image.attributes.name}
                                width={200}
                                height={150}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                    <h3 className="text-xl mx-auto font-semibold mt-3 w-[15rem] text-center">
                      {product.attributes.name}
                    </h3>
                    <div className="price flex items-center justify-between px-5 text-lg mt-2">
                      <div className="first-price font-medium">
                        ₹ {product.attributes.price} /-
                      </div>
                      <div className="second-price text-gray-500 line-through">
                        ₹ {product.attributes.compare_price} /-
                      </div>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <button className="myBtn product mb-6" type="button">
                        View Product
                      </button>
                    </Link>
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

export default TmpSection;
