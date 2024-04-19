// pages/api/proxy.js
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const PAYMENT_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

  const { request, checksum } = req.body;

  try {
    const response = await axios.post(
      PAYMENT_URL,
      { request: request },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy error" });
  }
}