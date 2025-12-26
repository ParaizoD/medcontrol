import { http } from './http';
import { env } from '@/lib/env';
import { mockMedicos } from './mocks/data';
import type { Medico, MedicoInput, PaginatedResponse, PaginationParams } from '@/types';

export const medicosService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Medico>> => {
    // TODO(api): Integrar com endpoint GET /medicos
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: mockMedicos,
        meta: {
          total: mockMedicos.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
        },
      };
    }

    const { data } = await http.get<PaginatedResponse<Medico>>('/medicos', { params });
    return data;
  },

  getById: async (id: string): Promise<Medico> => {
    // TODO(api): Integrar com endpoint GET /medicos/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const medico = mockMedicos.find((m) => m.id === id);
      if (!medico) throw new Error('Médico não encontrado');
      return medico;
    }

    const { data } = await http.get<Medico>(`/medicos/${id}`);
    return data;
  },

  create: async (payload: MedicoInput): Promise<Medico> => {
    // TODO(api): Integrar com endpoint POST /medicos
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.post<Medico>('/medicos', payload);
    return data;
  },

  update: async (id: string, payload: Partial<MedicoInput>): Promise<Medico> => {
    // TODO(api): Integrar com endpoint PATCH /medicos/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const medico = mockMedicos.find((m) => m.id === id);
      if (!medico) throw new Error('Médico não encontrado');
      return {
        ...medico,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.patch<Medico>(`/medicos/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    // TODO(api): Integrar com endpoint DELETE /medicos/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/medicos/${id}`);
  },
};
