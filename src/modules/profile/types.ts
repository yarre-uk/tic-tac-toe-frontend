import type { Role } from '@/modules';

export interface UserProfile {
  id: string;
  email: string | null;
  nickname: string;
  role: Role;
  roomId: string | null;
}
