import { useEffect, useRef, useState } from 'react';

import { useChat } from '../hooks/use-chat';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components';

interface ChatProps {
  roomId: string;
  userId: string;
}

export function Chat({ roomId, userId }: Readonly<ChatProps>) {
  const { messages, send } = useChat(roomId);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    send(text);
    setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-line border-b">
        <CardTitle>Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {messages.map((msg) => {
          const isOwn = msg.userId === userId;

          return (
            <div
              key={msg.id}
              className={['flex', isOwn ? 'justify-end' : 'justify-start'].join(
                ' ',
              )}
            >
              <span
                className={[
                  'max-w-[75%] rounded-lg px-3 py-1.5 text-sm wrap-break-word',
                  isOwn ? 'bg-x text-bg-page' : 'bg-bg-panel text-ink',
                ].join(' ')}
              >
                {msg.content}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </CardContent>

      <CardFooter className="gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={text.trim() === ''}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
