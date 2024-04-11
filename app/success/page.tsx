"use client";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import addOrder from "@/backend/shiprocket/addOrder";

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
    user_id: string;
  };
}

const Page = () => {
  const [cartData, setCartData] = useState<any[]>([]);
  const { userId } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${domain}/api/carts?populate=*`);
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const userCartData = data.data.filter(
            (item: any) => item.attributes.user_id === userId
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
    const getUserData = async () => {
      const userResponse = await fetch(`${domain}/api/billing-addresses`, {
        method: "GET",
      });

      const data = await userResponse.json();

      const tmpUserData = data.data?.filter(
        (items: addressProps) => items.attributes.user_id == userId
      );

      console.log(data.data);

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
        user_id: userId,
      };
      addOrder(obj, router, cartData);
    };

    getUserData();
  }, [userId]);

  console.log(cartData);

  return <div>success</div>;
};

export default Page;
