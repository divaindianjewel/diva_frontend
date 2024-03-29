"use client";
import React, { useState } from "react";
import makePayment from "../phonepeApi";
import sha256 from "sha256";
import axios from "axios";


const PaymentForm = () => {
  const local_domain = "http://localhost:3000";
  const pro_domain = "https://divatheindianjewel.com";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [mu_id, setMu_id] = useState("");

  function generateRandomId(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const endpoint = "/pg/v1/pay";
  const phonePeUrl = "https://api.phonepe.com/apis/hermes";
  const merchantId = "M22VIIUXDMB7J";
  const saltId = "de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f";
  const saltKeyIndex = 1;
  const merchantTransactionId = generateRandomId(10);
  const userId = 1234;

  

  return (
    <div>
      <form
        onSubmit={(e) => {
          makePayment(e);
        }}
        method="post"
      >
        <input
          onChange={(e) => {
            setName(e.target.value);
            // console.log(name);
          }}
          type="text"
          placeholder="entre name"
        />
        <input
          onChange={(e) => {
            let value = Number(e.target.value);
            setPhone(value);
            // console.log(phone);
          }}
          type="number"
          placeholder="enter phone number"
        />
        <input
          onChange={(e) => {
            let value = Number(e.target.value);
            setAmount(value);
            // console.log(amount);
          }}
          type="number"
          placeholder="enter amount"
        />
        <input
          onChange={(e) => {
            setMu_id(e.target.value);
            // console.log(mu_id);
          }}
          type="text"
          placeholder="enter mu-id"
        />
        <button> submit </button>
      </form>
    </div>
  );
};

export default PaymentForm;
