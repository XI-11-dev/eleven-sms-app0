module.exports = function handler(req, res) {
  if (req.method === 'POST') {
    const { from, to, message } = req.body;

    // Basic validation
    if (!from || !to || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simulate SMS handling
    console.log(`SMS from ${from} to ${to}: ${message}`);

    return res.status(200).json({ success: true, message: 'SMS received' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
