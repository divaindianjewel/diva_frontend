"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "../../components/ui/separator";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import CartItems from "../../components/custom/cartItems";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";

import Navbar from "../../components/custom/navbar";
import FadingBanner from "../../components/custom/Fade";

// importing Cookies
import Cookies from "js-cookie";

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

export interface cartItemProps {
  id: number | undefined;
  name: string | undefined;
  img: string | undefined;
  price: number | undefined;
  qnt: number | undefined;
}

export default function Component() {
  const [loading2, setLoading2] = useState<boolean>(true);
  const [cartData2, setCartData2] = useState<cartItemProps[]>([]);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { isSignedIn, user } = useUser();
  const [randomNum, setRandomNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNum(randomNumber);
  };

  useEffect(() => {
    const cartString = Cookies.get("DIVAcart");
    const cartData: cartItemProps[] = cartString ? JSON.parse(cartString) : [];
    setCartData2(cartData);
    setLoading2(false);
  }, [loading2, randomNum]);

  useEffect(() => {
    let tmpsubtotal = 0;
    cartData.map(
      (item) =>
        (tmpsubtotal =
          tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
    );
    setSubtotal(tmpsubtotal);

    const gst = tmpsubtotal * 0.18;

    const totalPrice = tmpsubtotal + gst;
    setTotal(totalPrice);
  }, [cartData]);

  return cartData2.length > 0 ? (
    <>
      <FadingBanner />
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar randomNum={randomNum} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {cartData2 !== undefined
              ? cartData2.map((item) =>
                  item.price ? (
                    <CartItems
                      key={item.id}
                      productName={item.name}
                      productId={item.id}
                      price={item.price}
                      cartId={item.id}
                      qnt={item.qnt}
                      image={item.img}
                      show={true}
                      random={generateRandomNumber}
                    />
                  ) : (
                    ""
                  )
                )
              : ""}
          </div>
        </CardContent>

        <Separator />

        <div className="w-full flex justify-end items-end gap-5 flex-col mr-10 mt-10 py-5 px-10">
          <div>
            <Link href={"/checkout"} target="_blank">
              <Button className="w-full " size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </>
  ) : (
    <div>
      <div className="sticky top-0 left-0 z-[100]">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400">
            It looks like you haven't added any items to your cart yet. Why
            don't you take a look at our amazing products and find something you
            love?
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="/"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  );
}
