import { WebSocket } from "ws";
import { prisma } from "@repo/db";

export class MessageHandler {
  public text: string;
  public ws: WebSocket;
  public userId: number;
  public roomId: number;

  constructor(text: string, ws: WebSocket, userId: number, roomId: number) {
    this.text = text;
    this.ws = ws;
    this.userId = userId;
    this.roomId = roomId;
  }

  async save() {
    if (typeof this.text !== "string" || this.text.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }

    try {
      const data = await prisma.message.create({
        data: {
          text: this.text,
          roomId: this.roomId,
          senderId: this.userId,
        },
      });

      console.log("Message saved:", data.id);
      return data;
    } catch (e) {
      console.error("DB Error:", e);
      throw new Error("Failed to save message");
    }
  }
}
