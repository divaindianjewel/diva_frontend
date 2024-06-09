import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Product } from "./MensFeatureSection";
import { domain } from "@/components/backend/apiRouth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SuggestionSwiper: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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

      setProducts(categoryProduct);
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

  return (
    <div>
      <div className="bg-white my-10 w-full shadow-2xl">
        <h2 className="text-left p-10 text-3xl font-medium">
          Similar Product Like This
        </h2>

        <div>
          <Carousel>
            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default SuggestionSwiper;
