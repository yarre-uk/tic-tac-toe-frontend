import { create } from 'zustand';

import { isDefined } from '@/lib/utils';

interface AuthStore {
  accessToken: string | null;
  isReady: boolean;
  setAccessToken: (token: string | null) => void;
  setReady: (ready: boolean) => void;
  isAuthorized: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
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
}));
