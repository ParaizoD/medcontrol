// Adicionar ao final de src/types/index.ts

// ============================================
// IMPORT SYSTEM
// ============================================

export type ImportRow = {
  data: string; // Data do procedimento
  nomeProcedimento: string; // Nome do tipo de procedimento
  nomeMedicos: string; // Nome do(s) médico(s)
  nomePaciente: string; // Nome do paciente
};

export type ImportRowValidated = ImportRow & {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
};

export type ImportPreview = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ImportRowValidated[];
};

export type ImportResult = {
  success: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
  created: {
    medicos: number;
    pacientes: number;
    tiposProcedimento: number;
    procedimentos: number;
  };
  warnings: string[];
};
