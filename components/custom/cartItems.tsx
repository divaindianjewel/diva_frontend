import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdAdd } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";

import img1 from "@/app/assets/product_img/stock-img (1).jpg";
import { domain } from "../backend/apiRouth";
import { decrementQnt, incrementQnt } from "@/backend/cart-operation";

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
  image : any
}> = ({ productId, cartId, qnt, show, image }) => {
  const [quantity, setQuantity] = useState<any>(qnt);
  const [cartData, setCartData] = useState<cartItemProps | null>(null);
  const [total, setTotal] = useState<number>();

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
  }, [productId]);

  return (
    <>
      {cartData && (
        <div className="flex items-center gap-4">
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
          </div>
        </div>
      )}
      <div className="border-t" />
    </>
  );
};

export default CartItems;
