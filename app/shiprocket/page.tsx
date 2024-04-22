"use client";
import React, { useEffect, useState } from "react";

import { errorTost, successTost } from "@/components/toast/allTost";
import { generateRandomId } from "@/app/api/Payment";
import { useRouter } from "next/navigation";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import addOrder from "@/backend/shiprocket/addOrder";

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

export interface addressProps {
  id: number;
  attributes: {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    email: string;
    phone_number: number;
    user_id: string;
  };
}

const Page = () => {
  const { userId } = useAuth();
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<addressProps[]>();
  const [total, setTotal] = useState<number>(0);
  const [userObj, setUserObj] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const UserData = async () => {
      const userResponse = await fetch(`${domain}/api/billing-addresses`, {
        method: "GET",
      });
      const data = await userResponse.json();

      const tmpUserData = data.data?.filter(
        (items: addressProps) => items.attributes.user_id == userId
      );

      setUserInfo(tmpUserData);
      if (tmpUserData.length > 0) {
        const obj = {
          first_name: tmpUserData[0].attributes.first_name,
          last_name: tmpUserData[0].attributes.last_name,
          address: tmpUserData[0].attributes.address,
          city: tmpUserData[0].attributes.city,
          pincode: String(tmpUserData[0].attributes.pincode),
          state: tmpUserData[0].attributes.state,
          country: "India",
          email: tmpUserData[0].attributes.email,
          phone_number: String(tmpUserData[0].attributes.phone_number),
          userId: userId,
        };

        setUserObj(obj);
      }
    };

    UserData();
  }, []);

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
  }, [userId]);

  useEffect(() => {
    if (
      userInfo != undefined &&
      cartData != undefined &&
      cartData.length > 0 &&
      userInfo.length > 0 &&
      total != 0
    ) {
      console.log(cartData);
      console.log(userInfo[0].attributes.city);
      console.log(total);
      console.log(userObj);
      addOrder(userObj, router, cartData, total);
    }
  }, [cartData]); 
  useEffect(() => {
    let tmpsubtotal = 0;

    cartData.map(
      (item) =>
        (tmpsubtotal =
          tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
    );
    const gst = tmpsubtotal * 0.03;

    const totalPrice = tmpsubtotal + gst;
    setTotal(totalPrice);
  }, [cartData]);

  return <div>working</div>;
};

export default Page;
