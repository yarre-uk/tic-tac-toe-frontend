import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { api } from '@/lib';
import type { TokenResponseDto } from '@/modules';
import { useAuthStore } from '@/modules/auth/store';
import type { ApiResult } from '@/types';

export const useAuthRefresh = () => {
  'use no memo';

  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setReady = useAuthStore((s) => s.setReady);

  const query = useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: async () => {
      const r = await api.post<ApiResult<TokenResponseDto>>('/auth/refresh');

      return r.data.data;
    },
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setAccessToken(query.data.accessToken);
      setReady(true);
    } else if (query.isError) {
      setAccessToken(null);
      setReady(true);
    }
  }, [query.status]);

  return query;
};
