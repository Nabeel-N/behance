class ChatLogger {
  private static instance: ChatLogger;
  private constructor() {}
  public static getInstance(): ChatLogger {
    if (!ChatLogger.instance) {
      ChatLogger.instance = new ChatLogger();
    }
    return ChatLogger.instance;
  }

  info(message: string, meta?: any) {
    console.log(
      `[CHAT-INFO] ${new Date().toISOString()} - ${message}`,
      meta || ""
    );
  }

  error(message: string, error?: any) {
    console.error(
      `[CHAT-ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  }

  warn(message: string, meta?: any) {
    console.warn(
      `[CHAT-WARN] ${new Date().toISOString()} - ${message}`,
      meta || ""
    );
  }
}
export const chatLogger = ChatLogger.getInstance();
