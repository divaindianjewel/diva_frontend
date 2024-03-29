"use server"

import { useRouter } from "next/navigation";
import sha256 from "sha256";
import axios from "axios";

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

const local_domain = "http://localhost:3000";
const pro_domain = "https://divatheindianjewel.com";

const endpoint = "/pg/v1/pay";
const phonePeUrl = "https://api.phonepe.com/apis/hermes";
const merchantId = "M22VIIUXDMB7J";
const saltId = "de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f";
const saltKeyIndex = 1;
const merchantTransactionId = generateRandomId(10);
const userId = 1234;

const makePayment = async (e: any) => {
  e.preventDefault();

  console.log("hello");

  const payload = {
    merchantId: merchantId,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: 100,
    redirectUrl: `${pro_domain}/api/status/${merchantTransactionId}`,
    redirectMode: "POST",
    callbackUrl: `${pro_domain}/api/status/${merchantTransactionId}`,
    mobileNumber: "9579896842",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  console.log(dataPayload);

  const dataBase64 = Buffer.from(dataPayload).toString("base64");
  console.log(dataBase64);

  const fullURL = dataBase64 + "/pg/v1/pay" + saltId;
  const dataSha256 = sha256(fullURL);

  const checksum = dataSha256 + "###" + saltKeyIndex;
  console.log("c====", checksum);

  const PAYMENT_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

  const response = await axios.post(
    PAYMENT_URL,
    {
      request: dataBase64,
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
    }
  );

  console.log(response);

  console.log("Hello 2");
  console.log("Hello 3");
};
export default makePayment;
