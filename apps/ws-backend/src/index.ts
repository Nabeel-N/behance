import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { MessageHandler } from "./classes/chat";

const app = express();
const port = 8080;


const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("message", async (data: string) => {
    try {
      const parsedData = JSON.parse(data.toString());

      const { content, userId, roomId } = parsedData;

      const messageHandler = new MessageHandler(content, ws, userId, roomId);

      await messageHandler.save();

      console.log("Message processed:", content);

      ws.send(JSON.stringify({ status: "sent", content }));
    } catch (e) {
      console.error("Error processing message:", e);
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Welcome to the WebSocket server!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
