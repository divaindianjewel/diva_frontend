"use client";
import React, { useState, useEffect } from "react";
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

// Assuming your interfaces are defined as before
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

interface CategoryId {
  params: {
    id: number;
  };
}

const Page: React.FC<CategoryId> = ({ params }) => {
  const categoryId = params.id;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryProduct, setCategoryProduct] = useState<Product[]>();

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
    };

    fetchData();
  }, [categoryId]); // Include categoryId in the dependency array

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

        <div className="container mt-8">
          <div className="flex gap-10 flex-wrap items-center justify-center mb-5 shadow-xl ">
            {categoryProduct?.map((items) => (
              <Link href={`/products/${items.id}`} key={items.id}>
                <div
                  key={items.id}
                  className="card p-5 max-w-96 px-5 flex-col items-center justify-center shadow-2xl mb-8"
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
                        <CarouselItem
                          key={imgs.id}
                          className="shadow-lg product-card"
                        >
                          <Image
                            className="rounded-md img"
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
                    <h3 className="text-2xl font-semibold mt-3">
                      {items.attributes.name}
                    </h3>
                    <div className="price flex items-center justify-between gap-10 text-xl mt-2">
                      <div className="first-price font-medium">
                        ₹ {items.attributes.price} /-
                      </div>
                      <div className="second-price text-gray-height line-through">
                        ₹ {items.attributes.compare_price} /-
                      </div>
                    </div>

                    <Link
                      href={`/products/${items.id}`}
                      className="flex items-center justify-center"
                    >
                      <button className="myBtn product mb-6" type="button">
                        View Product
                      </button>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
