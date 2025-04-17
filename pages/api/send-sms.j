// pages/api/send-sms.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, text } = req.body;

  const formData = new URLSearchParams();
  formData.append('src', '+18337753445'); // Your ElevenSolutions number
  formData.append('dst', to);
  formData.append('msg', text);
  formData.append('userId', 'business@elevensolutions.info'); // ✅ Correct DIDForSale user ID
  formData.append('apiKey', 'OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e');
  formData.append('apiSecret', 'jtKJk7KHu6Jky661i1ZwR2aumr4ruE4tpvA');

  try {
    const response = await fetch('https://api.didforsale.com/didforsaleapi/index.php/api/V4/SMS/SingleSend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
}
