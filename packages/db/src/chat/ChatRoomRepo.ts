import { prisma } from "..";

export class ChatRoomRepo {
  async getRoomParticipants(roomId: number) {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        users: {
          select: { id: true },
        },
      },
    });

    return room?.users || [];
  }
}
