import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/axios';
import { clearObject } from '@/lib/utils';
import { authStore } from '@/modules/auth/store';
import type { SignUpDto, TokenResponseDto } from '@/modules/auth/types';
import type { ApiResult } from '@/types';

export const useSignUpMutation = () => {
  'use no memo';

  const { setAccessToken, setReady } = authStore();

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
