import WebSocket from "ws";
import { INIT_ROOM, JOIN_ROOM } from "./message";
import { MessageRepo } from "@repo/db";

export class ChatManager {
  private static MessageRepo: MessageRepo;
  private users: Map<number, WebSocket[]>;

  constructor() {
    ChatManager.MessageRepo = new MessageRepo();
    this.users = new Map();
  }

  addUser(userId: number, socket: WebSocket) {
    this.users.set(userId, []);
    this.addHandler(socket, userId);
  }

  removeUser(userId: number, socket: WebSocket) {
    this.users.delete(userId);
  }

  private addHandler(socket: WebSocket, userId: number) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_ROOM) {
      }

      if (message.type === JOIN_ROOM) {
        const roomId = message.roomId;
        const text = message.text;
        const userId = message.userId;
        const MessageRepo = ChatManager.MessageRepo;
        MessageRepo.message(userId, roomId, text);
      }
    });
  }
}
