const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Client connected");

  clients.add(ws);

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);

    parsedMessage.timestamp = new Date().toLocaleTimeString();

    console.log(parsedMessage);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    clients.delete(ws);
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server running");
});

const PORT = 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});