export interface CreateMessageDTO {
  text: string;
  senderId: number;
  roomId: number;
}

export interface MessageResponse {
  id: number;
  text: string;
  senderId: number;
  roomId: number;
  createdAt: Date;
  sender: {
    id: number;
    name: string | null;
    profilePhoto: string | null;
  };
}

export interface WebSocketMessage {
  type: "join_room" | "leave_room" | "send_message" | "typing" | "get_history";
  payload: any;
}