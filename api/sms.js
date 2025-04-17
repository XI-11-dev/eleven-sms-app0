export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, message } = req.body;

  const APIKEY = "0eEw5A6f648c0Beaacf601bc2d42ed911c5a587e";
  const ACCESS_TOKEN = "9ke3jki6WsNkkbY4cev5bBAdo8u6Puhna3i4rF";

  const url = "https://api.didforsale.com/api/sms/send";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: APIKEY,
        accessToken: ACCESS_TOKEN,
      },
      body: JSON.stringify({
        source: from,
        destination: to,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DidForSale Error Response:', data); // log error from DidForSale
      return res.status(500).json({ error: 'Failed to send SMS', details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server Error:', error); // log unhandled errors
    return res.status(500).json({ error: 'Request failed', details: error.message });
  }
}
