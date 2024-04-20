import axios from "axios";
import sha256 from "crypto-js/sha256";

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

export async function MakePayment(router: any, amount: number) {
  const merchantTransactionId = generateRandomId(10);
  const salt_key = process.env.NEXT_PUBLIC_PHONEPE_SALT;

  const payload = {
    merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 1234,
    amount: 100 * amount,
    redirectUrl: `https://divatheindianjewel.com/api/status/${merchantTransactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: `https://divatheindianjewel.com/api/status/${merchantTransactionId}`,
    mobileNumber: "957996842",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const dataPayload = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataPayload).toString("base64");
  const fullURL =
    dataBase64 + "/pg/v1/pay" + salt_key;
  const dataSha256 = sha256(fullURL).toString(); 
  const checksum = dataSha256 + "###" + 1; 
  const UAT_PAY_API_URL = "/api/proxy";

  const response = await axios.post(UAT_PAY_API_URL, {
    request: dataBase64,
    checksum: checksum,
  });

  const redirect = response.data.data.instrumentResponse.redirectInfo.url;
  router.push(redirect);
}