"use client";

import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";

import { FaMinus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

import Link from "next/link";
import { successTost } from "../toast/allTost";
import Cookies from "js-cookie";

interface cartItemProps {
  id: number;
  img: string;
  name: string;
  price: number;
  qnt: number;
}

const CartItems: React.FC<{
  productName: string | undefined;
  productId: number | undefined;
  cartId: number | undefined;
  qnt: number | undefined;
  show: boolean | undefined;
  image: any | undefined;
  price: number;
  random: () => void;
}> = ({ productId, cartId, qnt, show, image, random, productName, price }) => {
  const [quantity, setQuantity] = useState<any>(qnt);

  const handleDeleteCart = (productId: number | undefined) => {
    if (productId !== undefined) {
      const existingCart = Cookies.get("DIVAcart");
      const cartItems: cartItemProps[] = existingCart
        ? JSON.parse(existingCart)
        : [];

      console.log("------------------cart Items--------------------");
      console.log(cartItems);

      const updatedCartItems = cartItems.filter(
        (item) => (item.id !== productId, console.log(` Loop : ${item.id}`))
      );

      console.log(`out of loop : ${productId}`);
      console.log("------------------updated Cart Items--------------------");
      console.log(updatedCartItems);

      Cookies.set("DIVAcart", JSON.stringify(updatedCartItems), {
        expires: 365,
      });
      random();
      successTost("Product Deleted Successfully");
    }
  };

  const decrementQnt = (productId: number | undefined) => {
    if (quantity > 1) {
      const existingCart = Cookies.get("DIVAcart");
      const cartItems: cartItemProps[] = existingCart
        ? JSON.parse(existingCart)
        : [];

      const updatedCartItems = cartItems.map((item) => {
        if (item.id === productId) {
          if (item.qnt) return { ...item, qnt: item.qnt - 1 };
        }
        return item;
      });

      Cookies.set("DIVAcart", JSON.stringify(updatedCartItems));

      let tmp = quantity;
      tmp--;

      setQuantity(tmp);
    }
  };

  const incrementQnt = (productId: number | undefined) => {
    const existingCart = Cookies.get("DIVAcart");
    const cartItems: cartItemProps[] = existingCart
      ? JSON.parse(existingCart)
      : [];

    const updatedCartItems = cartItems.map((item) => {
      if (item.id == productId) {
        console.log();
        return { ...item, qnt: item.qnt + 1 };
      }
      return item;
    });

    let tmp = quantity;
    tmp++;
    Cookies.set("DIVAcart", JSON.stringify(updatedCartItems));
    setQuantity(tmp);
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-col justify-center md:flex-row">
        <Link
          href={`/products/${productId}`}
          className="sm:flex-row flex-col flex items-center gap-4"
        >
          <Image
            alt="Product image"
            className="aspect-square rounded-lg object-cover"
            height="120"
            src={image}
            width="120"
          />
          <div className="grid gap-1.5">
            <div className="font-medium">{productName}</div>
            <div className="text-base text-gray-600 font-semibold dark:text-gray-400">
              Price : {price}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              #{productId}
            </div>

            {show ? (
              ""
            ) : (
              <div className="text-sm font-medium">quantity : {quantity}</div>
            )}
          </div>
        </Link>

        <div className="ml-auto flex md:flex-row flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="font-semibold ">₹{price * quantity}.00 /-</div>
          </div>
          {show ? (
            <>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    decrementQnt(productId);
                  }}
                >
                  <FaMinus />
                </Button>
                <Input
                  className="w-12 border border-gray-200 rounded-md dark:border-gray-800"
                  type="number"
                  value={quantity}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    incrementQnt(productId);
                  }}
                >
                  <MdAdd />
                </Button>
              </div>
              <div
                className="bg-red-700 w-fit py-2 px-2 m-3 rounded cursor-pointer"
                onClick={() => {
                  handleDeleteCart(productId);
                }}
              >
                <FaTrashAlt color="white" size={19} />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="border-t" />
    </>
  );
};

export default CartItems;
