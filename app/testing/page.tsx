"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const page = () => {
  useEffect(() => {
    const data = Cookies.get("DIVAcart");
    const cartData = data ? JSON.parse(data) : [];

    console.log("-------------- CART DATA ----------------");
    console.log(cartData);

    console.log("----------------- User Address ---------------");
    const userData = Cookies.get("DIVAUserAddress");
    console.log(userData);

    console.log("--------------------- USER ID -----------------------");
    const tmpUserId = Cookies.get("DIVAIJ-USER");
    console.log(tmpUserId);

    console.log("--------------------- Order ID -----------------------");
    const tmpOrderId = Cookies.get("DivaOrderId");
    console.log(tmpOrderId);

    console.log("--------------------- Order ID -----------------------");
    const divaOrders = Cookies.get("divaOrders");
    console.log(divaOrders);
  }, []);

  return <div></div>;
};

export default page;
