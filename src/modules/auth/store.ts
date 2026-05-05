import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (newToken: string | null) => void;
}

export const authStore = create<AuthStore, [['zustand/persist', unknown]]>(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken(newToken) {
        return set({
          accessToken: newToken,
        });
      },
    }),
    { name: 'authStorage', storage: createJSONStorage(() => localStorage) },
  ),
);
