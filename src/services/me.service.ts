import { http } from './http';
import { env } from '@/lib/env';
import type { Me } from '@/types';

export const meService = {
  getMe: async (): Promise<Me> => {
    // TODO(api): Integrar com endpoint GET /me
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: '1',
        name: 'Dr. Usuário Demo',
        email: 'demo@medcontrol.com',
        roles: ['ADMIN', 'MEDICO'],
      };
    }

    const { data } = await http.get<Me>('/me');
    return data;
  },

  updateMe: async (payload: Partial<Me>): Promise<Me> => {
    // TODO(api): Integrar com endpoint PATCH /me
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: '1',
        name: payload.name || 'Dr. Usuário Demo',
        email: payload.email || 'demo@medcontrol.com',
        roles: ['ADMIN', 'MEDICO'],
      };
    }

    const { data } = await http.patch<Me>('/me', payload);
    return data;
  },
};
