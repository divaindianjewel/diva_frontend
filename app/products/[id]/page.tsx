"use client";
import React, { useState, useEffect, Children } from "react";
import { IoIosStar } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import CustomerReviews from "@/components/custom/reviews/reviewBox";
import { addToCart } from "@/backend/add-to-cart";
import { useAuth, useUser } from "@clerk/nextjs";
import { domain } from "@/components/backend/apiRouth";
import YTvideo from "@/components/custom/yt-video";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

interface ProductData {
  id: number;
  attributes: {
    name: string;
    price: number;
    compare_price: number;
    description: BlocksContent;
    youtube_link: string;
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

interface ApiResponse {
  data: ProductData;
}

interface ParamsProps {
  params: {
    id: number;
  };
}

const Page: React.FC<ParamsProps> = ({ params }) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId } = useAuth();
  const { isSignedIn } = useUser();
  const width = 500;
  const height = 500;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${domain}/api/products/${params.id}?populate=*`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data: ApiResponse = await response.json();
        setProduct(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  const handelDescription = (content: BlocksContent) => {
    console.log(content);
    return <BlocksRenderer content={content}  />;
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="w-fit gap-12 mx-auto flex flex-col lg:flex-row  items-center justify-center">
            <div id="images">
              <div>
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
                  className="lg:w-[30rem] md:w-[30rem] sm:w-[70vw]"
                >
                  <CarouselContent>
                    {product.attributes.images.data.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          className="rounded-md"
                          src={`${image.attributes.url}`}
                          alt={`Image ${index + 1}`}
                          width={width}
                          height={height}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext className="sm:hidden md:flex" />
                </Carousel>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Diva The Indian Jewel
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.attributes.name}
                <div className="flex gap-2 items-center ">
                  <div className="ratting mt-2 flex items-center px-3 py-1 bg-yellow-100 w-fit text-lg">
                    <span className=" mr-1">5</span>{" "}
                    <IoIosStar size={20} color="gold" className="" />
                  </div>
                  <span className="text-lg text-gray-500">(30 reviews)</span>
                </div>
              </h1>
              <div className="flex mb-4 my-3">
                
                { product.attributes.description ?  handelDescription(product.attributes.description) : "No Description"}
              </div>

              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex"></div>
                <div className="flex ml-6 items-center"></div>
              </div>
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900 mr-1">
                  ₹{product.attributes.price}
                  <span className="text-gray-600 text-sm">
                    MRP{" "}
                    <span className="line-through">
                      ₹{product.attributes.compare_price}
                    </span>{" "}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-3 mt-3">
                <button
                  className="rounded-md text-xl font-semibold gold-color text-black py-2 flex items-center justify-center gap-3  w-[22rem]"
                  type="button"
                  onClick={() => {
                    addToCart(
                      params.id,
                      userId,
                      isSignedIn,
                      product.attributes.name,
                      product.attributes.price
                    ).catch((err) => {
                      console.log(err);
                    });
                  }}
                >
                  <FaShoppingCart /> Add To cart
                </button>
                <button
                  className=" rounded-md text-xl font-semibold bg-gray-400 py-2 text-black w-[22rem]"
                  type="button"
                >
                  Buy it now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center">
        <YTvideo src={product.attributes.youtube_link} />
      </section>

      <section>
        <CustomerReviews productId={params.id} />
      </section>
    </>
  );
};

export default Page;
