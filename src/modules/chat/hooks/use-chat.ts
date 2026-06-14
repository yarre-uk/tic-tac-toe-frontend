import { useEffect, useState } from 'react';

import type { ChatMessage } from '../types';

import { SocketEvent } from '@/constants/socket-events';
import { apiAuth } from '@/lib/axios';
import { getSocket } from '@/lib/socket';
import { isDefined } from '@/lib/utils';
import { useSocketStore } from '@/modules/auth/socket-store';
import type { ApiResult } from '@/types';

export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const socketVersion = useSocketStore((s) => s.version);

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

    return () => {
      socket.off(SocketEvent.Chat.MESSAGE, onMessage);
    };
  }, [socketVersion]);

  function send(text: string) {
    const socket = getSocket();
    if (!isDefined(socket) || text.trim() === '') {
      return;
    }

    socket.emit(
      SocketEvent.Chat.SEND,
      { roomId, content: text },
      (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      },
    );
  }

  return { messages, send };
}
