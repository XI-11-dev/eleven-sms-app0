const axios = require('axios');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const response = await axios.post('https://www.didforsale.com/smsapi/send', null, {
        params: {
          apikey: 'OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e',  // 
          from,
          to,
          text: message,
        },
      });

      return res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send SMS', details: error.response?.data || error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
