"use client";
import React, { useState } from "react";
import "./radio.css";
import cash from "../app/assets/checkout/cash-on-delivery.png";
import Image from "next/image";
import visa from "../app/assets/checkout/visa.svg";
import rupe from "../app/assets/checkout/rupe.svg";
import mastercard from "../app/assets/checkout/mastercard.svg";
import phonepe from "../app/assets/checkout/phonpe.svg";
import gpay from "../app/assets/checkout/gpay.svg";

function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState("online");

  const handleMethodChange = (event: any) => {
    const selectedValue = event.target.id;
    setSelectedMethod(selectedValue);
    console.log(selectedValue);
  };

  return (
    <div className="container">
      <div className="plans flex flex-row">
        <label
          className={`plan basic-plan ${selectedMethod === "online" ? "active" : ""}`}
          htmlFor="online"
        >
          <input
            checked={selectedMethod === "online"}
            onChange={handleMethodChange}
            type="radio"
            name="paymentMethod"
            id="online"
          />
          <div className="plan-content">
            <div className="plan-details">
              <span>Pay online</span>
              <p>Pay securely using card payment or by using UPI</p>
              <div className="flex items-center">
                <Image src={visa} width={50} alt="visa" />
                <Image src={rupe} width={50} alt="rupe" />
                <Image src={mastercard} width={50} alt="mastercard" />
                <Image src={phonepe} width={50} alt="phonepe" />
                <Image src={gpay} width={50} alt="gpay" />
              </div>
            </div>
          </div>
        </label>

        <label
          className={`plan complete-plan ${selectedMethod === "cod" ? "active" : ""}`}
          htmlFor="cod"
        >
          <input
            checked={selectedMethod === "cod"}
            onChange={handleMethodChange}
            type="radio"
            id="cod"
            name="paymentMethod"
          />
          <div className="plan-content">
            <Image src={cash} alt="" width={100} />
            <div className="plan-details">
              <span>Cash On Delivery</span>
              <p>Pay with cash or online UPI when you receive your order.</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default PaymentMethod;
