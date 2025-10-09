// 用户相关类型定义 - 与后端保持完全一致
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
  bio?: string;
  status: 'active' | 'disabled';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    tokenRewards: boolean;
    contentUpdates: boolean;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// 认证相关类型 - 与后端保持完全一致
export interface LoginRequest {
  email: string;
  password: string;
  turnstileToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  turnstileToken: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
  refreshToken: string;
}

// 密码验证结果
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

// 认证错误代码
export enum AuthErrorCodes {
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  USER_DISABLED = 'AUTH_USER_DISABLED',
  TURNSTILE_FAILED = 'AUTH_TURNSTILE_FAILED',
  PASSWORD_TOO_WEAK = 'AUTH_PASSWORD_TOO_WEAK',
  EMAIL_ALREADY_EXISTS = 'AUTH_EMAIL_EXISTS',
  USERNAME_ALREADY_EXISTS = 'AUTH_USERNAME_EXISTS',
  SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS'
}