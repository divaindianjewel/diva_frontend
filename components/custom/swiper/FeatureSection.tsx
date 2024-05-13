"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { domain } from "@/components/backend/apiRouth";
import { Skeleton } from "@/components/ui/skeleton";

// Define an interface for the product data
export interface Product {
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

const FeatureSection = () => {
  const [products, setProducts] = useState<Product[]>([]); // Define the type of products
  const [loading, setLoading] = useState<boolean>(true);
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
  const height = 450;
  const width = 500;

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white my-10 w-full shadow-2xl">
      <h2 className="text-left p-10 text-3xl font-medium">
        Best Selling Jewels
      </h2>
      <div className="flex items-center justify-center mb-5 w-[99vw] overflow-x-scroll no-scrollbar">
        {loading ? (
          <div className="flex gap-8">
            {product.map((item, index) => (
              <div
                key={index}
                className="flex flex-col space-y-3 card p-5 max-w-96 px-5 shadow-2xl mb-8 flex-wrap"
              >
                <div>
                  <Skeleton className="h-[250px] w-[250px] rounded-xl skeleton-bg" />
                </div>
                <div className="mt-2rem items-start">
                  <Skeleton className="h-4 w-[200px] skeleton-bg mb-3" />
                  <Skeleton className="h-4 w-[180px] skeleton-bg " />
                  <Skeleton className="h-7 w-[200px] skeleton-bg m-auto mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          products.map((product, index) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="w-[45%] md:w-[32%] lg:w-[23%]"
            >
              <div
                key={product.id}
                className="card overflow-x-hidden flex flex-col items-center justify-center shadow-2xl mb-8"
              >
                <Image
                  className="rounded-md img md:w-[20rem] w-[8rem]"
                  src={`${product.attributes.images.data[0].attributes.url}`}
                  alt={"img"}
                  width={width}
                  height={height}
                />

                <div className="w-full">
                  <h3 className="pl-2 text-sm md:text-lg lg:text-2xl font-semibold mt-3 w-[100%] md:w-[100%] lg:w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {product.attributes.name}
                  </h3>
                  <div className="price flex justify-between px-5 text-xs md:text-lg lg:text-xl mt-2">
                    <div className="first-price font-medium">
                      ₹ {product.attributes.price}
                    </div>
                    <div className="second-price text-gray-500 line-through">
                      ₹ {product.attributes.compare_price}
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center justify-center"
                  >
                    <button
                      className="myBtn py-2 product mb-6 text-xs md:text-lg lg:text-xl w-full"
                      type="button"
                    >
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default FeatureSection;
