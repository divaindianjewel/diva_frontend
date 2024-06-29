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
      <div className="relative w-full">
        <div className="flex items-center justify-start mb-5 w-full overflow-x-auto no-scrollbar scroll-smooth px-10">
          {loading ? (
            <div className="flex gap-8">
              {product.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col space-y-3 card p-5 w-64 shadow-2xl mb-8"
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
            products.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="flex-shrink-0 w-64 mx-2"
              >
                <div className="card overflow-hidden flex flex-col items-center justify-center shadow-2xl mb-8">
                  <Image
                    className="rounded-md img w-full h-64 object-cover"
                    src={`${product.attributes.images.data[0].attributes.url}`}
                    alt={"img"}
                    width={256}
                    height={256}
                  />
                  <div className="w-full px-[1rem]">
                    <h3 className="text-lg font-semibold mt-3 truncate">
                      {product.attributes.name}
                    </h3>
                    <div className="price flex justify-between text-sm mt-2">
                      <div className="first-price text-lg font-medium">
                        ₹ {product.attributes.price}
                      </div>
                      <div className="second-price text-gray-500 line-through text-lg">
                        ₹ {product.attributes.compare_price}
                      </div>
                    </div>
                    <button
                      className="myBtn py-2 product mt-4 text-base w-full"
                      type="button"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
