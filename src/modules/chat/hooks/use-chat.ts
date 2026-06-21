import { useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '../types';

import { SocketEvent } from '@/constants/socket-events';
import { apiAuth, emitWithRetry, getSocket, isDefined } from '@/lib';
import { useSocketStore } from '@/modules/auth/socket-store';
import type { ApiResult } from '@/types';

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const socketVersion = useSocketStore((s) => s.version);
  const pendingEmits = useRef<Array<() => void>>([]);

  useEffect(() => {
    apiAuth
      .get<ApiResult<Array<ChatMessage>>>(`/chat/${roomId}/messages`)
      .then((res) => setMessages(res.data.data))
      .catch(() => null);
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    if (!isDefined(socket)) {
      return;
    }

    function onMessage(message: ChatMessage) {
      setMessages((prev) => [...prev, message]);
    }

    socket.on(SocketEvent.Chat.MESSAGE, onMessage);

    // Replay any sends that were in-flight when the socket was replaced
    // (token refresh) or the server restarted and onConnect fired.
    // Note: unlike room operations, message retries are not idempotent —
    // if the server processed the message but the ack packet was lost,
    // the retry will duplicate it. Acceptable for a game chat.
    pendingEmits.current.forEach((attempt) => attempt());

    return () => {
      socket.off(SocketEvent.Chat.MESSAGE, onMessage);
    };
  }, [socketVersion]);

  function send(text: string) {
    if (text.trim() === '') return;

    emitWithRetry<ChatMessage>(
      pendingEmits,
      SocketEvent.Chat.SEND,
      { roomId, content: text },
      (message) => {
        setMessages((prev) => [...prev, message]);
      },
    );
  }

  return { messages, send };
}
