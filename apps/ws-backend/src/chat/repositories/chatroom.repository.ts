import { prisma } from "@repo/db";

export class ChatRoomRepository {
  async create(userIds: number[]) {
    return await prisma.chatRoom.create({
      data: {
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await prisma.chatRoom.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return await prisma.chatRoom.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findExistingRoom(userId1: number, userId2: number) {
    return await prisma.chatRoom.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId1 } } },
          { users: { some: { id: userId2 } } },
        ],
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
          },
        },
      },
    });
  }

  async isUserInRoom(roomId: number, userId: number): Promise<boolean> {
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: roomId,
        users: {
          some: { id: userId },
        },
      },
    });
    return !!room;
  }
}
