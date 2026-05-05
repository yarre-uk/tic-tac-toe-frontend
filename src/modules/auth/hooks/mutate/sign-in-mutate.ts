import { useMutation } from '@tanstack/react-query';

import type { SignInDto, TokenResponseDto } from '../../types';

import { api } from '@/lib/axios';
import type { ApiResult } from '@/types';

export const useSignInMutate = () => {
  return useMutation({
    mutationFn: async (dto: SignInDto) => {
      const res = await api.post<ApiResult<TokenResponseDto>>(
        '/auth/sign-in',
        dto,
      );

      return res.data.data;
    },
  });
};
