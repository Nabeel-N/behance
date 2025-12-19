import WebSocket from "ws";
import { JOIN_ROOM, SEND_MESSAGE } from "./message";
import { MessageRepo } from "@repo/db";
import { ChatRoomRepo } from "@repo/db";

export class ChatManager {
  private MessageRepo: MessageRepo;
  private ChatRoomRepo: ChatRoomRepo;
  private users: Map<number, WebSocket[]>;

  constructor() {
    this.MessageRepo = new MessageRepo();
    this.ChatRoomRepo = new ChatRoomRepo();
    this.users = new Map();
  }

  addUser(userId: number, socket: WebSocket) {
    if (!this.users.has(userId)) {
      this.users.set(userId, []);
    }
    this.users.get(userId)?.push(socket);
    this.addHandler(socket, userId);
  }

  removeUser(userId: number, socket: WebSocket) {
    const userSockets = this.users.get(userId);
    if (userSockets) {
      const remainingsockets = userSockets.filter((s) => s !== socket);
      if (remainingsockets.length === 0) {
        this.users.delete(userId);
      } else {
        this.users.set(userId, remainingsockets);
      }
    }
  }

  private addHandler(socket: WebSocket, userId: number) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === JOIN_ROOM) {
        const roomId = message.roomId;
        console.log(`User ${userId} joined room ${roomId}`);
        socket.send(
          JSON.stringify({
            type: "JOINED_ROOM",
            payload: {
              roomId: roomId,
              status: "success",
            },
          })
        );
      }

      if (message.type === SEND_MESSAGE) {
        const roomId = message.roomId;
        const text = message.text;
        const messagedb = await this.MessageRepo.message(userId, roomId, text);
        const participants =
          await this.ChatRoomRepo.getRoomParticipants(roomId);
        participants.forEach((user) => {
          const userSockets = this.users.get(user.id);
          if (userSockets) {
            userSockets.forEach((ws) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: "NEW_MESSAGE",
                    payload: {
                      id: messagedb.id,
                      text: messagedb.text,
                      senderId: userId,
                      roomId: roomId,
                      createdAt: messagedb.createdAt,
                    },
                  })
                );
              }
            });
          }
        });
      }
    });
  }
}
