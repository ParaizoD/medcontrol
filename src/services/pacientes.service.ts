import { http } from './http';
import { env } from '@/lib/env';
import { mockPacientes } from './mocks/data';
import type { Paciente, PacienteInput, PaginatedResponse, PaginationParams } from '@/types';

export const pacientesService = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Paciente>> => {
    // TODO(api): Integrar com endpoint GET /pacientes
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

    const { data } = await http.get<PaginatedResponse<Paciente>>('/pacientes', { params });
    return data;
  },

  getById: async (id: string): Promise<Paciente> => {
    // TODO(api): Integrar com endpoint GET /pacientes/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const paciente = mockPacientes.find((p) => p.id === id);
      if (!paciente) throw new Error('Paciente não encontrado');
      return paciente;
    }

    const { data } = await http.get<Paciente>(`/pacientes/${id}`);
    return data;
  },

  create: async (payload: PacienteInput): Promise<Paciente> => {
    // TODO(api): Integrar com endpoint POST /pacientes
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
    // TODO(api): Integrar com endpoint PATCH /pacientes/:id
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
    // TODO(api): Integrar com endpoint DELETE /pacientes/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/pacientes/${id}`);
  },
};
