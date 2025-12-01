import { PrismaClient } from "./generated/prisma";
export * from "./generated/prisma/index";
export const prisma = new PrismaClient();
