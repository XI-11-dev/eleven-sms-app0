// pages/api/send-sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body;

  const payload = {
    from: "18337753445", // Your DIDForSale number
    to,
    text,
  };

  try {
    const response = await fetch("https://api.didforsale.com/didforsaleapi/index.php/api/V4/SMS/SingleSend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic T2VFc3d6QTU2ZjY0OGNkOGVhYWZjNjFiYzJkNGVkMWE5MWMxYTVhODdlOnlLQ2c2eUYxUUFPeTBPazVwSktONjdMVURhVjVjMlZEWHE0"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
}
