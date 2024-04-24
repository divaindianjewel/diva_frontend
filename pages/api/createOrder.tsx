export default async function handler(req : any, res : any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SHIPROCKET_ID}`
    };

    const shiprocketResponse = await fetch(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }
    );

    const shiprocketData = await shiprocketResponse.json();

    res.json(shiprocketData);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
