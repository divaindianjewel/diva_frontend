"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import FadingBanner from "../../../components/custom/Fade";
import { domain } from "../../../components/backend/apiRouth";
import { Product } from "../../../components/custom/swiper/WomensFeatureSection";
import Navbar from "../../../components/custom/navbar";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../../../components/ui/skeleton";

const Page = () => {
  const [query, setQuery] = useState<string>("");
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let currentPage = 1;
      let totalPages = 1;
      let fetchedProducts = [];

      while (currentPage <= totalPages) {
        const products = await fetchProducts(currentPage);
        fetchedProducts.push(...products.data);
        totalPages = products.meta.pagination.pageCount;
        currentPage++;
      }

      const productsArray = Object.values(fetchedProducts);
      setAllProducts(productsArray);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fetchProducts = async (page: number) => {
    const response = await fetch(
      `${domain}/api/products?populate=*&pagination[pageSize]=100&pagination[page]=${page}`
    );
    return response.json();
  };

  useEffect(() => {
    if (params && params.query) {
      const decodedQuery = decodeURIComponent(String(params.query));
      setQuery(decodedQuery);
    }
  }, [params]);

  useEffect(() => {
    if (query) {
      const filtered = allProducts.filter((product) =>
        product.attributes.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [query, allProducts]);

  const width = 500;
  const height = 450;
  return (
    <div>
      <FadingBanner />
      <Navbar />
      <div className="flex gap-3 justify-center flex-wrap px-5 mb-5 w-[100%] shadow-xl items-center mt-7 ">
        {loading ? (
          <>
            {
              <div className="flex flex-col items-center justify-center h-screen">
                <svg
                  className="animate-spin h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  {query} is Loading...
                </p>
              </div>
            }
          </>
        ) : (
          filteredProducts.map((items, index) => (
            <Link
              href={`/products/${items.id}`}
              key={items.id}
              className="w-[45%] md:w-[32%] lg:w-[23%]"
            >
              <div
                key={items.id}
                className="card overflow-x-hidden flex flex-col items-center justify-center shadow-2xl mb-8"
              >
                <Image
                  className="rounded-md img md:w-[20rem] w-[8rem]"
                  src={`${items.attributes.images.data[0].attributes.url}`}
                  alt={"img"}
                  width={width}
                  height={height}
                />

                <div className="w-full">
                  <h3 className="pl-2 text-sm md:text-lg lg:text-2xl font-semibold mt-3 w-[100%] md:w-[100%] lg:w-[100%] overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {items.attributes.name}
                  </h3>
                  <div className="price flex justify-between px-5 text-xs md:text-lg lg:text-xl mt-2">
                    <div className="first-price font-medium">
                      ₹ {items.attributes.price}
                    </div>
                    <div className="second-price text-gray-500 line-through">
                      ₹ {items.attributes.compare_price}
                    </div>
                  </div>

                  <Link
                    href={`/products/${items.id}`}
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

export default Page;
