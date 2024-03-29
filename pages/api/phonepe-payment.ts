import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { generateRandomId } from "@/utils/random";
import { Buffer } from "buffer";
import sha256 from "sha256";

const handler = async () => {
  const endpoint = "/pg/v1/pay";
  const phonePeUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox";
  const merchantId = "PGTESTPAYUAT";
  const saltId = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const saltKeyIndex = 1;
  const merchantTransactionId = generateRandomId(10);
  const userId = 1234;

  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId: userId,
    amount: 10000,
    redirectUrl: "/thank",
    redirectMode: "REDIRECT",
    mobileNumber: "9579896842",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
  const buffer63EncodedPayload = bufferObj.toString("base64");

  const xVerify =
    sha256(buffer63EncodedPayload + endpoint + saltId) + "###" + saltKeyIndex;

  const options = {
    method: "post",
    url: `${phonePeUrl}${endpoint}`,
    headers: {
      accept: "text/plain",
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
    },
    data: {
      request: buffer63EncodedPayload,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export default handler;
