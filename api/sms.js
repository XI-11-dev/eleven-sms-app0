// pages/api/sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, message } = req.body;

  const APIKEY = "OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e";
  const ACCESS_TOKEN = "9kejjaVGshWkbY4eve5dbA8o64ubna3Ni4f";

  const url = "https://www.didforsale.com/api/sms/send-sms";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': APIKEY,
        'accessToken': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        source: from,
        destination: to,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send SMS', details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Request failed', details: error.message });
  }
}
