// pages/api/payment.ts
import axios from "axios";
import sha256 from "sha256";
import type { NextApiRequest, NextApiResponse } from "next";
import { domain } from "@/components/backend/apiRouth";

export function generateRandomId(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function MakePayment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const merchantTransactionId = generateRandomId(10);

  const payload = {
    merchantId: 'M22VIIUXDMB7J',
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 1234, // Assuming this is a constant or you have a way to dynamically set it
    amount: 100,
    redirectUrl: `https://divatheindianjewel.com/api/status/${merchantTransactionId}`,
    redirectMode: "POST",
    callbackUrl: `http://divatheindianjewel.com/api/status/${merchantTransactionId}`,
    mobileNumber: "957996842",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");
  const fullURL =
    dataBase64 + "/pg/v1/pay" + 'de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f';
  const dataSha256 = sha256(fullURL);
  const checksum = dataSha256 + "###" + 1; // Assuming saltKeyIndex is a constant

  const PAYMENT_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

  try {
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

    const redirect = response.data.data.instrumentResponse.redirectInfo.url;
    res.status(200).json({ redirect });
  } catch (error) {
    console.error("Payment error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing payment." });
  }
}
