"use client";
import { domain } from "@/components/backend/apiRouth";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

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

const GetUserData = () => {
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState<addressProps[]>();

  useEffect(() => {
    let obj = {};

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
    };

    UserData();
  }, []);
  return userInfo;
};

export default GetUserData;
