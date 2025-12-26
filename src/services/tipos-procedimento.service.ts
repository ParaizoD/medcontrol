import { http } from './http';
import { env } from '@/lib/env';
import { mockTiposProcedimento } from './mocks/data';
import type {
  TipoProcedimento,
  TipoProcedimentoInput,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const tiposProcedimentoService = {
  list: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<TipoProcedimento>> => {
    // TODO(api): Integrar com endpoint GET /tipos-procedimento
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        data: mockTiposProcedimento,
        meta: {
          total: mockTiposProcedimento.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
        },
      };
    }

    const { data } = await http.get<PaginatedResponse<TipoProcedimento>>(
      '/tipos-procedimento',
      { params }
    );
    return data;
  },

  getById: async (id: string): Promise<TipoProcedimento> => {
    // TODO(api): Integrar com endpoint GET /tipos-procedimento/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tipo = mockTiposProcedimento.find((t) => t.id === id);
      if (!tipo) throw new Error('Tipo de procedimento não encontrado');
      return tipo;
    }

    const { data } = await http.get<TipoProcedimento>(`/tipos-procedimento/${id}`);
    return data;
  },

  create: async (payload: TipoProcedimentoInput): Promise<TipoProcedimento> => {
    // TODO(api): Integrar com endpoint POST /tipos-procedimento
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        id: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.post<TipoProcedimento>('/tipos-procedimento', payload);
    return data;
  },

  update: async (
    id: string,
    payload: Partial<TipoProcedimentoInput>
  ): Promise<TipoProcedimento> => {
    // TODO(api): Integrar com endpoint PATCH /tipos-procedimento/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const tipo = mockTiposProcedimento.find((t) => t.id === id);
      if (!tipo) throw new Error('Tipo de procedimento não encontrado');
      return {
        ...tipo,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await http.patch<TipoProcedimento>(
      `/tipos-procedimento/${id}`,
      payload
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    // TODO(api): Integrar com endpoint DELETE /tipos-procedimento/:id
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return;
    }

    await http.delete(`/tipos-procedimento/${id}`);
  },
};
