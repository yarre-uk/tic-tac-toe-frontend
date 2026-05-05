import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isDefined } from '@/lib/utils';

interface AuthStore {
  accessToken: string | null;
  isReady: boolean;
  setAccessToken: (token: string | null) => void;
  setReady: (ready: boolean) => void;
  isAuthorized: () => boolean;
}

export const authStore = create<AuthStore, [['zustand/persist', unknown]]>(
  persist(
    (set, get) => ({
      accessToken: null,
      isReady: false,
      setAccessToken(token) {
        set({ accessToken: token });
      },
      setReady(ready) {
        set({ isReady: ready });
      },
      isAuthorized() {
        return isDefined(get().accessToken) && get().isReady;
      },
    }),
    {
      name: 'authStorage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
