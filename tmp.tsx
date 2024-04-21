"use client";
import { domain } from "@/components/backend/apiRouth";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import addOrder from "@/backend/shiprocket/addOrder";
import createOrderId from "@/backend/order/create-orderId";

interface addressProps {
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
    userId: string;
  };
}
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

const Page = () => {
  const { userId } = useAuth();
  const [cartData, setCartData] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<addressProps[]>();
  const [total, setTotal] = useState<number>(0);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  let obj = {};

  const router = useRouter();

  // ! user cart data fetching
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();

        const userCartData = data.data.filter(
          (item: CartItem) => item.attributes.user_id == userId
        );
        setCartData(userCartData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (!hasFetchedData) {
      fetchCartData();
      setHasFetchedData(true);
    }
  }, [userId, hasFetchedData]);

  // ! user address data fetching
  useEffect(() => {
    const getUserData = async () => {
      const userResponse = await fetch(`${domain}/api/billing-addresses`, {
        method: "GET",
      });

      const data = await userResponse.json();

      const tmpUserData = data.data?.filter(
        (items: addressProps) => items.attributes.userId == userId
      );

      setUserInfo(tmpUserData);

      if (tmpUserData.length > 0) {
        obj = {
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
      }

      // TODO : calculating the total
      let tmpsubtotal = 0;
        cartData.map(
        (item) =>
          (tmpsubtotal =
            tmpsubtotal + item.attributes.product_price * item.attributes.qnt)
      );

      const gst = tmpsubtotal * 0.03;

      const totalPrice = tmpsubtotal + gst;
      setTotal(totalPrice);

      const currentDate = new Date();
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1; // Note: January is 0
      var year = currentDate.getFullYear();

      let first_name = "";

      if (userInfo != undefined) {
        first_name = userInfo[0].attributes.first_name;
      }

      const response = await fetch(`${domain}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            user_id: userId,
            order_date: `${day}-${month}-${year}`,
            total_price: total,
            discount: 0,
            user_name: first_name,
          },
        }),
      });

      const OrderData = await response.json();

      console.log(OrderData.data.id);
    };

    if (!hasFetchedData) {
      getUserData();
      setHasFetchedData(true);
    }
    
  }, [cartData]);

  return (
    <div>
      <h1>Success Page</h1>

      <ul></ul>
    </div>
  );
};

export default Page;
