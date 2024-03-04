"use client";
import { warningTost } from "@/components/toast/allTost";
import axios from "axios";

export const addToCart = async (
  productId: number,
  userId: any,
  isSignIn: any,
  product_name: string,
  product_price: number
) => {
  if (isSignIn) {
    try {
      const response = await fetch("http://localhost:1337/api/carts", {
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
          },
        }),
      });

      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const data = await response.json();
      console.log("Item added to cart:", data);
      return data;

    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  } else {
    warningTost("Please Login first");
  }
};
