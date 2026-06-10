import { create } from 'zustand';

import type { Room } from './types';

interface RoomStore {
  room: Room | null;
  setRoom: (room: Room | null) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
