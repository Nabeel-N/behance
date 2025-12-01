import { PrismaClient } from "./generated/prisma/index";

export * from "./generated/prisma/index";

export const prisma = new PrismaClient();
