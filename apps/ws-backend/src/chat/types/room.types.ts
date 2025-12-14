export interface CreateRoomDTO {
  userIds: number[];
}

export interface RoomResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: number;
    name: string | null;
    profilePhoto: string | null;
  }[];
  lastMessage?: {
    text: string;
    createdAt: Date;
  };
}
