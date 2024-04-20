import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function POST(req: any, res: any) {
  const local_domain = "http://localhost:3000";
  const pro_domain = "https://divatheindianjewel.com";

  const data = await req.formData();
  console.log(data);
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const merchantTransactionId = data.get("merchantTransactionId");

  const salt_key = 'de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f';

  const st = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
  const dataSha256 = sha256(st);

  const checksum = dataSha256 + "###" + 1;
  console.log(checksum);

  const url = "https://api.phonepe.com/apis/hermes/pg/v1/status";

  const options = {
    method: "GET",
    url: `${url}/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT STATUS
  const response = await axios.request(options);
  console.log("r===", response.data.code);

  if (response.data.code == "PAYMENT_SUCCESS") {
    return NextResponse.redirect(`${local_domain}/success`, {
      status: 301,
    });
  } else
    return NextResponse.redirect(`${local_domain}/fail`, {
      status: 301,
    });
}
