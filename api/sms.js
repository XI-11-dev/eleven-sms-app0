// pages/api/sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, message } = req.body;

  const APIKEY = '0xEw5A56f648CdBeaef601bc2d42de491c1a58f2e';
  const ACCESS_TOKEN = '9ke3jkiGWsNkbkpY4cewSbBAdo4Buhna3i4F';

  // ✅ CORRECTED URL
  const url = 'https://api.didforsale.com/api/sms/send';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': APIKEY,
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
