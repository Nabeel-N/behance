import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const port = 8080;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });


wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("message", (data: string) => {
    const message = data.toString();
    console.log("Received:", message);

    ws.send(`Server received: ${message}`);


  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Send a welcome message
  ws.send("Welcome to the WebSocket server!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
