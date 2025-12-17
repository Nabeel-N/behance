import { prisma } from "..";

export class MessageRepo {
  constructor() {}

  async message(userId: number, roomId: number, text: string) {
    await prisma.message.create({
      data: {
        text: text,
        senderId: userId,
        roomId: roomId,
      },
    });
  }
}
