import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";

import { FaTrashAlt } from "react-icons/fa";
import { domain } from "../backend/apiRouth";
import { decrementQnt, incrementQnt } from "@/backend/cart-operation";
import Link from "next/link";
import axios from "axios";
import { errorTost, successTost, warningTost } from "../toast/allTost";

export interface cartItemProps {
  id: number;
  attributes: {
    user_id: string;
    Product_id: number;
    product_name: string;
    product_price: number;
    qnt: number;
  };
}

const CartItems: React.FC<{
  productId: number;
  cartId: number;
  qnt: number;
  show: boolean;
  image: any;
  random: () => void;
}> = ({ productId, cartId, qnt, show, image, random }) => {
  const [quantity, setQuantity] = useState<any>(qnt);
  const [cartData, setCartData] = useState<cartItemProps | null>(null);
  const [total, setTotal] = useState<number>();
  const [randomNum, setRandomNum] = useState<number>(0);


  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
          const product = data.data.find(
            (item: cartItemProps) => item.attributes.Product_id == productId
          );

          if (product) {
            setTotal(product.attributes.product_price.toFixed(2));
            setQuantity(product.attributes.qnt);
            setCartData(product);
          }
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, [randomNum, productId]);

  const handleRemoveFromCart = async (id: number) => {
    try {
      const response = await fetch(`${domain}/api/carts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response) {
        random();
        successTost("Product Deleted Successfully");
      } else {
        warningTost("Please Try Again");
      }
    } catch (error) {
      errorTost(`${error}`);
    }
  };

  return (
    <>
      {cartData && (
        <div className="flex items-center gap-4 flex-col justify-center md:flex-row">
          <Link
            href={`/products/${productId}`}
            className="flex items-center gap-4"
          >
            <Image
              alt="Product image"
              className="aspect-square rounded-lg object-cover"
              height="120"
              src={image}
              width="120"
            />
            <div className="grid gap-1.5">
              <div className="font-medium">
                {cartData.attributes.product_name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                #{cartData.attributes.Product_id}
              </div>

              {show ? (
                ""
              ) : (
                <div className="text-sm font-medium">
                  quantity : {cartData.attributes.qnt}
                </div>
              )}
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="font-semibold">
                ₹{total != undefined ? total * quantity : total}.00 /-
              </div>
            </div>
            {show ? (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    const newQnt = await decrementQnt(cartId, quantity);
                    setQuantity(newQnt);
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
                  onClick={async () => {
                    const newQnt = await incrementQnt(cartId, quantity);
                    setQuantity(newQnt);
                  }}
                >
                  <MdAdd />
                </Button>
              </div>
            ) : (
              ""
            )}
            <div
              className="bg-red-700 w-fit py-2 px-2 m-3 rounded cursor-pointer"
              onClick={() => handleRemoveFromCart(cartData.id)}
            >
              <FaTrashAlt color="white" size={19} />
            </div>
          </div>
        </div>
      )}
      <div className="border-t" />
    </>
  );
};

export default CartItems;
