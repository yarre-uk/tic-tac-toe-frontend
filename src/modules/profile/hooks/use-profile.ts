import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useProfileStore } from '../store';
import type { UserProfile } from '../types';

import { apiAuth } from '@/lib';
import { useAuthStore } from '@/modules';
import type { ApiResult } from '@/types';

export function useProfile() {
  'use no memo';

  const isAuthorized = useAuthStore((s) => s.isAuthorized());
  const setProfile = useProfileStore((s) => s.setProfile);

  const query = useQuery({
    enabled: isAuthorized,
    queryKey: ['profile'],
    queryFn: async () => {
      const r = await apiAuth.get<ApiResult<UserProfile>>('/users/profile');
      return r.data.data;
    },
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setProfile(query.data);
    } else if (query.isError) {
      setProfile(null);
    }
  }, [query.status, setProfile]);

  return query;
}
