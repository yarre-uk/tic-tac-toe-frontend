import { useEffect, useState } from 'react';

import { useRoomStore } from '../store';
import type {
  CreateRoomPayload,
  JoinRoomPayload,
  Room,
  WsError,
} from '../types';

import { SocketEvent } from '@/constants/socket-events';
import { getSocket } from '@/lib/socket';
import { isDefined } from '@/lib/utils';
import { useSocketStore } from '@/modules/auth/socket-store';
import { useProfileStore } from '@/modules/profile/store';

/**
 * Provides room actions and subscribes to server-pushed room updates.
 *
 * Why we use socket.once() instead of ack callbacks:
 *   NestJS @SubscribeMessage handlers that return { event, data } do NOT call the
 *   ack callback — instead NestJS emits the named event to the client as a new
 *   message. So `socket.emit('room:create', payload, ackFn)` would leave `ackFn`
 *   uncalled even on success. We use socket.once(responseEvent, handler) to listen
 *   for exactly one occurrence of the response event then stop listening.
 *
 *   Summary:
 *     return data            → ack callback is called
 *     return { event, data } → client receives a new event named `event`
 *
 * How errors reach the client:
 *   When a handler throws, NestJS's WsExceptionFilter emits an `exception` event.
 *   We listen for it and surface it as `error` state.
 *
 * How server broadcasts work (room:updated):
 *   When someone else joins or leaves, the server calls client.to(roomId).emit(...)
 *   which sends the event to everyone in the Socket.IO room except the sender.
 *   We listen with socket.on('room:updated', ...) to keep our store in sync.
 */
export function useRoom() {
  'use no memo';

  const { room, setRoom } = useRoomStore();
  const setRoomId = useProfileStore((s) => s.setRoomId);
  const socketVersion = useSocketStore((s) => s.version);
  const [error, setError] = useState<string | null>(null);

  // Clear stale room state when the socket reconnects (token refresh creates a
  // new socket instance). This triggers the auto-rejoin effect in the game route.
  // room is read via getState() so it doesn't become a dep — we only want this
  // to fire on socketVersion changes, not on every room update.
  useEffect(() => {
    const unsubscribedRoom = useRoomStore.getState().room;

    if (!isDefined(unsubscribedRoom)) {
      return;
    }

    rejoin(unsubscribedRoom.id);
  }, [socketVersion]);

  useEffect(() => {
    const socket = getSocket();

    // Socket may be null if useRoom is rendered before useSocketConnection
    // has run (e.g. on an unauthenticated route). Safe to bail early.
    if (!isDefined(socket)) {
      return;
    }

    function onUpdated(updatedRoom: Room) {
      setRoom(updatedRoom);
    }

    function onException(wsError: WsError) {
      const message =
        typeof wsError.message === 'string'
          ? wsError.message
          : JSON.stringify(wsError.message);

      setError(message);
      console.error('[useRoom]', message);
    }

    socket.on(SocketEvent.Rooms.UPDATED, onUpdated);
    socket.on('exception', onException);

    return () => {
      socket.off(SocketEvent.Rooms.UPDATED, onUpdated);
      socket.off('exception', onException);
    };
  }, [setRoom, socketVersion]);

  function clearError() {
    setError(null);
  }

  /**
   * Creates a new room and joins it.
   * Listens once for room:created — the event NestJS emits from the handler's
   * `return { event: 'room:created', data }` return value.
   */
  function create(payload: CreateRoomPayload = {}) {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    clearError();

    // socket.once() registers a listener that fires exactly once and then removes
    // itself. This is the correct pattern for one-shot request/response over WS.
    socket.once(SocketEvent.Rooms.CREATED, (created: Room) => {
      setRoom(created);
      setRoomId(created.id);
    });

    socket.emit(SocketEvent.Rooms.CREATE, payload);
  }

  /**
   * Joins an existing room by ID.
   * Listens once for room:joined.
   */
  function join(roomId: string) {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    const payload: JoinRoomPayload = { roomId };

    clearError();

    socket.once(SocketEvent.Rooms.JOINED, (joined: Room) => {
      setRoom(joined);
      setRoomId(joined.id);
    });

    socket.emit(SocketEvent.Rooms.JOIN, payload);
  }

  /**
   * Rejoins an existing room after a page reload.
   * Unlike join(), this does not modify the DB — it only re-registers the new
   * socket into the Socket.IO room. Takes roomId explicitly because the room
   * store is empty after a reload.
   */
  function rejoin(roomId: string) {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    clearError();

    socket.once(SocketEvent.Rooms.REJOINED, (joined: Room) => {
      setRoom(joined);
      setRoomId(joined.id);
    });

    socket.emit(SocketEvent.Rooms.REJOIN, { roomId });
  }

  /**
   * Updates the room name. The response arrives as room:updated which the
   * persistent listener above already handles — no socket.once needed.
   */
  function update(name: string) {
    const socket = getSocket();
    if (!isDefined(socket) || !isDefined(room)) return;

    clearError();
    socket.emit(SocketEvent.Rooms.UPDATE, { roomId: room.id, data: { name } });
  }

  /**
   * Leaves the current room.
   * Listens once for room:left, then clears local state.
   */
  function leave() {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    clearError();

    socket.once(SocketEvent.Rooms.LEFT, () => {
      setRoom(null);
      setRoomId(null);
    });

    socket.emit(SocketEvent.Rooms.LEAVE);
  }

  return { room, create, join, rejoin, update, leave, error, clearError };
}
