"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import addOrder from "@/backend/shiprocket/addOrder";
import CreateOrderId from "@/backend/order/create-orderId";
import { successTost } from "@/components/toast/allTost";

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
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(true);
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<addressProps[]>();
  const [total, setTotal] = useState<number>(0);
  const [userObj, setUserObj] = useState<any>({});
  const [userName, setUserName] = useState<any>();
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
        const fullName = obj.first_name + " " + obj.last_name;
        setUserName(fullName);
        setUserObj(obj);
        setUserInfoLoading(false);
      }
    };

    UserData();
  }, [userId]);

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
    const addOrderAndOrderId = () => {
      // console.log("CartData : " + cartData.length);
      // console.log("total : " + total);
      // console.log("UserId : " + userId);
      // console.log("UserName : " + userName);
      // console.log("___________________________");
      if (userName != undefined && total != 0) {
        console.log("CartData : " + cartData.length);
        console.log("total : " + total);
        console.log("UserId : " + userId);
        console.log("UserName : " + userName);
        addOrder(userObj, router, cartData, total, userId, userName);
      }
    };
    addOrderAndOrderId();
  }, [cartData, total]);

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

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <svg
          className="animate-spin h-8 w-8 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          please wait your order is placing
        </p>
      </div>
    </div>
  );
};

export default Page;
