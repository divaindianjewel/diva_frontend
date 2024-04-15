// path/to/your/paymentFunction.js
import { useRouter } from 'next/router';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';

// Function to generate a random ID
export function generateRandomId(length: number): string {
 const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 let result = '';
 const charactersLength = characters.length;
 for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

// Main MakePayment function
export async function MakePayment(router : any) {
 const domain = 'your_domain_here'; // Replace with your actual domain

 const merchantTransactionId = generateRandomId(10);

 const payload = {
    merchantId: 'M22VIIUXDMB7J',
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 1234,
    amount: 100,
    redirectUrl: `${domain}/api/status/${merchantTransactionId}`,
    redirectMode: 'POST',
    callbackUrl: `${domain}/api/status/${merchantTransactionId}`,
    mobileNumber: '957996842',
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
 };

 const dataPayload = JSON.stringify(payload);
 const dataBase64 = Buffer.from(dataPayload).toString('base64');
 const fullURL = dataBase64 + '/pg/v1/pay' + 'de5e9ea0-e6f5-4eca-860b-6e3c25c30d3f';
 const dataSha256 = sha256(fullURL).toString(); // Ensure you have a sha256 function
 const checksum = dataSha256 + '###' + 1; // Assuming saltKeyIndex is a constant

 try {
    const response = await axios.post(
      '/api/proxy',
      {
        request: dataBase64,
        checksum: checksum,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Proxy response:', response.data); // Log the proxy response

    // Validate the response structure
    if (response.data && response.data.data && response.data.data.instrumentResponse) {
      const redirect = response.data.data.instrumentResponse.redirectInfo.url;
      router.push(redirect);
    } else {
      console.error('Unexpected response structure:', response.data);
      // Handle the error appropriately, e.g., show an error message to the user
    }
 } catch (error) {
    console.error('Payment error:', error);
    // Handle the error appropriately, e.g., show an error message to the user
 }
}
