// Mirrors RoomResponseDto and RoomPlayerDto from the backend.
// These are plain data shapes — no class methods, just what the server sends over the wire.

// Values match the Prisma RoomStatus enum on the backend.
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

// Payloads for commands we send to the server.

export interface CreateRoomPayload {
  name?: string;
}

export interface JoinRoomPayload {
  roomId: string;
}

// Shape of every acknowledgement the server sends back for room commands.
// The server always responds with { event, data? } from the @SubscribeMessage handler.
export interface RoomAck {
  event: string;
  data?: Room;
}

// Shape of the `exception` event emitted by NestJS's BaseWsExceptionFilter
// when a @SubscribeMessage handler throws. message can be a string or an object
// (e.g. validation errors from class-validator are returned as an array).
export interface WsError {
  status: 'error';
  message: string | Record<string, unknown>;
}
