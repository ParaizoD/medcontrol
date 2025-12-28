import { http } from '@/services/http';
import { env } from '@/lib/env';
import type { AuthRequest, AuthResponse } from '@/types';

export const authService = {
  login: async (payload: AuthRequest): Promise<AuthResponse> => {
    // TODO(api): Integrar com endpoint real POST /auth/login
    if (env.USE_MOCKS) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock: aceita qualquer usuário/senha
      return {
        accessToken: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          name: 'Dr. Usuário Demo',
          email: payload.email,
          roles: ['ADMIN', 'MEDICO'],
          avatar: undefined,
        },
      };
    }

    const { data } = await http.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    // TODO(api): Integrar com endpoint POST /auth/logout se necessário
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    await http.post('/auth/logout');
  },

  forgotPassword: async (email: string): Promise<void> => {
    // TODO(api): Integrar com endpoint POST /auth/forgot-password
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Password reset email sent to:', email);
      return;
    }

    await http.post('/auth/forgot-password', { email });
  },
};
