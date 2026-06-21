import { useMutation } from '@tanstack/react-query';

import type { SignInDto, TokenResponseDto } from '../../types';

import { api } from '@/lib';
import { useAuthStore } from '@/modules';
import type { ApiResult } from '@/types';

export const useSignInMutation = () => {
  'use no memo';

  const { setAccessToken, setReady } = useAuthStore();

  return useMutation({
    mutationFn: async (dto: SignInDto) => {
      const res = await api.post<ApiResult<TokenResponseDto>>(
        '/auth/sign-in',
        dto,
      );

      return res.data.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setReady(true);
    },
  });
};
