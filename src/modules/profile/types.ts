import type { Role } from '@/modules/auth/types';

export interface UserProfile {
  id: string;
  email: string | null;
  nickname: string;
  role: Role;
  roomId: string | null;
}
