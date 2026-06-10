export interface ChangePasswordDto {
  nickname: string;
  oldPassword: string;
  newPassword: string;
}

export interface SessionResponseDto {
  id: string;
  expiresAt: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface SignInDto {
  nickname: string;
  password: string;
}

export interface SignUpDto {
  nickname: string;
  email?: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
}

// Mirrors UserPayload from the backend — the decoded JWT body.
export type Role = 'Admin' | 'Moderator' | 'User';

export interface UserPayload {
  sub: string; // user ID
  jti: string; // unique token ID (used for blacklisting)
  role: Role;
}
