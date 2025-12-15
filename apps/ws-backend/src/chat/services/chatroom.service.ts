import { ChatRoomRepository } from "../repositories/chatroom.repository";
import { chatLogger } from "../../utils/chat.logger";

export class ChatRoomService {
  constructor(private chatRoomrepo: ChatRoomRepository) {}
  async createRoom(userIds: number[]) {
    if (!userIds || userIds.length < 2) {
      throw new Error("At least 2 users required to create a chat room");
    }
    const uniqueuserIds = Array.from(new Set(userIds));
    if (uniqueuserIds.length === 2) {
      const existingroom = await this.chatRoomrepo.findExistingRoom(
        uniqueuserIds[0] as number,
        uniqueuserIds[1] as number
      );
      if (existingroom) {
        chatLogger.info(`Returning existing room ${existingroom.id}`);
        return existingroom;
      }
    }
    chatLogger.info(
      `Creating new room with users: ${uniqueuserIds.join(", ")}`
    );
    return this.chatRoomrepo.create(uniqueuserIds);
  }

  async getRoomsByUser(userId: number) {
    return await this.chatRoomrepo.findByUserId(userId);
  }

  async getRoomById(roomId: number, userId: number) {
    const room = await this.chatRoomrepo.findById(roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const isUserInRoom = room.users.some((user) => user.id === userId);
    if (!isUserInRoom) {
      throw new Error("You are not a member of this room");
    }

    return room;
  }

  async verfiyUserinRoom(roomId: number, userId: number) {
    return await this.chatRoomrepo.isUserInRoom(roomId, userId);
  }
}
