import { domain } from "@/components/backend/apiRouth";
import axios from "axios";
import { useRouter } from "next/navigation";
import sha256 from "sha256";

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

const merchantId = "PGTESTPAYUAT";
const saltId = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltKeyIndex = 1;
const merchantTransactionId = generateRandomId(10);
const userId = 1234;

export const makePayment = async (router : any) => {
  const payload = {
    merchantId: merchantId,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: 100,
    redirectUrl: `http://localhost:3000/api/status/${merchantTransactionId}`,
    redirectMode: "POST",
    callbackUrl: `http://localhost:3000/api/status/${merchantTransactionId}`,
    mobileNumber: "957996842",
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

  const PAYMENT_URL =
    "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

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
  router.push(redirect);
};