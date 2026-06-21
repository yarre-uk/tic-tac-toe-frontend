import { useMutation } from '@tanstack/react-query';

import { api, clearObject } from '@/lib';
import { useAuthStore } from '@/modules';
import type { SignUpDto, TokenResponseDto } from '@/modules';
import type { ApiResult } from '@/types';

export const useSignUpMutation = () => {
  'use no memo';

  const { setAccessToken, setReady } = useAuthStore();

  return useMutation({
    mutationFn: async (dto: SignUpDto) => {
      const r = await api.post<ApiResult<TokenResponseDto>>(
        '/auth/sign-up',
        clearObject(dto),
      );

      return r.data.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setReady(true);
    },
  });
};
