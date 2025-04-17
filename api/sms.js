import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiUrl = 'https://www.didforsale.com/api/sendsms';
  const apiKey = 'OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e';
  const accessToken = '9kejjaVGshWkbY4eve5dbA8o64ubna3Ni4f';

  try {
    const response = await axios.post(apiUrl, null, {
      params: {
        src: from,
        dst: to,
        msg: message,
        apikey: apiKey,
        accesstoken: accessToken,
      },
    });

    if (response.data && response.data.status === 'success') {
      res.status(200).json({ success: true, data: response.data });
    } else {
      res.status(500).json({ error: 'Failed to send SMS', details: response.data });
    }
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to send SMS',
      details: error?.response?.data || error.message,
    });
  }
}
