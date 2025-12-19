import { prisma } from "..";

export class MessageRepo {
  constructor() {}

  async message(userId: number, roomId: number, text: string) {
    const message = await prisma.message.create({
      data: {
        text: text,
        senderId: userId,
        roomId: roomId,
      },
    });
    return message;
  }
}
