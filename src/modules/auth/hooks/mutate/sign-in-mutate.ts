import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/axios';
import type { SignInDto, TokenResponseDto } from '@/modules/auth/types';

export const useSignInMutate = () => {
  return useMutation({
    mutationFn: async (dto: SignInDto) => {
      const r = await api.post<TokenResponseDto>('/auth/sign-in', dto);

      return r.data;
    },
  });
};
