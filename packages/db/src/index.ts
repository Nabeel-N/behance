// 👇 Add ".js" here
import { PrismaClient } from "./generated/prisma/index.js";
import { MessageRepo} from "./chat/MessageRepo.js";

export * from "./generated/prisma/index.js";
export * from "./chat/MessageRepo.js";

export const prisma = new PrismaClient();
