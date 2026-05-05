import { useMutation } from '@tanstack/react-query';

import { apiAuth } from '@/lib/axios';
import { authStore } from '@/modules/auth/store';

export const useSignOutMutation = () => {
  'use no memo';

  const { setAccessToken, setReady } = authStore();

  return useMutation({
    mutationFn: async () => {
      await apiAuth.post('auth/logout');
    },
    onSuccess: () => {
      setAccessToken(null);
      setReady(true);
    },
  });
};
