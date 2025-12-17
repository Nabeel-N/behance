import { WebSocketServer } from "ws";
import { ChatManager } from "./ChatManager";
import url from "url";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });
const chatManager = new ChatManager();
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_SUPER_SECRET_KEY";

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }
    return decoded.id;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, req) {
  const token = url.parse(req.url || "", true).query.token;
  const userId = checkUser(token as string);

  if (!userId) {
    ws.close();
    return;
  }

  console.log(`User ${userId} connected`);

  chatManager.addUser(Number(userId), ws);

  ws.on("close", () => {
    chatManager.removeUser(Number(userId), ws);
  });
});

console.log("WebSocket server started on ws://localhost:8080");
