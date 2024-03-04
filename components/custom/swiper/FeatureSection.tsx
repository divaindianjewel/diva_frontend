"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define an interface for the product data
export interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    compare_price: number;
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

const FeatureSection = () => {
  const [products, setProducts] = useState<Product[]>([]); // Define the type of products

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/products?populate=*"
        );
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white my-10 w-full shadow-2xl">
      <h2 className="text-left p-10 text-3xl font-medium">
        Best Selling Products
      </h2>
      <div className="flex items-center gap-28 justify-center overflow-x-scroll">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-col items-center justify-center mb-5 shadow-xl"
          >
            <div className="card p-5">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-80"
              >
                <CarouselContent>
                  {product.attributes.images.data.map((image) => (
                    <CarouselItem className="shadow-lg " key={image.id}>
                      <Image
                        className="rounded-md"
                        src={`http://localhost:1337${image.attributes.url}`}
                        alt={image.attributes.name}
                        width={600}
                        height={500}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <h3 className="text-2xl font-semibold mt-3">
              {product.attributes.name}
            </h3>
            <div className="price flex items-center justify-between px-20 text-xl mt-2">
              <div className="first-price font-medium">
                ₹ {product.attributes.price} /-
              </div>
              <div className="second-price text-gray-500 line-through">
                ₹ {product.attributes.compare_price} /-
              </div>
            </div>

            <Link href={`/products/${product.id}`}>
              <button className="myBtn mb-6" type="button">
                View Product
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
