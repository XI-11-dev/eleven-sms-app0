export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apikey = process.env.DFS_API_KEY;
  const accessToken = process.env.DFS_ACCESS_TOKEN;

  if (!apikey || !accessToken) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  const authHeader = `Basic ${Buffer.from(`${apikey}:${accessToken}`).toString('base64')}`;

  try {
    const response = await fetch("https://didforsaleapi/index.php/api/V4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        from,
        to,
        text: message
      })
    });

    const data = await response.json();
    res.status(response.status).json({ success: true, data });

  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
}
