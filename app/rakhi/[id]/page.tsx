"use client";
import React, { useState, useEffect } from "react";
import { IoIosStar } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

import CustomerReviews from "../../../components/custom/reviews/reviewBox";
import { addToCart } from "../../../backend/add-to-cart";
import { domain } from "../../../components/backend/apiRouth";

import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

import { useParams } from "next/navigation";
import { Skeleton } from "../../../components/ui/skeleton";
import { warningTost, successTost } from "../../../components/toast/allTost";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Navbar from "../../../components/custom/navbar";
import SuggestionSwiper from "../../../components/custom/swiper/SuggestionSwiper";
import FadingBanner from "../../../components/custom/Fade";

// importing the cookies
import Cookies from "js-cookie";

// importing icons
import returnIcon from "@/app/assets/icons/exchange.png";
import warranty from "@/app/assets/icons/warranty.png";
import Image from "next/image";
import Link from "next/link";
import RakhiProduct from "@/components/eventComponents/RakhiProducts";

interface ProductData {
  id: number;
  attributes: {
    name: string;
    price: number;
    compare_price: number;
    description: BlocksContent;
    youtube_link: string;
    stock: number;
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
      };
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

export interface ReviewProps {
  id: number;
  attributes: {
    product_id: number;
    ratting: number;
    Description: string;
    user_id: string;
    user_name: string;
  };
}

export interface cartItemProps {
  id: number | undefined;
  img: string | undefined;
  name: string | undefined;
  price: number | undefined;
  qnt: number | undefined;
}

interface ApiResponse {
  data: ProductData;
}

interface ReviewAttributes {
  id: number;
  attributes: {
    product_id: number;
    ratting: number;
    Description: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Page = () => {
  const [cartItem, setCartItem] = useState<cartItemProps | undefined>();
  const [userLocalId, setUserLocalId] = useState<string | undefined>("");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [randomNum, setRandomNum] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | undefined>(0);
  const [productAdded, setProductAdded] = useState<boolean>(false);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const width = 450;
  const [loading, setLoading] = useState<boolean>(true);
  const [cartDisable, setCartDisable] = useState<boolean>(false);
  const [imgData, setImgData] = useState<any[]>([]);
  const [isLoadProduct, setIsLoadProduct] = useState<boolean>(false);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [avgReviews, setAvgReviews] = useState<number>(0);

  // Rakhi States
  const [selectedRakhi, setSelectedRakhi] = useState<string>("");
  const [RakhiProducts, setRakhiProducts] = useState<ProductData[]>([]);
  const [rakhiLoading, setRakhiLoading] = useState<boolean>(true);

  //  getting the productId
  const params = useParams();
  let productId = 0;

  if (params) {
    productId = Number(params.id);
  }

  // Getting the rakhi products
  useEffect(() => {
    const getData = async () => {
      const price = productId == 300 ? 550 : 260;

      const res = await fetch(
        `${domain}/api/products?populate=*&filters[$and][0][category][id][$eq]=16`
      );
      const data = await res.json();
      const filteredData = data.data.filter(
        (item: ProductData) => item.attributes.price === price
      );
      setRakhiProducts(filteredData);
      setRakhiLoading(false);
    };

    getData();
  }, [rakhiLoading]);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNum(randomNumber);
  };

  //  FUNCTION TO ADD THE PRODUCT TO THE CART
  const handleAddToCart = () => {
    setCartDisable(true);

    const existingCart = Cookies.get("DIVAcart");
    const cartItems: cartItemProps[] = existingCart
      ? JSON.parse(existingCart)
      : []; 

    if (cartItem != undefined) {
      const isProductInCart = cartItems.some((item) => item.id === cartItem.id);
      if (isProductInCart) {
        warningTost("Product is already added to the cart");
      } else {
        if (userLocalId) {
          generateRandomNumber();
          addToCart(
            String(selectedRakhi),
            userLocalId,
            product?.attributes.name + selectedRakhi,
            product?.attributes.price,
            product?.attributes.images.data[0].attributes.url
          );
          cartItems.push(cartItem);
          Cookies.set("DIVAcart", JSON.stringify(cartItems), {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
            path: "/",
            domain: window.location.hostname,
          });
        } else {
          cartItems.push(cartItem);
          Cookies.set("DIVAcart", JSON.stringify(cartItems), {
            expires: 365,
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
            path: "/",
            domain: window.location.hostname,
          });
        }
        successTost("Product added to cart");
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        setRandomNum(randomNumber);
      }
    } else {
      console.log("cart Item is undefined");
    }
    setTimeout(() => {
      setCartDisable(false);
    }, 3500);
  };

  // GET THE USER-ID
  useEffect(() => {
    const id = Cookies.get("DIVAIJ-USER");
    setUserLocalId(id);
  }, [userLocalId]);

  // GET THE PRODUCT DATA
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

        const categoryId = product?.attributes.category.data.id;

        if (product?.attributes.category.data.id != undefined) {
          setCategoryId(product?.attributes.category.data.id);
        }

        const mappedImages = product?.attributes.images.data.map((item) => {
          const url = item.attributes.url;
          return {
            original: url,
            thumbnail: url,
          };
        });

        if (mappedImages != undefined) {
          setImgData(mappedImages);
        }

        const cartProduct: cartItemProps = {
          id: product?.id,
          img: product?.attributes.images.data[0].attributes.url,
          name: product?.attributes.name + " - " + selectedRakhi,
          price: product?.attributes.price,
          qnt: 1,
        };
        setCartItem(cartProduct);

        setLoading(false);
        setIsLoadProduct(true);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isLoadProduct, product]);

  useEffect(() => {
    if (cartData.length > 0) {
      setProductAdded(true);
    }
  }, [cartData, randomNum]);

  // GET THE REVIEW DATA
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(
          `${domain}/api/reviews?filters[$and][0][product_id][$eq]=${productId}`
        );
        const data = await res.json();
        const reviews: ReviewAttributes[] = data.data;
        setTotalReviews(reviews.length);

        if (reviews.length > 0) {
          const sumRatings = reviews.reduce(
            (sum, review) => sum + review.attributes.ratting,
            0
          );
          const averageRating = sumRatings / reviews.length;
          setAvgReviews(averageRating);
        } else {
          setAvgReviews(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReview();
  }, [productId, domain, randomNum]);

  const handelDescription = (content: BlocksContent) => {
    return <BlocksRenderer content={content} />;
  };

  const images = imgData;
  const IconHeight = 50;
  const IconWidth = 50;

  return (
    <>
      <FadingBanner />

      <div className="sticky top-0 left-0 z-[100]">
        <Navbar randomNum={randomNum} />
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="w-fit gap-12 mx-auto flex flex-col lg:flex-row  items-center justify-center">
            <div id="images w-[80vw] mx-auto">
              <div className="flex items-center justify-center w-fit">
                <div className="w-[15rem] md:w-[25rem] lg:w-[35rem]">
                  <ImageGallery
                    autoPlay={true}
                    showNav={false}
                    showPlayButton={false}
                    items={images}
                  />
                </div>
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
                        <span className=" mr-1">{avgReviews}</span>{" "}
                        <IoIosStar size={20} color="gold" className="" />
                      </div>
                      <span className="text-lg text-gray-500">
                        ({totalReviews} reviews)
                      </span>
                    </>
                  )}
                </div>
              </h1>

              <div className="mb-4 my-3">
                {product?.attributes.category.data.id != 17 ? (
                  <div className="flex item-center justify-start flex-col my-5 gap-3">
                    <Link href={`/return`}>
                      <div className="flex gap-5 items-center justify-start">
                        <Image
                          src={returnIcon}
                          alt="return icons"
                          width={IconWidth}
                          height={IconHeight}
                        />
                        <p className="text-base font-semibold capitalize">
                          15 days return policy
                        </p>
                      </div>
                    </Link>
                    <Link href={"/return"}>
                      <div className="flex gap-5 items-center justify-start">
                        <Image
                          src={warranty}
                          alt="return icons"
                          width={IconWidth}
                          height={IconHeight}
                        />
                        <p className="text-base font-semibold capitalize">
                          6 months warranty
                        </p>
                      </div>
                    </Link>

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
                ) : (
                  <div>
                    <h1 className="text-xl font-semibold">
                      {" "}
                      Select Your Rakhi
                    </h1>

                    <RakhiProduct
                      products={RakhiProducts}
                      selectedRakhi={selectedRakhi}
                      setSelectedRakhi={setSelectedRakhi}
                    />
                  </div>
                )}
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
                  </>
                ) : (
                  <div className="hidden md:flex w-fit items-center justify-center flex-col gap-3 md:flex-row lg:flex-col">
                    {product?.attributes.stock != 0 ? (
                      <button
                        className="w-[90%] rounded-md text-xl font-semibold text-white bg-[#212020] py-2 flex items-center justify-center  gap-3 md:w-[20rem] lg:w-[25rem]"
                        type="button"
                        disabled={cartDisable}
                        onClick={handleAddToCart}
                      >
                        <FaShoppingCart /> Add To cart
                      </button>
                    ) : (
                      <Link
                        className="rounded-md text-xl font-semibold text-white bg-[#212020] py-2 flex items-center justify-center gap-3  w-[15rem] md:w-[20rem] lg:w-[25rem]"
                        type="button"
                        href={`whatsapp://send?phone=+918888282229&text=Hey There i want \n${window.location.href}`}
                      >
                        <FaWhatsapp /> Contact Us Now
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {product?.attributes.youtube_link ? (
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
      ) : (
        ""
      )}

      <section>
        <CustomerReviews productId={productId} />
      </section>

      <div className="md:hidden sticky bottom-[10px] flex flex-col gap-3 mt-3 w-full mx-auto">
        {loading ? (
          <>
            <Skeleton className="h-[35px] w-[250px] rounded-xl mt-3 skeleton-bg" />
            <Skeleton className="h-[35px] w-[250px] rounded-xl skeleton-bg" />
          </>
        ) : (
          <div className="w-full flex items-center justify-center flex-col gap-3 md:flex-row lg:flex-col">
            {/* */}

            {product?.attributes.stock != 0 ? (
              <button
                className="w-[90%] rounded-md text-xl font-semibold text-white bg-[#212020] py-2 flex items-center justify-center  gap-3 md:w-[20rem] lg:w-[25rem]"
                type="button"
                disabled={cartDisable}
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add To cart
              </button>
            ) : (
              <Link
                className="rounded-md text-xl font-semibold text-white bg-[#212020] py-2 flex items-center justify-center gap-3  w-[15rem] md:w-[20rem] lg:w-[25rem]"
                type="button"
                href={`whatsapp://send?phone=+918888282229&text=Hey There i want\t\t${window.location.href}`}
              >
                <FaWhatsapp /> Contact Us Now
              </Link>
            )}
          </div>
        )}
      </div>

      <section>
        {categoryId ? <SuggestionSwiper categoryId={categoryId} /> : ""}
      </section>
    </>
  );
};

export default Page;
