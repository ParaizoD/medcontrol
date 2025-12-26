import type { ImportRow } from '@/types/import.types';

/**
 * Converte data de DD/MM/YYYY para YYYY-MM-DD
 */
export function parseDate(dateStr: string): string {
  if (!dateStr) return '';

  // Já está no formato ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Formato brasileiro (DD/MM/YYYY)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  return dateStr;
}

/**
 * Processa arquivo CSV e retorna array de objetos
 */
export function parseCSV(csvText: string): ImportRow[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV vazio ou sem dados');
  }

  // Primeira linha são os headers
  const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase());
  
  // Mapear headers para campos esperados
  const headerMap: Record<string, keyof ImportRow> = {
    'data': 'data',
    'nome do procedimento': 'nomeProcedimento',
    'procedimento': 'nomeProcedimento',
    'tipo': 'nomeProcedimento',
    'nome dos medicos': 'nomeMedicos',
    'medico': 'nomeMedicos',
    'médico': 'nomeMedicos',
    'nome do paciente': 'nomePaciente',
    'paciente': 'nomePaciente',
  };

  const fieldIndexes: Record<keyof ImportRow, number> = {
    data: -1,
    nomeProcedimento: -1,
    nomeMedicos: -1,
    nomePaciente: -1,
  };

  // Identificar índice de cada campo
  headers.forEach((header, index) => {
    const field = headerMap[header];
    if (field) {
      fieldIndexes[field] = index;
    }
  });

  // Validar se todos os campos foram encontrados
  const missingFields = Object.entries(fieldIndexes)
    .filter(([_, index]) => index === -1)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    throw new Error(`Campos não encontrados no CSV: ${missingFields.join(', ')}`);
  }

  // Processar linhas de dados
  const rows: ImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Pular linhas vazias

    const values = line.split(/[,;\t]/).map(v => v.trim());

    rows.push({
      data: parseDate(values[fieldIndexes.data] || ''),
      nomeProcedimento: values[fieldIndexes.nomeProcedimento] || '',
      nomeMedicos: values[fieldIndexes.nomeMedicos] || '',
      nomePaciente: values[fieldIndexes.nomePaciente] || '',
    });
  }

  return rows;
}

/**
 * Lê arquivo e retorna conteúdo como texto
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Detecta separador do CSV
 */
export function detectSeparator(csvText: string): ',' | ';' | '\t' {
  const firstLine = csvText.split('\n')[0];
  
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount > 0) return '\t';
  if (semicolonCount > commaCount) return ';';
  return ',';
}
