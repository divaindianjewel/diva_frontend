import axios from "axios";
import sha256 from "crypto-js/sha256";
import { domain } from "@/components/backend/apiRouth";

// Function to generate a random ID
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

export async function MakePayment(router: any) {
  const merchantTransactionId = generateRandomId(10);

  const payload = {
    merchantId: "M22VIIUXDMB7J",
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 1234,
    amount: 100,
    redirectUrl: "https://webhook.site/redirect-url",
    redirectMode: "REDIRECT",
    callbackUrl: "https://webhook.site/callback-url",
    mobileNumber: "957996842",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");
  const fullURL =
    dataBase64 + "/pg/v1/pay" + "de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f";
  const dataSha256 = sha256(fullURL).toString(); // Ensure you have a sha256 function
  const checksum = dataSha256 + "###" + 1; // Assuming saltKeyIndex is a constant
  const UAT_PAY_API_URL = "/api/proxy";

  const response = await axios.post(UAT_PAY_API_URL, {
    request: dataBase64,
    checksum: checksum,
  });

  const redirect = response.data.data.instrumentResponse.redirectInfo.url;
  router.push(redirect);
}
