import { create } from 'zustand';

import type { UserProfile } from './types';

interface ProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  // Patches only roomId without refetching the whole profile.
  // Called after create/join/leave so the store stays in sync with
  // what the server already told us via the WS response.
  setRoomId: (roomId: string | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  setRoomId: (roomId) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, roomId } : state.profile,
    })),
}));
