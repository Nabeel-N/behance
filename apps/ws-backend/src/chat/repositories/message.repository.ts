import { prisma } from "@repo/db";

export class MessageRepository {
  async create(text: string, senderId: number, roomId: number) {
    return await prisma.message.create({
      data: {
        text: text,
        senderId: senderId,
        roomId: roomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
    });
  }

  async findroombyId(roomId: number, skip: number = 0, take: number = 0) {
    return await prisma.message.findMany({
      where: { roomId: roomId },
      skip: skip,
      take: take,
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
    });
  }
  async countByRoomId(roomId: number): Promise<number> {
    return prisma.message.count({
      where: { roomId: roomId },
    });
  }

  async deleteById(id: number) {
    return await prisma.message.delete({
      where: {
        id: id,
      },
    });
  }
}
