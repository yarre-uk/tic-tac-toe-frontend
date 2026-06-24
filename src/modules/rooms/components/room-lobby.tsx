/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'lucide-react';
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
import { Envs } from '@/lib';

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

  const handleShareRoom = async () => {
    // Clipboard.
    const type = 'text/plain';

    const clipboardItemData = {
      [type]: `${Envs.VITE_LINK_URL}game?id=${room.id}`,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-line border-b">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <CardTitle>{room.name ?? 'Unnamed room'}</CardTitle>
            <Text size="xs" color="muted">
              {room.id}
            </Text>
          </div>

          <div className="flex flex-row items-center gap-4">
            <Button
              variant="outlined"
              className="p-2"
              onClick={handleShareRoom}
            >
              <Link size={16} />
            </Button>

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
