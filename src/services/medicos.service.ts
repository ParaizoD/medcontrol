import { http } from './http';
import { env } from '@/lib/env';
import { mockMedicos } from './mocks/data';
import type { Medico, MedicoInput, PaginatedResponse, PaginationParams } from '@/types';

interface MedicoDetalhado extends Medico {
  stats?: {
    total_procedimentos: number;
    ultima_atividade: string | null;
  };
}

export const medicosService = {
  list: async (params?: PaginationParams & { search?: string }): Promise<PaginatedResponse<Medico>> => {
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

    // Converter page/limit para skip/limit
    const skip = params?.page ? (params.page - 1) * (params.limit || 20) : 0;
    const limit = params?.limit || 100;
    const search = params?.search;

    const { data } = await http.get<Medico[]>('/medicos', { 
      params: { skip, limit, search } 
    });
    
    return {
      data,
      meta: {
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: Math.ceil(data.length / (params?.limit || 20)),
      },
    };
  },

  getById: async (id: string): Promise<MedicoDetalhado> => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const medico = mockMedicos.find((m) => m.id === id);
      if (!medico) throw new Error('Médico não encontrado');
      return medico;
    }

    const { data } = await http.get<MedicoDetalhado>(`/medicos/${id}`);
    return data;
  },

  getProcedimentos: async (id: string, params?: { skip?: number; limit?: number }) => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        medico: { id, nome: 'Dr. Mock' },
        procedimentos: [],
        total: 0
      };
    }

    const { data } = await http.get(`/medicos/${id}/procedimentos`, { params });
    return data;
  },

  create: async (payload: MedicoInput): Promise<Medico> => {
    // TODO(api): Endpoint POST /medicos ainda não implementado
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
    // TODO(api): Endpoint PUT /medicos/:id ainda não implementado
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
    // TODO(api): Endpoint DELETE /medicos/:id ainda não implementado
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/medicos/${id}`);
  },
};
