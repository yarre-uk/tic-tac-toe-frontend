import { create } from 'zustand';

interface SocketStore {
  version: number;
  bump: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));
