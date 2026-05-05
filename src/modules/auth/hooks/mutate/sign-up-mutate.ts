import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/axios';
import { clearObject } from '@/lib/utils';
import { authStore } from '@/modules/auth/store';
import type { SignUpDto, TokenResponseDto } from '@/modules/auth/types';

export const useSignUpMutate = () => {
  const { setAccessToken } = authStore();

  return useMutation({
    mutationFn: async (dto: SignUpDto) => {
      const r = await api.post<TokenResponseDto>(
        '/auth/sign-up',
        clearObject(dto),
      );

      return r.data;
    },

    onSuccess: ({ accessToken }) => setAccessToken(accessToken),
  });
};
