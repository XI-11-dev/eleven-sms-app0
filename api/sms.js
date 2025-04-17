// pages/api/sms.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const DIDFORSLAE_SMS_URL = "https://www.didforsale.com/api/sendSMS";
const AUTH_TOKEN = process.env.DFS_AUTH_TOKEN || ""; // Make sure this is set in Vercel

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      src: from,
      dst: to,
      text: message,
      token: AUTH_TOKEN,
    };

    const dfsResponse = await axios.post(DIDFORSLAE_SMS_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ success: true, data: dfsResponse.data });
  } catch (error: any) {
    console.error("SMS API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to send SMS",
      details: error.response?.data || error.message,
    });
  }
}
