import { useState } from 'react';

import type { Room } from '../types';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Text,
} from '@/components';

interface RoomLobbyProps {
  room: Room;
  currentUserId: string;
  onLeave: () => void;
  onUpdate: (name: string) => void;
}

export function RoomLobby({
  room,
  currentUserId,
  onLeave,
  onUpdate,
}: Readonly<RoomLobbyProps>) {
  const [name, setName] = useState(room.name ?? '');

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-line border-b">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <CardTitle>{room.name ?? 'Unnamed room'}</CardTitle>
            <Text size="xs" color="muted">
              {room.id}
            </Text>
          </div>

          <span
            className={[
              'rounded-full px-3 py-1 text-xs font-medium',
              room.status === 'Waiting' && 'bg-x-soft text-x',
              room.status === 'Playing' && 'bg-o-soft text-o',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {room.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Text size="xs" color="muted">
          Players ({room.players.length} / 2)
        </Text>

        <div className="flex flex-col gap-1.5">
          {room.players.map((player) => (
            <div
              key={player.id}
              className="bg-bg-panel flex items-center justify-between rounded-lg px-3 py-2"
            >
              <Text size="sm">{player.nickname}</Text>

              <div className="flex items-center gap-2">
                {player.id === room.ownerId && (
                  <Text size="xs" color="muted">
                    owner
                  </Text>
                )}
                {player.id === currentUserId && (
                  <span className="bg-x-soft text-x rounded-full px-2 py-0.5 text-xs">
                    you
                  </span>
                )}
              </div>
            </div>
          ))}

          {room.players.length < 2 && (
            <Text size="xs" color="muted">
              Waiting for another player…
            </Text>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
          />
          <Button onClick={() => onUpdate(name)}>Update</Button>
        </div>
      </CardContent>

      <CardFooter>
        <Button color="o" className="w-full" onClick={onLeave}>
          Leave room
        </Button>
      </CardFooter>
    </Card>
  );
}
