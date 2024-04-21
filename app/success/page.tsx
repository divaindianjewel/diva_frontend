"use client";

import GetCartData, { CartItem } from "@/backend/cart/cart-data";
import GetUserData from "@/backend/get-user-data";
import addOrder from "@/backend/shiprocket/addOrder";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { userId } = useAuth();

  const router = useRouter();

  let cartData = GetCartData();
  let tmpPrice = 0;
  const priceArray = cartData.map(
    (item: CartItem) => (tmpPrice = item.attributes.product_price + tmpPrice)
  );

  const subtotal = priceArray[priceArray.length - 1];
  const gst = subtotal * 0.03;
  const total = subtotal + gst;


  // total = total + total * 0.3;

  let userData = GetUserData();

  let name = "";

  if (userData != undefined) {
    name =
      userData[0].attributes.first_name +
      " " +
      userData[0].attributes.last_name;
  }

  let userDataObj = {};

  if (userData != undefined) {
    userDataObj = {
      first_name: userData[0].attributes.first_name,
      last_name: userData[0].attributes.last_name,
      address: userData[0].attributes.address,
      city: userData[0].attributes.city,
      pincode: String(userData[0].attributes.pincode),
      state: userData[0].attributes.state,
      country: "India",
      email: userData[0].attributes.email,
      phone_number: String(userData[0].attributes.phone_number),
      userId: userId,
    };
  }

  console.log(total);

  addOrder(userDataObj, router, cartData, total);

  return <div>success</div>;
};

export default Page;
