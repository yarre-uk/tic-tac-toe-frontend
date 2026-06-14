import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import { Envs } from './env';

let socket: Socket | null = null;

/**
 * Opens a WebSocket connection to the backend and returns the socket instance.
 *
 * Socket.IO works in two layers:
 *   1. Transport — an HTTP upgrade to WebSocket (or long-polling as a fallback).
 *   2. Namespace — a logical channel on top of the transport. The backend gateway
 *      is registered on the "/ws" namespace (@WebSocketGateway({ namespace: '/ws' })).
 *      Appending "/ws" to the URL is how socket.io-client selects that namespace.
 *
 * Authentication:
 *   The `auth` option is sent as part of the Socket.IO handshake — the initial
 *   HTTP request that upgrades to WebSocket. On the server, the NestJS WsAuthGuard
 *   reads it from `client.handshake.auth.token`. This happens before any message
 *   handlers run, so the token is available for every subsequent event.
 *
 *   Note: the guard runs per-message (not on connection), so an invalid token
 *   won't block the connection itself — the server will reject individual events.
 */
export function connectSocket(token: string): Socket {
  // Guard against creating a second connection when the token refreshes.
  // socket.connected is true only after the transport handshake succeeds.
  if (socket?.connected) {
    return socket;
  }

  // If a previous socket exists but is disconnected (e.g. after a network drop),
  // clean it up before creating a new one to avoid event listener leaks.
  socket?.removeAllListeners();

  socket = io(`${Envs.VITE_WS_URL}`, {
    // Passed verbatim into the Socket.IO handshake request body.
    // Server reads this as: client.handshake.auth.token
    auth: { token },

    // autoConnect: true — the socket starts connecting immediately when io() is called.
    // Set to false if you want to defer the connection and call socket.connect() manually.
    autoConnect: true,

    // withCredentials mirrors the axios withCredentials flag: it allows the browser
    // to send cookies on the upgrade HTTP request. Needed if your backend sets
    // a refresh-token cookie during the WebSocket handshake.
    withCredentials: true,
  });

  // TODO: validate connection — add listeners for 'connect_error' and 'exception'
  // to catch auth failures (expired or blacklisted token) and trigger logout.
  // Example:
  //   socket.on('connect_error', (err) => {
  //     if (err.message === 'Token is invalid or expired') authStore.getState().setAccessToken(null);
  //   });
  //   socket.on('exception', (err) => { ... });

  return socket;
}

/**
 * Closes the WebSocket connection and clears the module-level instance.
 * Call this on logout so the server can clean up the socket's room memberships.
 */
export function disconnectSocket(): void {
  // socket.disconnect() sends a disconnect packet and closes the transport.
  // Without it, the server keeps the socket alive until its own timeout fires
  // (the backend has a 60s grace period before auto-leaving rooms).
  socket?.disconnect();
  socket = null;
}

/**
 * Returns the current socket instance, or null if not connected.
 *
 * Use this in hooks like useOnlineGame to send and receive events
 * without passing the socket through props or context.
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Emits a Socket.IO event with an ack callback and registers the attempt in
 * `pendingEmits` so it can be replayed on reconnect.
 *
 * When the ack fires the attempt is removed from the list. When the socket
 * is replaced (token refresh or server restart), the caller's effect should
 * replay `pendingEmits.current` on the new socket — covering all in-flight
 * emits that never received an ack.
 */
export function emitWithRetry<T>(
  pendingEmits: { current: Array<() => void> },
  event: string,
  payload: unknown,
  onAck: (data: T) => void,
): void {
  function attempt() {
    const s = getSocket();
    if (!s) return;

    s.emit(event, payload, (data: T) => {
      const idx = pendingEmits.current.indexOf(attempt);
      if (idx !== -1) pendingEmits.current.splice(idx, 1);
      onAck(data);
    });
  }

  pendingEmits.current.push(attempt);
  attempt();
}
