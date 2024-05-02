"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoriesButton from "@/components/custom/categoriesButton";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CategoryBanner from "@/components/custom/categoryBanner";
import { domain } from "@/components/backend/apiRouth";
import { useParams } from "next/navigation";
import { Skeleton } from "@mui/material";

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
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
  };
}

const Page = () => {
  const params = useParams();

  let categoryId = 0;

  if (params != null) {
    categoryId = Number(params.id);
  }

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProduct, setCategoryProduct] = useState<Product[]>();
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

      const tmp = productsArray.flat();

      const categoryProduct = tmp.filter(
        (i: Product) => i.attributes.category.data.id == categoryId
      );

      setCategoryProduct(categoryProduct);
      setLoading(false);
    };

    fetchData();
  }, [categoryId]);

  const fetchProducts = async (page: number) => {
    const response = await fetch(
      `${domain}/api/products?populate=*&pagination[pageSize]=100&pagination[page]=${page}`
    );
    return response.json();
  };

  const width = 500;
  const height = 450;

  return (
    <div>
      <div id="banner">
        <CategoryBanner categoryId={categoryId} />
        <CategoriesButton />
        <Separator />

        <div className="md:container mt-8 w-[100%]">
          <div className="flex gap-2 flex-wrap px-5 mb-5 shadow-xl items-center">
            {loading ? (
              <>
                {product.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-3 card p-5 max-w-96 px-5 shadow-2xl mb-8 flex-wrap"
                  >
                    <div>
                      <Skeleton className="h-[300px] w-[250px] rounded-xl skeleton-bg margin--3" />
                    </div>
                    <div className="mt-2rem items-start">
                      <Skeleton className="h-4 w-[200px] skeleton-bg margin--3" />
                      <Skeleton className="h-4 w-[180px] skeleton-bg " />
                      <Skeleton className="h-10 w-[200px] skeleton-bg m-auto mt-4" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              categoryProduct?.map((items) => (
                <Link href={`/products/${items.id}`} key={items.id}>
                  <div
                    key={items.id}
                    className="card md:w-[20rem] w-[9rem] flex-col items-center justify-center shadow-2xl mb-8"
                  >
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className="w-80"
                    >
                      <CarouselContent key={items.id}>
                        {items.attributes.images.data.map((imgs) => (
                          <CarouselItem key={imgs.id}>
                            <Image
                              className="rounded-md img md:w-[20rem] w-[8rem]"
                              src={`${imgs.attributes.url}`}
                              alt={"img"}
                              width={width}
                              height={height}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                    <div>
                      <h3 className="pl-2 text-sm md:text-lg lg:text-2xl font-semibold mt-3 w-[7rem] md:w-[18rem] lg:w-[18rem] overflow-hidden whitespace-nowrap overflow-ellipsis md:text-center">
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
                        className="flex items-center justify-center w-[100%]"
                      >
                        <button
                          className="myBtn product mb-6 text-sm"
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
      </div>
    </div>
  );
};

export default Page;
