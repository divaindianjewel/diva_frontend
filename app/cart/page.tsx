"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartItems from "@/components/custom/cartItems";
import { useAuth, useUser } from "@clerk/nextjs";
import { domain } from "@/components/backend/apiRouth";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { errorTost, successTost } from "@/components/toast/allTost";
import CreateOrderId from "@/backend/order/create-orderId";

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


export default function Component() {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { userId } = useAuth();
  const { isSignedIn, user } = useUser();
  const [randomNum, setRandomNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);


  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setRandomNum(randomNumber);
  };

  

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData = data.data.filter(
            (item: CartItem) => item.attributes.user_id === userId
          );
          setCartData(userCartData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userId, isSignedIn, randomNum]);

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

  return cartData.length > 0 ? (
    <>
      {isSignedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>My Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {cartData.map((item) => (
                <CartItems
                  key={item.id}
                  productId={item.attributes.Product_id}
                  cartId={item.id}
                  qnt={item.attributes.qnt}
                  image={item.attributes.img}
                  show={true}
                  random={generateRandomNumber}
                />
              ))}
            </div>
          </CardContent>

          <Separator />

          <div className="w-full flex justify-end items-end gap-5 flex-col mr-10 mt-10 py-5 px-10">
           

            <div className="w-[30rem] max-w-[40rem] ">
              <Link href={"/checkout"} target="_blank">
                <Button className="w-full " size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div>Please Login first</div>
      )}
    </>
  ) : (
    <div>
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
