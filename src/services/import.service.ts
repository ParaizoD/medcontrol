import { http } from './http';
import { env } from '@/lib/env';
import type { ImportRow, ImportPreview, ImportResult } from '@/types/import.types';

export const importService = {
  /**
   * Valida o CSV localmente e retorna preview dos dados
   * A validação é feita no frontend para dar feedback imediato ao usuário
   */
  validateCSV: async (rows: ImportRow[]): Promise<ImportPreview> => {
    // Simula um pequeno delay para UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const validated = rows.map((row, index) => {
      const errors: string[] = [];

      // Validações
      if (!row.data) errors.push('Data é obrigatória');
      if (!row.nomeProcedimento) errors.push('Nome do procedimento é obrigatório');
      if (!row.nomeMedicos) errors.push('Nome do médico é obrigatório');
      if (!row.nomePaciente) errors.push('Nome do paciente é obrigatório');

      // Validar formato de data
      if (row.data) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(row.data)) {
          errors.push('Data em formato inválido (use YYYY-MM-DD ou DD/MM/YYYY)');
        }
      }

      return {
        ...row,
        rowNumber: index + 1,
        isValid: errors.length === 0,
        errors,
      };
    });

    return {
      totalRows: rows.length,
      validRows: validated.filter((r) => r.isValid).length,
      invalidRows: validated.filter((r) => !r.isValid).length,
      rows: validated,
    };
  },

  /**
   * Executa a importação dos dados
   */
  importProcedimentos: async (rows: ImportRow[]): Promise<ImportResult> => {
    // TODO(api): Integrar com endpoint POST /import/procedimentos
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simula resultado de importação
      const validRows = rows.filter((row) => 
        row.data && row.nomeProcedimento && row.nomeMedicos && row.nomePaciente
      );

      // Contar entidades únicas
      const medicosUnicos = new Set(rows.map(r => r.nomeMedicos.trim())).size;
      const pacientesUnicos = new Set(rows.map(r => r.nomePaciente.trim())).size;
      const tiposUnicos = new Set(rows.map(r => r.nomeProcedimento.trim())).size;

      return {
        success: validRows.length,
        errors: rows
          .map((row, index) => {
            if (!row.data || !row.nomeProcedimento || !row.nomeMedicos || !row.nomePaciente) {
              return {
                row: index + 1,
                message: 'Campos obrigatórios faltando',
              };
            }
            return null;
          })
          .filter((e): e is { row: number; message: string } => e !== null),
        created: {
          medicos: medicosUnicos,
          pacientes: pacientesUnicos,
          tiposProcedimento: tiposUnicos,
          procedimentos: validRows.length,
        },
        warnings: [
          'Médicos e pacientes foram criados automaticamente se não existiam',
          'Tipos de procedimento foram criados com valores padrão',
        ],
      };
    }

    const { data } = await http.post<ImportResult>('/import/procedimentos', { rows });
    return data;
  },
};
