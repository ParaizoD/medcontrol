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

interface ProcedimentoAPI {
  id: string;
  data: string;
  tipo: {
    id: string;
    nome: string;
    valor_referencia: number | null;
  };
  medico: {
    id: string;
    nome: string;
    crm: string | null;
  };
  paciente: {
    id: string;
    nome: string;
  };
  valor: number | null;
  observacoes: string | null;
}

interface ProcedimentosResponse {
  procedimentos: ProcedimentoAPI[];
  total: number;
  skip: number;
  limit: number;
}

export const procedimentosService = {
  list: async (
    params?: PaginationParams & { 
      dataInicio?: string;
      dataFim?: string;
      medicoId?: string;
      pacienteId?: string;
      tipoId?: string;
    }
  ): Promise<PaginatedResponse<ProcedimentoView>> => {
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

    // Converter page/limit para skip/limit
    const skip = params?.page ? (params.page - 1) * (params.limit || 20) : 0;
    const limit = params?.limit || 50;

    const { data } = await http.get<ProcedimentosResponse>('/procedimentos', {
      params: { 
        skip, 
        limit,
        data_inicio: params?.dataInicio,
        data_fim: params?.dataFim,
        medico_id: params?.medicoId,
        paciente_id: params?.pacienteId,
        tipo_id: params?.tipoId,
      }
    });

    // Converter formato da API para formato do frontend
    const procedimentos: ProcedimentoView[] = data.procedimentos.map(p => ({
      id: p.id,
      data: p.data,
      tipoId: p.tipo.id,
      medicoId: p.medico.id,
      pacienteId: p.paciente.id,
      valor: p.valor || 0,
      observacoes: p.observacoes || undefined,
      tipo: {
        id: p.tipo.id,
        nome: p.tipo.nome,
        descricao: '',
        valorReferencia: p.tipo.valor_referencia || 0,
        ativo: true,
        createdAt: '',
        updatedAt: ''
      },
      medico: {
        id: p.medico.id,
        nome: p.medico.nome,
        crm: p.medico.crm || undefined,
        especialidade: '',
        ativo: true,
        createdAt: '',
        updatedAt: ''
      },
      paciente: {
        id: p.paciente.id,
        nome: p.paciente.nome,
        cpf: undefined,
        dataNascimento: undefined,
        createdAt: '',
        updatedAt: ''
      },
      createdAt: '',
      updatedAt: ''
    }));

    return {
      data: procedimentos,
      meta: {
        total: data.total,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: Math.ceil(data.total / (params?.limit || 20)),
      },
    };
  },
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
