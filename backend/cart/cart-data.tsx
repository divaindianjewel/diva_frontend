"use client";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import UseUserId from "../user/get-userId";

export interface CartItem {
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

const GetCartData = () => {
  // const userId = UseUserId();
  const userId = "Ruhsike"
  const [cartData, setCartData] = useState<CartItem[]>([]);


  const dependance = 1;

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
    fetchCartData();
  }, [userId]); // Include userId in the dependencies array

  return cartData;
};

export default GetCartData;
