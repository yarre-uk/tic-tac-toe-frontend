import { create } from 'zustand';

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (newToken: string | null) => void;
}

export const authStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken(newToken) {
    set({
      accessToken: newToken,
    });
  },
}));
