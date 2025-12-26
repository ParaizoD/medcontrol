// ============================================
// AUTH & SESSION
// ============================================
export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: Me;
};

export type Me = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
};

// ============================================
// MENU
// ============================================
export type MenuItem = {
  id: string;
  label: string;
  to?: string;
  icon?: string;
  children?: MenuItem[];
  roles?: string[];
};

// ============================================
// MÉDICOS
// ============================================
export type Medico = {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type MedicoInput = Omit<Medico, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// PACIENTES
// ============================================
export type Paciente = {
  id: string;
  nome: string;
  cpf?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PacienteInput = Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// TIPOS DE PROCEDIMENTO
// ============================================
export type TipoProcedimento = {
  id: string;
  nome: string;
  descricao?: string;
  valorReferencia?: number;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TipoProcedimentoInput = Omit<TipoProcedimento, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// PROCEDIMENTOS
// ============================================
export type Procedimento = {
  id: string;
  data: string; // ISO date string
  tipoId: string;
  medicoId: string;
  pacienteId: string;
  observacoes?: string;
  valor?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProcedimentoInput = Omit<Procedimento, 'id' | 'createdAt' | 'updatedAt'>;

// View expandida com dados relacionados
export type ProcedimentoView = Procedimento & {
  tipo: TipoProcedimento;
  medico: Medico;
  paciente: Paciente;
};

// ============================================
// DASHBOARD / INDICADORES
// ============================================
export type DashboardStats = {
  totalProcedimentos: number;
  totalPacientes: number;
  totalMedicos: number;
  procedimentosMes: number;
  procedimentosPorTipo: Array<{
    tipo: string;
    quantidade: number;
  }>;
  procedimentosPorMedico: Array<{
    medico: string;
    quantidade: number;
  }>;
  evolucaoMensal: Array<{
    mes: string;
    quantidade: number;
  }>;
};

// ============================================
// PAGINATION & FILTERING
// ============================================
export type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ============================================
// API ERROR
// ============================================
export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
