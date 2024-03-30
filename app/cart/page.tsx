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

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
    img : any
  };
}

export default function Component() {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { userId } = useAuth();
  const { isSignedIn } = useUser();

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
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (isSignedIn) {
      fetchCartData();
    }
  }, [userId, isSignedIn]);

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

  return (
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
                />
              ))}
            </div>
          </CardContent>

          <Separator />

          <div className="w-full flex justify-end mr-10 mt-10">
            <div className="w-[30rem] max-w-[40rem] ">
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div>Subtotal</div>
                  <div className="ml-auto">₹{subtotal.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div>GST (18%)</div>
                  <div className="ml-auto">₹{(subtotal * 0.18).toFixed(2)}</div>
                </div>
                <div className="flex items-center font-medium">
                  <div>Total</div>
                  <div className="ml-auto">₹{total.toFixed(2)}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={"/checkout"} target="_blank">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardFooter>
            </div>
          </div>
        </Card>
      ) : (
        <div>Please Login first</div>
      )}
    </>
  );
}
