import type {
  Medico,
  Paciente,
  TipoProcedimento,
  Procedimento,
  DashboardStats,
} from '@/types';

// ============================================
// MÉDICOS
// ============================================
export const mockMedicos: Medico[] = [
  {
    id: '1',
    nome: 'Dr. Carlos Silva',
    crm: '12345-SP',
    especialidade: 'Cardiologia',
    email: 'carlos.silva@email.com',
    telefone: '(11) 98765-4321',
    ativo: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Dra. Ana Paula',
    crm: '67890-RJ',
    especialidade: 'Dermatologia',
    email: 'ana.paula@email.com',
    telefone: '(21) 99876-5432',
    ativo: true,
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    nome: 'Dr. Roberto Mendes',
    crm: '11223-MG',
    especialidade: 'Ortopedia',
    email: 'roberto.mendes@email.com',
    telefone: '(31) 97654-3210',
    ativo: true,
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
];

// ============================================
// PACIENTES
// ============================================
export const mockPacientes: Paciente[] = [
  {
    id: '1',
    nome: 'Maria Santos',
    cpf: '123.456.789-00',
    dataNascimento: '1985-05-12',
    telefone: '(11) 91234-5678',
    email: 'maria.santos@email.com',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '2',
    nome: 'João Oliveira',
    cpf: '987.654.321-00',
    dataNascimento: '1990-08-25',
    telefone: '(11) 98765-4321',
    email: 'joao.oliveira@email.com',
    endereco: 'Av. Principal, 456 - São Paulo, SP',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
  {
    id: '3',
    nome: 'Ana Costa',
    cpf: '456.789.123-00',
    dataNascimento: '1978-12-03',
    telefone: '(11) 99999-8888',
    email: 'ana.costa@email.com',
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
  },
];

// ============================================
// TIPOS DE PROCEDIMENTO
// ============================================
export const mockTiposProcedimento: TipoProcedimento[] = [
  {
    id: '1',
    nome: 'Consulta',
    descricao: 'Consulta médica padrão',
    valorReferencia: 200.0,
    ativo: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Exame',
    descricao: 'Exame complementar',
    valorReferencia: 150.0,
    ativo: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    nome: 'Cirurgia',
    descricao: 'Procedimento cirúrgico',
    valorReferencia: 2500.0,
    ativo: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    nome: 'Retorno',
    descricao: 'Consulta de retorno',
    valorReferencia: 100.0,
    ativo: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// PROCEDIMENTOS
// ============================================
export const mockProcedimentos: Procedimento[] = [
  {
    id: '1',
    data: '2024-12-01T10:00:00Z',
    tipoId: '1',
    medicoId: '1',
    pacienteId: '1',
    observacoes: 'Paciente apresentou sintomas leves',
    valor: 200.0,
    createdAt: '2024-12-01T10:30:00Z',
  },
  {
    id: '2',
    data: '2024-12-05T14:00:00Z',
    tipoId: '2',
    medicoId: '2',
    pacienteId: '2',
    observacoes: 'Solicitado exame de sangue completo',
    valor: 150.0,
    createdAt: '2024-12-05T14:30:00Z',
  },
  {
    id: '3',
    data: '2024-12-10T09:00:00Z',
    tipoId: '1',
    medicoId: '3',
    pacienteId: '3',
    valor: 200.0,
    createdAt: '2024-12-10T09:30:00Z',
  },
  {
    id: '4',
    data: '2024-12-15T16:00:00Z',
    tipoId: '4',
    medicoId: '1',
    pacienteId: '1',
    observacoes: 'Retorno - melhora significativa',
    valor: 100.0,
    createdAt: '2024-12-15T16:30:00Z',
  },
];

// ============================================
// DASHBOARD
// ============================================
export const mockDashboardStats: DashboardStats = {
  totalProcedimentos: 42,
  totalPacientes: 28,
  totalMedicos: 3,
  procedimentosMes: 12,
  faturamentoMes: 12500.00,    
  crescimentoMensal: 12.5,     
  procedimentosPorTipo: [
    { tipo: 'Consulta', quantidade: 18 },
    { tipo: 'Exame', quantidade: 12 },
    { tipo: 'Cirurgia', quantidade: 5 },
    { tipo: 'Retorno', quantidade: 7 },
  ],
  procedimentosPorMedico: [
    { medico: 'Dr. Carlos Silva', quantidade: 20 },
    { medico: 'Dra. Ana Paula', quantidade: 14 },
    { medico: 'Dr. Roberto Mendes', quantidade: 8 },
  ],
  evolucaoMensal: [
    { mes: 'Jul', quantidade: 8 },
    { mes: 'Ago', quantidade: 12 },
    { mes: 'Set', quantidade: 10 },
    { mes: 'Out', quantidade: 15 },
    { mes: 'Nov', quantidade: 18 },
    { mes: 'Dez', quantidade: 12 },
  ],
};
