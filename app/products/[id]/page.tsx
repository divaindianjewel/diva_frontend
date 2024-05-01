"use client";
import React, { useState, useEffect } from "react";
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
import { domain, updateCart } from "@/components/backend/apiRouth";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { warningTost } from "@/components/toast/allTost";

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

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
    img: any;
  };
}

interface ApiResponse {
  data: ProductData;
}

const Page = () => {
  const [randomNum, setRandomNum] = useState<number>(0);
  const [productAdded, setProductAdded] = useState<boolean>(false);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [product, setProduct] = useState<ProductData | null>(null);
  const { userId } = useAuth();
  const { isSignedIn } = useUser();
  const width = 450;
  const height = 275;
  const [loading, setLoading] = useState<boolean>(true);
  const [cartDisable, setCartDisable] = useState<boolean>(false);

  const params = useParams();

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNum(randomNumber);
  };

  let productId = 0;

  if (params) {
    productId = Number(params.id);
  }

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData = data.data.filter(
            (item: CartItem) =>
              item.attributes.user_id === userId &&
              item.attributes.Product_id == productId
          );
          setCartData(userCartData);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (isSignedIn) {
      fetchCartData();
    }
  }, [randomNum, isSignedIn, userId, productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${domain}/api/products/${productId}?populate=*`
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
  }, [productId]);
  useEffect(() => {
    if (cartData.length > 0) {
      setProductAdded(true);
    }
  }, [cartData, randomNum]); // Depend on cartData to run this effect when cartData changes

  console.log(cartData);

  const handelDescription = (content: BlocksContent) => {
    return <BlocksRenderer content={content} />;
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="w-fit gap-12 mx-auto flex flex-col lg:flex-row  items-center justify-center">
            <div id="images w-[80vw] mx-auto">
              <div className="flex items-center justify-center w-fit">
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
                    {loading ? (
                      <>
                        <CarouselItem>
                          <Skeleton className="h-[600px] w-[350px] rounded-xl skeleton-bg margin--3" />
                        </CarouselItem>
                      </>
                    ) : (
                      product?.attributes.images.data.map((image, index) => (
                        <CarouselItem className="w-fit" key={index}>
                          <Image
                            className="rounded-md w-[80vw]"
                            src={`${image.attributes.url}`}
                            alt={`Image ${index + 1}`}
                            width={width}
                            height={height}
                          />
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {loading ? (
                  <Skeleton className="h-[10px] w-[100px] rounded-xl skeleton-bg margin--3 mb-5" />
                ) : (
                  "Diva The Indian Jewel"
                )}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {loading ? (
                  <>
                    <Skeleton className="h-[20px] w-[300px] rounded-xl skeleton-bg" />
                    <Skeleton className="h-[20px] w-[200px] rounded-xl mt-1 mb-5 skeleton-bg" />
                  </>
                ) : (
                  product?.attributes.name
                )}
                <div className="flex gap-2 items-center ">
                  {loading ? (
                    <Skeleton className="h-[20px] w-[100px] rounded-xl mt-3 mb-7 skeleton-bg" />
                  ) : (
                    <>
                      <div className="ratting mt-2 flex items-center px-3 py-1 bg-yellow-100 w-fit text-lg">
                        <span className=" mr-1">5</span>{" "}
                        <IoIosStar size={20} color="gold" className="" />
                      </div>
                      <span className="text-lg text-gray-500">
                        (30 reviews)
                      </span>
                    </>
                  )}
                </div>
              </h1>
              <div className="mb-4 my-3">
                {loading ? (
                  <>
                    <Skeleton className="h-[15px] w-[340px] rounded-xl skeleton-bg" />
                    <Skeleton className="h-[15px] w-[340px] rounded-xl skeleton-bg mt-1" />
                    <Skeleton className="h-[15px] w-[340px] rounded-xl skeleton-bg mt-1" />
                  </>
                ) : product?.attributes.description ? (
                  handelDescription(product?.attributes.description)
                ) : (
                  "No Description"
                )}
              </div>

              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex"></div>
                <div className="flex ml-6 items-center"></div>
              </div>

              {loading ? (
                ""
              ) : (
                <>
                  <div className="flex">
                    <span className="title-font font-medium text-2xl text-gray-900 mr-1">
                      ₹{product?.attributes.price}
                      <span className="text-gray-600 text-sm">
                        MRP{" "}
                        <span className="line-through">
                          ₹{product?.attributes.compare_price}
                        </span>{" "}
                      </span>
                    </span>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 mt-3 w-fit mx-auto">
                {loading ? (
                  <>
                    <Skeleton className="h-[35px] w-[250px] rounded-xl mt-3 skeleton-bg" />
                    <Skeleton className="h-[35px] w-[250px] rounded-xl skeleton-bg" />
                  </>
                ) : (
                  <div className="w-fit flex items-center justify-center flex-col gap-3 md:flex-row lg:flex-col">
                    <button
                      className="rounded-md text-xl font-semibold gold-color text-black py-2 flex items-center justify-center gap-3  w-[15rem] md:w-[20rem] lg:w-[25rem]"
                      type="button"
                      disabled={cartDisable}
                      onClick={() => {
                        setCartDisable(true);
                        if (!productAdded) {
                          console.log(cartDisable);
                          generateRandomNumber();
                          addToCart(
                            String(productId),
                            userId,
                            isSignedIn,
                            product?.attributes.name,
                            product?.attributes.price,
                            product?.attributes.images.data[0].attributes.url
                          );
                          updateCart();
                        } else {
                          warningTost("Product is already added");
                        }

                        setTimeout(() => {
                          setCartDisable(false);
                        }, 3500);
                      }}
                    >
                      <FaShoppingCart /> Add To cart
                    </button>
                    <button
                      className=" rounded-md text-xl font-semibold bg-gray-400 py-2 text-black  w-[15rem] md:w-[20rem] lg:w-[25rem]"
                      type="button"
                    >
                      Buy it now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-fit mx-auto">
        <div className="video-container w-fit flex items-center justify-center">
          <iframe
            className="w-[17rem] lg:w-[30rem] md:w-[25rem]"
            width={width}
            height={500}
            src={product?.attributes.youtube_link}
          ></iframe>
        </div>
      </section>

      <section>
        <CustomerReviews productId={productId} />
      </section>
    </>
  );
};

export default Page;
