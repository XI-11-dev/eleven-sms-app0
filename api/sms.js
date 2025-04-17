// /pages/api/sms.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const username = process.env.DFS_USERNAME;
  const password = process.env.DFS_PASSWORD;

  if (!username || !password) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  const url = `https://www.didforsale.com/smsapi/sendmsg.php?user=${username}&password=${password}&sender=${from}&mobile=${to}&message=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
}
