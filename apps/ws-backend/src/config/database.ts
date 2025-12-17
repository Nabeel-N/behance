import { PrismaClient } from "@repo/db";

export class Database {
  private static instance: PrismaClient;
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
    return Database.instance;
  }
}
