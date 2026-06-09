import { create } from 'zustand';

import type { Room } from './types';

// Minimal store — just the room the current user is in, or null if they're not in one.
// All room updates (someone joined, someone left) go through setRoom so the UI
// always reflects the latest server-authoritative state.
interface RoomStore {
  room: Room | null;
  setRoom: (room: Room | null) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
}));
