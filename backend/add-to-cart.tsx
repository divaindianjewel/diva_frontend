"use client";
import { domain } from "@/components/backend/apiRouth";
import {
  errorTost,
  successTost,
  warningTost,
} from "@/components/toast/allTost";


interface CartItem {
  id: number;
  attributes: {
    user_id: string;
    Product_id: string;
    product_name: string;
    product_price: number;
    qnt: number;
    img: any;
  };
}

export const addToCart = async (
  productId: string | undefined,
  userId: any,
  product_name: string | undefined,
  product_price: number | undefined,
  img: any
) => {
  try {
    const response = await fetch(`${domain}/api/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          Product_id: productId,
          product_name: product_name,
          product_price: product_price,
          user_id: userId,
          qnt: 1,
          img: img,
        },
      }),
    });

    if (!response.ok) {
      errorTost("Something went wrong");
    } else {
      successTost("Product is added to cart successfully");
    }
    const data = await response.json();
    console.log("Item added to cart:", data);
    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};
