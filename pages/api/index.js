const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// 📦 Database setup
const db = new sqlite3.Database("./messages.db");
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT,
  from_number TEXT,
  to_number TEXT,
  timestamp TEXT,
  direction TEXT
)`);

// 🔐 DIDForSale credentials
const apiKey = "OeEswzA56f648cd8eaafc61bc2d4ed1a91c1a5a87e";
const accessToken = "jtKJk7KHu6Jky661i1ZwR2aumr4ruE4tpvA";
const fromNumber = "18337753445";

// 📩 Incoming SMS
app.post("/api/incoming-sms", (req, res) => {
  const smsData = req.body;
  console.log("📩 Incoming SMS received:", smsData);

  const text = smsData.text || "";
  const from = smsData.from || "";
  const toRaw = smsData.to;
  const to =
    Array.isArray(toRaw) && toRaw.length > 0
      ? toRaw[0]
      : typeof toRaw === "string"
        ? toRaw
        : "";

  const timestamp = smsData.timestamp || new Date().toISOString();

  db.run(
    `INSERT INTO messages (text, from_number, to_number, timestamp, direction) VALUES (?, ?, ?, ?, ?)`,
    [text, from, to, timestamp, "incoming"],
    function (err) {
      if (err) {
        console.error("❌ DB Insert Error:", err.message);
        return res.status(500).json({ error: "Failed to save message" });
      }
      console.log("✅ Incoming SMS stored with ID:", this.lastID);
      res.status(200).json({ success: true, message: "Message stored", id: this.lastID });
    }
  );
});

// 📤 Outgoing SMS
app.post("/api/send-sms", async (req, res) => {
  const { to, message } = req.body;

  const payload = {
    from: fromNumber,
    to,
    text: message,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Basic " + Buffer.from(`${apiKey}:${accessToken}`).toString("base64"),
  };

  const url =
    "https://api.didforsale.com/didforsaleapi/index.php/api/V4/SMS/SingleSend";

  try {
    const response = await axios.post(url, payload, { headers });
    console.log("✅ SMS sent:", response.data);

    const timestamp = new Date().toISOString();
    db.run(
      `INSERT INTO messages (text, from_number, to_number, timestamp, direction) VALUES (?, ?, ?, ?, ?)`,
      [message, fromNumber, to, timestamp, "outgoing"],
      function (err) {
        if (err) {
          console.error("❌ Failed to store sent message:", err.message);
        } else {
          console.log("📤 Outgoing SMS stored with ID:", this.lastID);
        }
      }
    );

    res.json({ status: "Message sent!", data: response.data });
  } catch (error) {
    console.error("❌ Error from DIDForSale:", error.response?.data || error.message);
    res.status(500).json({
      status: "Failed to send",
      error: error.response?.data || error.message,
    });
  }
});

// 📚 Get all messages
app.get("/api/messages", (req, res) => {
  db.all(`SELECT * FROM messages ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) {
      console.error("❌ Failed to fetch messages:", err.message);
      return res.status(500).json({ error: "Could not fetch messages" });
    }
    res.json(rows);
  });
});

// 🌐 Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
