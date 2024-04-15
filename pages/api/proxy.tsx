// pages/api/proxy.js
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 const PAYMENT_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay'; // Placeholder URL

 // Extract the checksum from the request body
 const { request, checksum } = req.body;

 try {
    // Forward the request to the external API with the checksum in the headers
    const response = await axios.post(PAYMENT_URL, request, {
      headers: {
        ...req.headers,
        'X-VERIFY': checksum, // Use the checksum from the request body
      },
    });

    // Forward the response back to the client
    res.status(response.status).json(response.data);
 } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
 }
}
