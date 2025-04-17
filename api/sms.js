const axios = require('axios');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post('https://www.didforsale.com/smsapi/send_sms.php', null, {
      params: {
        json: 1,
        apikey: process.env.DFS_API_KEY,
        from,
        to,
        text: message,
      },
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.response?.data || error.message,
    });
  }
};
