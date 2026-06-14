// Convention used here (and on the server):
//   "domain:action"  — client→server commands  (room:join, room:leave)
//   "domain:actioned" — server→client responses (room:joined, room:updated)
export const SocketEvent = {
  Chat: {
    SEND: 'chat:send',
    MESSAGE: 'chat:message',
  },
  Rooms: {
    CREATE: 'room:create',
    JOIN: 'room:join',
    REJOIN: 'room:rejoin',
    LEAVE: 'room:leave',
    UPDATE: 'room:update',

    CREATED: 'room:created',
    JOINED: 'room:joined',
    REJOINED: 'room:rejoined',
    LEFT: 'room:left',
    UPDATED: 'room:updated',
  },
} as const;
