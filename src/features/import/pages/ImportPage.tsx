import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parseCSV, readFileAsText } from '@/lib/csv-parser';
import { importService } from '@/services/import.service';
import type { ImportRow, ImportPreview, ImportResult } from '@/types/import.types';

export default function ImportPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setFile(selectedFile);
    setStep('upload');
    setPreview(null);
    setResult(null);

    try {
      const text = await readFileAsText(selectedFile);
      const parsedRows = parseCSV(text);
      setRows(parsedRows);
      toast.success(`${parsedRows.length} registros encontrados!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar CSV');
      setFile(null);
    }
  };

  const handleValidate = async () => {
    if (rows.length === 0) {
      toast.error('Nenhum dado para validar');
      return;
    }

    setLoading(true);
    try {
      const previewData = await importService.validateCSV(rows);
      setPreview(previewData);
      setStep('preview');
      
      if (previewData.invalidRows > 0) {
        toast.warning(`${previewData.invalidRows} registros com erros`);
      } else {
        toast.success('Todos os registros estão válidos!');
      }
    } catch (error) {
      toast.error('Erro ao validar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview || preview.validRows === 0) {
      toast.error('Não há registros válidos para importar');
      return;
    }

    const validRows = preview.rows.filter(r => r.isValid);

    setLoading(true);
    try {
      const importResult = await importService.importProcedimentos(validRows);
      setResult(importResult);
      setStep('result');
      toast.success(`${importResult.success} procedimentos importados!`);
    } catch (error) {
      toast.error('Erro ao importar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRows([]);
    setPreview(null);
    setResult(null);
    setStep('upload');
  };

  const downloadTemplate = () => {
    const template = 'data,nome do procedimento,nome dos medicos,nome do paciente\n2024-12-01,Consulta,Dr. João Silva,Maria Santos\n2024-12-02,Exame,Dra. Ana Paula,José Oliveira';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_importacao.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Importação de Procedimentos</h1>
        <p className="text-muted-foreground">
          Faça upload de um arquivo CSV com os registros dos procedimentos
        </p>
      </div>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Template CSV
          </CardTitle>
          <CardDescription>
            Baixe o template para garantir que seu CSV está no formato correto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload Section */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              1. Upload do Arquivo
            </CardTitle>
            <CardDescription>
              Selecione o arquivo CSV com os dados dos procedimentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <FileText className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {file ? file.name : 'Clique para selecionar um arquivo CSV'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {file
                      ? `${rows.length} registros carregados`
                      : 'Arraste e solte ou clique para selecionar'}
                  </p>
                </div>
              </label>
            </div>

            {rows.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={handleValidate} disabled={loading}>
                  {loading ? 'Validando...' : 'Validar Dados'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Cancelar
                </Button>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-semibold">Formato esperado do CSV:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>data</strong>: Data do procedimento (YYYY-MM-DD ou DD/MM/YYYY)
                </li>
                <li>
                  <strong>nome do procedimento</strong>: Tipo do procedimento (ex: Consulta,
                  Exame)
                </li>
                <li>
                  <strong>nome dos medicos</strong>: Nome completo do médico
                </li>
                <li>
                  <strong>nome do paciente</strong>: Nome completo do paciente
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {step === 'preview' && preview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              2. Visualização e Validação
            </CardTitle>
            <CardDescription>
              Revise os dados antes de importar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{preview.totalRows}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">Válidos</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {preview.validRows}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">Com Erros</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {preview.invalidRows}
                </p>
              </div>
            </div>

            {/* Table Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Data</th>
                      <th className="px-4 py-2 text-left">Procedimento</th>
                      <th className="px-4 py-2 text-left">Médico</th>
                      <th className="px-4 py-2 text-left">Paciente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row) => (
                      <tr
                        key={row.rowNumber}
                        className={row.isValid ? '' : 'bg-red-50 dark:bg-red-950/30'}
                      >
                        <td className="px-4 py-2">{row.rowNumber}</td>
                        <td className="px-4 py-2">
                          {row.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-2">{row.data}</td>
                        <td className="px-4 py-2">{row.nomeProcedimento}</td>
                        <td className="px-4 py-2">{row.nomeMedicos}</td>
                        <td className="px-4 py-2">
                          {row.nomePaciente}
                          {!row.isValid && (
                            <div className="text-xs text-red-600 mt-1">
                              {row.errors.join(', ')}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={loading || preview.validRows === 0}
              >
                {loading ? 'Importando...' : `Importar ${preview.validRows} Registros`}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result Section */}
      {step === 'result' && result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              3. Importação Concluída
            </CardTitle>
            <CardDescription>
              Resultado da importação dos procedimentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Stats */}
            <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {result.success} procedimentos importados com sucesso!
              </p>
            </div>

            {/* Created Entities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Médicos</p>
                <p className="text-xl font-bold">{result.created.medicos}</p>
                <p className="text-xs text-muted-foreground">criados/atualizados</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Pacientes</p>
                <p className="text-xl font-bold">{result.created.pacientes}</p>
                <p className="text-xs text-muted-foreground">criados/atualizados</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Tipos</p>
                <p className="text-xl font-bold">{result.created.tiposProcedimento}</p>
                <p className="text-xs text-muted-foreground">criados</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Procedimentos</p>
                <p className="text-xl font-bold">{result.created.procedimentos}</p>
                <p className="text-xs text-muted-foreground">registrados</p>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Avisos:
                </p>
                <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-200">
                  {result.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  {result.errors.length} erros encontrados:
                </p>
                <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200 space-y-1">
                  {result.errors.slice(0, 10).map((error, idx) => (
                    <li key={idx}>
                      Linha {error.row}: {error.message}
                    </li>
                  ))}
                  {result.errors.length > 10 && (
                    <li className="text-red-600">
                      ... e mais {result.errors.length - 10} erros
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={() => navigate('/app/home')}>Ir para Dashboard</Button>
              <Button variant="outline" onClick={handleReset}>
                Nova Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
