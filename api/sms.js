// pages/api/send-sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: 'Missing "to" or "text"' });
  }

  const from = '+18337753445'; // Your SMS-enabled number
  const apiKey = 'OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e';
  const accessToken = 'jtKJk7KHu6Jky661i1ZwR2aumr4ruE4tpvA';

  const authHeader = Buffer.from(`${apiKey}:${accessToken}`).toString('base64');

  const payload = {
    from,
    to,
    text,
    delivery_receipt: 'y'
  };

  try {
    const response = await fetch('https://api.didforsale.com/didforsaleapi/index.php/api/V4/SMS/SingleSend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
}
