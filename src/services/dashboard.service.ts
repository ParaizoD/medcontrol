import { http } from './http';
import { env } from '@/lib/env';
import { mockDashboardStats } from './mocks/data';
import type { DashboardStats } from '@/types';

interface DashboardStatsAPI {
  totais: {
    medicos: number;
    pacientes: number;
    tipos_procedimento: number;
    procedimentos: number;
    procedimentos_mes_atual: number;
    valor_total: number;
  };
  top_medicos: Array<{
    id: string;
    nome: string;
    total_procedimentos: number;
  }>;
  top_tipos: Array<{
    id: string;
    nome: string;
    total: number;
  }>;
  procedimentos_por_mes: Array<{
    ano: number;
    mes: number;
    total: number;
  }>;
  ultimos_procedimentos: Array<{
    id: string;
    data: string;
    tipo: string;
    medico: string;
    paciente: string;
    valor: number | null;
  }>;
}

const mesesNomes = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockDashboardStats;
    }

    const { data } = await http.get<DashboardStatsAPI>('/dashboard/stats');
    
    // Converter formato da API para formato do frontend
    return {
      totalProcedimentos: data.totais.procedimentos,
      totalMedicos: data.totais.medicos,
      totalPacientes: data.totais.pacientes,
      faturamentoMes: data.totais.valor_total,
      procedimentosMes: data.totais.procedimentos_mes_atual,
      crescimentoMensal: 0, // TODO: calcular baseado em histórico
      
      // Converter topMedicos para procedimentosPorMedico
      procedimentosPorMedico: data.top_medicos.map(m => ({
        medico: m.nome,
        quantidade: m.total_procedimentos
      })),
      
      // Converter topTipos para procedimentosPorTipo
      procedimentosPorTipo: data.top_tipos.map(t => ({
        tipo: t.nome,
        quantidade: t.total
      })),
      
      // Converter procedimentos_por_mes para evolucaoMensal
      evolucaoMensal: data.procedimentos_por_mes.map(p => ({
        mes: mesesNomes[p.mes - 1],
        quantidade: p.total
      })),
      
      // Manter dados originais também (para compatibilidade)
      topMedicos: data.top_medicos.map(m => ({
        id: m.id,
        nome: m.nome,
        total: m.total_procedimentos
      })),
      topProcedimentos: data.top_tipos.map(t => ({
        id: t.id,
        nome: t.nome,
        total: t.total
      })),
      procedimentosPorMes: data.procedimentos_por_mes.map(p => ({
        mes: `${p.ano}-${String(p.mes).padStart(2, '0')}`,
        total: p.total
      })),
      ultimosProcedimentos: data.ultimos_procedimentos.map(p => ({
        id: p.id,
        data: p.data,
        tipo: p.tipo,
        medico: p.medico,
        paciente: p.paciente,
        valor: p.valor || 0
      }))
    };
  },
  
  getRelatorioMensal: async (ano: number, mes: number) => {
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        periodo: { ano, mes },
        resumo: { total_procedimentos: 0, valor_total: 0 },
        por_tipo: [],
        por_medico: []
      };
    }

    const { data } = await http.get('/dashboard/relatorio-mensal', {
      params: { ano, mes }
    });
    return data;
  },
};
