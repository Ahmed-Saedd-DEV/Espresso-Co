import { apiGet, apiPost } from './client';
import type { LoginInput, RegisterInput } from '../types/auth';

export interface AuthResponse {
  message?: string;
  token?: string;
}

export interface ProfileResponse {
  id?: number;
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN' | 'customer' | 'admin';
}

export const authApi = {
  login: (payload: LoginInput) => apiPost<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterInput) => apiPost<{ message: string; user?: { name: string; email: string } }>('/auth/register', payload),
  getProfile: () => apiGet<ProfileResponse>('/auth/profile'),
  verifyEmail: (token: string) => apiPost<{ message: string }>('/auth/verify-email', { token }),
  forgotPassword: (email: string) => apiPost<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => apiPost<{ message: string }>('/auth/reset-password', { token, newPassword: password }),
  logout: () => apiPost<{ message: string }>('/auth/logout', {}),
};
