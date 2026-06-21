import { useMutation } from '@tanstack/react-query';

import { apiAuth } from '@/lib';
import { useAuthStore } from '@/modules';

export const useSignOutMutation = () => {
  'use no memo';

  const { setAccessToken, setReady } = useAuthStore();

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
