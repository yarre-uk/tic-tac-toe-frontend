import { useEffect, useRef, useState } from 'react';

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
 * All actions use Socket.IO ack callbacks: socket.emit(event, payload, ackFn).
 * NestJS calls the ack when the handler returns a plain value (not { event, data }).
 *
 * Retry on reconnect:
 *   Every emit is registered in pendingEmits. When the ack fires the entry is
 *   removed. When socketVersion bumps (token refresh → new socket), the listeners
 *   effect replays all still-pending emits on the new socket.
 *
 * How errors reach the client:
 *   When a handler throws, NestJS's WsExceptionFilter emits an `exception` event.
 *   Token-expiry exceptions are handled by use-socket-connection and filtered here.
 *
 * How server broadcasts work (room:updated):
 *   The server calls client.to(roomId).emit(...) to notify everyone in the room
 *   except the sender. We listen with socket.on('room:updated', ...) to stay in sync.
 */
export function useRoom() {
  'use no memo';

  const { room, setRoom } = useRoomStore();
  const setRoomId = useProfileStore((s) => s.setRoomId);
  const socketVersion = useSocketStore((s) => s.version);

  const [error, setError] = useState<string | null>(null);
  const pendingEmits = useRef<Array<() => void>>([]);

  // Re-attach persistent listeners on reconnect, then replay any emits that
  // were in flight when the old socket was replaced.
  useEffect(() => {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    function onUpdated(updatedRoom: Room) {
      setRoom(updatedRoom);
    }

    function onException(wsError: WsError) {
      // Token expiry is handled upstream in use-socket-connection.
      if (wsError.message === 'Token is invalid or expired') {
        return;
      }

      const message =
        typeof wsError.message === 'string'
          ? wsError.message
          : JSON.stringify(wsError.message);

      setError(message);
      console.error('[useRoom]', message);
    }

    socket.on(SocketEvent.Rooms.UPDATED, onUpdated);
    socket.on('exception', onException);

    pendingEmits.current.forEach((attempt) => attempt());

    return () => {
      socket.off(SocketEvent.Rooms.UPDATED, onUpdated);
      socket.off('exception', onException);
    };
  }, [setRoom, socketVersion]);

  function clearError() {
    setError(null);
  }

  function emitWithRetry<T>(
    event: string,
    payload: unknown,
    onAck: (data: T) => void,
  ): void {
    clearError();

    function attempt() {
      const socket = getSocket();

      if (!isDefined(socket)) {
        return;
      }

      socket.emit(event, payload, (data: T) => {
        const idx = pendingEmits.current.indexOf(attempt);

        if (idx !== -1) {
          pendingEmits.current.splice(idx, 1);
        }

        onAck(data);
      });
    }

    pendingEmits.current.push(attempt);
    attempt();
  }

  function create(payload: CreateRoomPayload = {}) {
    emitWithRetry<Room>(SocketEvent.Rooms.CREATE, payload, (created) => {
      setRoom(created);
      setRoomId(created.id);
    });
  }

  function join(roomId: string) {
    const payload: JoinRoomPayload = { roomId };

    emitWithRetry<Room>(SocketEvent.Rooms.JOIN, payload, (joined) => {
      setRoom(joined);
      setRoomId(joined.id);
    });
  }

  /**
   * Rejoins an existing room after a page reload or socket reconnect.
   * Unlike join(), this does not modify the DB — it only re-registers the
   * socket into the Socket.IO room.
   */
  function rejoin(roomId: string) {
    emitWithRetry<Room>(SocketEvent.Rooms.REJOIN, { roomId }, (joined) => {
      setRoom(joined);
      setRoomId(joined.id);
    });
  }

  /**
   * Updates the room name. The ack returns the updated room for the sender;
   * the persistent room:updated listener handles the update for other players.
   */
  function update(name: string) {
    if (!isDefined(room)) {
      return;
    }

    emitWithRetry<Room>(
      SocketEvent.Rooms.UPDATE,
      { roomId: room.id, data: { name } },
      (updated) => {
        setRoom(updated);
      },
    );
  }

  function leave() {
    emitWithRetry<null>(SocketEvent.Rooms.LEAVE, {}, () => {
      setRoom(null);
      setRoomId(null);
    });
  }

  return { room, create, join, rejoin, update, leave, error, clearError };
}
