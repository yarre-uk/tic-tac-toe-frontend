export type RoomStatus = 'Waiting' | 'Playing';

export interface RoomPlayer {
  id: string;
  nickname: string;
}

export interface Room {
  id: string;
  name: string | null;
  status: RoomStatus;
  ownerId: string;
  players: Array<RoomPlayer>;
  createdAt: Date;
}

export interface CreateRoomPayload {
  name?: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

export interface RoomAck {
  event: string;
  data?: Room;
}

export interface WsError {
  status: 'error';
  message: string | Record<string, unknown>;
}
