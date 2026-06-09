// Mirror of the backend's socket-events.ts constant.
// Keeping event names in one place prevents typos and makes renaming trivial.
//
// Convention used here (and on the server):
//   "domain:action"  — client→server commands  (room:join, room:leave)
//   "domain:actioned" — server→client responses (room:joined, room:updated)
export const SocketEvent = {
  Rooms: {
    // --- Client → Server (commands) ---
    CREATE: 'room:create',
    JOIN: 'room:join',
    LEAVE: 'room:leave',
    UPDATE: 'room:update',

    // --- Server → Client (responses / broadcasts) ---
    // CREATED, JOINED, LEFT come back as acknowledgement payloads (acks),
    // not as separate event listeners. The server returns them from the handler.
    CREATED: 'room:created',
    JOINED: 'room:joined',
    LEFT: 'room:left',
    // UPDATED is broadcast to every socket in the room when state changes
    // (e.g. another player joined or left). We listen for this with socket.on().
    UPDATED: 'room:updated',
  },
} as const;
