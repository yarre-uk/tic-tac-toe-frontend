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
  email: string;
  password: string;
}

export interface TokenResponseDto {
  accessToken: string;
}
