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
import { domain } from "@/components/backend/apiRouth";

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
  const width = 550;
  const height = 375;
  const [loading, setLoading] = useState<boolean>(true);

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
  }, [randomNum]);

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
                    {loading ? (
                      <>
                        <CarouselItem>
                          <Skeleton className="h-[600px] w-[350px] rounded-xl skeleton-bg margin--3" />
                        </CarouselItem>
                      </>
                    ) : (
                      product?.attributes.images.data.map((image, index) => (
                        <CarouselItem key={index}>
                          <Image
                            className="rounded-md"
                            src={`${image.attributes.url}`}
                            alt={`Image ${index + 1}`}
                            width={width}
                            height={height}
                          />
                        </CarouselItem>
                      ))
                    )}
                    {loading ? (
                      ""
                    ) : (
                      <CarouselItem>
                        <div className="video-container">
                          <iframe
                            width={width}
                            height={470}
                            src={product?.attributes.youtube_link}
                          ></iframe>
                        </div>
                      </CarouselItem>
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

              <div className="flex flex-col gap-3 mt-3">
                {loading ? (
                  <>
                    <Skeleton className="h-[35px] w-[250px] rounded-xl mt-3 skeleton-bg" />
                    <Skeleton className="h-[35px] w-[250px] rounded-xl skeleton-bg" />
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-md text-xl font-semibold gold-color text-black py-2 flex items-center justify-center gap-3  w-[22rem]"
                      type="button"
                      onClick={() => {
                        if (!productAdded) {
                          generateRandomNumber();
                          addToCart(
                            String(productId),
                            userId,
                            isSignedIn,
                            product?.attributes.name,
                            product?.attributes.price,
                            product?.attributes.images.data[0].attributes.url
                          );
                        } else {
                          warningTost("Product is already added");
                        }
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <CustomerReviews productId={productId} />
      </section>
    </>
  );
};

export default Page;
