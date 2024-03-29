"use client"

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

interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
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
        const response = await fetch(
          `${domain}/api/carts?populate=*`
        );
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          // Filter the cart data based on the current user's ID
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
    const subtotalValue = cartData.reduce(
      (acc, item) => acc + item.attributes.product_price,
      0
    );
    setSubtotal(subtotalValue);

    // Calculate GST (18%)
    const gst = subtotalValue * 0.18;

    // Calculate total price
    const totalPrice = subtotalValue + gst;
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
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
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
