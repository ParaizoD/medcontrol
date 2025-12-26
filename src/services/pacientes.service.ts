import { http } from './http';
import { env } from '@/lib/env';
import { mockPacientes } from './mocks/data';
import type { Paciente, PacienteInput, PaginatedResponse, PaginationParams } from '@/types';

interface PacienteDetalhado extends Paciente {
  stats?: {
    total_procedimentos: number;
    ultima_visita: string | null;
  };
}

export const pacientesService = {
  list: async (params?: PaginationParams & { search?: string }): Promise<PaginatedResponse<Paciente>> => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: mockPacientes,
        meta: {
          total: mockPacientes.length,
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

    const { data } = await http.get<Paciente[]>('/pacientes', { 
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

  getById: async (id: string): Promise<PacienteDetalhado> => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const paciente = mockPacientes.find((p) => p.id === id);
      if (!paciente) throw new Error('Paciente não encontrado');
      return paciente;
    }

    const { data } = await http.get<PacienteDetalhado>(`/pacientes/${id}`);
    return data;
  },

  getProcedimentos: async (id: string, params?: { skip?: number; limit?: number }) => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        paciente: { id, nome: 'Paciente Mock' },
        procedimentos: [],
        total: 0
      };
    }

    const { data } = await http.get(`/pacientes/${id}/procedimentos`, { params });
    return data;
  },

  create: async (payload: PacienteInput): Promise<Paciente> => {
    // TODO(api): Endpoint POST /pacientes ainda não implementado
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.post<Paciente>('/pacientes', payload);
    return data;
  },

  update: async (id: string, payload: Partial<PacienteInput>): Promise<Paciente> => {
    // TODO(api): Endpoint PUT /pacientes/:id ainda não implementado
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const paciente = mockPacientes.find((p) => p.id === id);
      if (!paciente) throw new Error('Paciente não encontrado');
      return {
        ...paciente,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.patch<Paciente>(`/pacientes/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    // TODO(api): Endpoint DELETE /pacientes/:id ainda não implementado
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/pacientes/${id}`);
  },
};
