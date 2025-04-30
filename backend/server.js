const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const puppeteerService = require("./services/puppeteerService");
const cors = require('cors');

const app = express();
// Enable CORS for all routes (or configure more strictly)
app.use(cors());
app.use(bodyParser.json());

// Endpoint to start automation
app.post("/automate", async (req, res) => {
  try {
    const { url, instructions, config } = req.body;
    const results = await puppeteerService.startAutomation(
      url,
      instructions,
      config
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for automation status
app.get("/status", (req, res) => {
  res.json({ status: "in-progress" });
});

// Endpoint for extracted results
app.get("/results", (req, res) => {
  res.json({ data: [] });
});

const server = app.listen(3001, () => {
  console.log("Backend server running on port 3001");
});

// WebSocket for real-time updates
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received: %s", message);
  });
  ws.send(JSON.stringify({ message: "Connected to WebSocket" }));
});
