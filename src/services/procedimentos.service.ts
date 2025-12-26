import { http } from './http';
import { env } from '@/lib/env';
import {
  mockProcedimentos,
  mockMedicos,
  mockPacientes,
  mockTiposProcedimento,
} from './mocks/data';
import type {
  Procedimento,
  ProcedimentoInput,
  ProcedimentoView,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const procedimentosService = {
  list: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<ProcedimentoView>> => {
    // TODO(api): Integrar com endpoint GET /procedimentos?expand=tipo,medico,paciente
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Expandir dados relacionados
      const expandedData: ProcedimentoView[] = mockProcedimentos.map((proc) => ({
        ...proc,
        tipo: mockTiposProcedimento.find((t) => t.id === proc.tipoId)!,
        medico: mockMedicos.find((m) => m.id === proc.medicoId)!,
        paciente: mockPacientes.find((p) => p.id === proc.pacienteId)!,
      }));

      return {
        data: expandedData,
        meta: {
          total: expandedData.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
        },
      };
    }

    const { data } = await http.get<PaginatedResponse<ProcedimentoView>>(
      '/procedimentos',
      {
        params: { ...params, expand: 'tipo,medico,paciente' },
      }
    );
    return data;
  },

  getById: async (id: string): Promise<ProcedimentoView> => {
    // TODO(api): Integrar com endpoint GET /procedimentos/:id?expand=tipo,medico,paciente
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const proc = mockProcedimentos.find((p) => p.id === id);
      if (!proc) throw new Error('Procedimento não encontrado');

      return {
        ...proc,
        tipo: mockTiposProcedimento.find((t) => t.id === proc.tipoId)!,
        medico: mockMedicos.find((m) => m.id === proc.medicoId)!,
        paciente: mockPacientes.find((p) => p.id === proc.pacienteId)!,
      };
    }

    const { data } = await http.get<ProcedimentoView>(`/procedimentos/${id}`, {
      params: { expand: 'tipo,medico,paciente' },
    });
    return data;
  },

  getByPaciente: async (pacienteId: string): Promise<ProcedimentoView[]> => {
    // TODO(api): Integrar com endpoint GET /pacientes/:id/procedimentos
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const filtered = mockProcedimentos.filter((p) => p.pacienteId === pacienteId);

      return filtered.map((proc) => ({
        ...proc,
        tipo: mockTiposProcedimento.find((t) => t.id === proc.tipoId)!,
        medico: mockMedicos.find((m) => m.id === proc.medicoId)!,
        paciente: mockPacientes.find((p) => p.id === proc.pacienteId)!,
      }));
    }

    const { data } = await http.get<ProcedimentoView[]>(
      `/pacientes/${pacienteId}/procedimentos`
    );
    return data;
  },

  create: async (payload: ProcedimentoInput): Promise<Procedimento> => {
    // TODO(api): Integrar com endpoint POST /procedimentos
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return {
        id: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.post<Procedimento>('/procedimentos', payload);
    return data;
  },

  update: async (
    id: string,
    payload: Partial<ProcedimentoInput>
  ): Promise<Procedimento> => {
    // TODO(api): Integrar com endpoint PATCH /procedimentos/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const proc = mockProcedimentos.find((p) => p.id === id);
      if (!proc) throw new Error('Procedimento não encontrado');
      return {
        ...proc,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.patch<Procedimento>(`/procedimentos/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    // TODO(api): Integrar com endpoint DELETE /procedimentos/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/procedimentos/${id}`);
  },
};
