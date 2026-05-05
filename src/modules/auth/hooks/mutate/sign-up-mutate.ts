import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/axios';
import { clearObject } from '@/lib/utils';
import type { SignUpDto, TokenResponseDto } from '@/modules/auth/types';

export const useSignUpMutate = () =>
  useMutation({
    mutationFn: async (dto: SignUpDto) => {
      const r = await api.post<TokenResponseDto>(
        '/auth/sign-up',
        clearObject(dto),
      );
      return r.data;
    },
  });
