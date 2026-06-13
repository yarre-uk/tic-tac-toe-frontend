import { useState } from 'react';

import type { Room } from '../types';

import { Button } from '@/components';

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
    <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{room.name ?? 'Unnamed room'}</p>
          <p className="text-xs text-gray-400">ID: {room.id}</p>
        </div>

        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-medium',
            room.status === 'Waiting' && 'bg-yellow-100 text-yellow-700',
            room.status === 'Playing' && 'bg-green-100 text-green-700',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {room.status}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">
          Players ({room.players.length} / 2)
        </p>

        {room.players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm"
          >
            <span className="font-medium">{player.nickname}</span>

            <div className="flex items-center gap-2">
              {player.id === room.ownerId && (
                <span className="text-xs text-gray-400">owner</span>
              )}
              {player.id === currentUserId && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                  you
                </span>
              )}
            </div>
          </div>
        ))}

        {room.players.length < 2 && (
          <p className="text-xs text-gray-400">Waiting for another player…</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
        />
        <Button onClick={() => onUpdate(name)}>Update</Button>
      </div>

      <Button
        onClick={onLeave}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Leave room
      </Button>
    </div>
  );
}
