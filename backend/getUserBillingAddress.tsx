"use client";

import React from "react";
import { useState } from "react";
import { domain } from "@/components/backend/apiRouth";
import { auth } from "@clerk/nextjs";


const getUserBillingAddress = async () => {
  const [userData, setUserData] = useState<addressProps[]>();

  const userID = String(auth());

  try {
    const response = await fetch(`${domain}/api/billing-addresses`);

    const data = await response.json();
    setUserData(data.data);

    const newData = userData?.filter(
      (item: addressProps) => item.attributes.user_id == "256"
    );

    console.log(newData);
  } catch (error) {
    console.log("Error in getting billing addresses");
  }

  return <div></div>;
};

export default getUserBillingAddress;
