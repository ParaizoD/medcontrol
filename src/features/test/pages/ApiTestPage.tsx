import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { medicosService } from '@/services/medicos.service';
import { pacientesService } from '@/services/pacientes.service';
import { procedimentosService } from '@/services/procedimentos.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function ApiTestPage() {
  const [testResults, setTestResults] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  const testEndpoint = async (name: string, fn: () => Promise<any>) => {
    setTestResults(prev => ({ ...prev, [name]: 'loading' }));
    try {
      await fn();
      setTestResults(prev => ({ ...prev, [name]: 'success' }));
    } catch (error) {
      console.error(`${name} error:`, error);
      setTestResults(prev => ({ ...prev, [name]: 'error' }));
    }
  };

  const tests = [
    {
      name: 'Dashboard Stats',
      fn: () => dashboardService.getStats()
    },
    {
      name: 'Listar Médicos',
      fn: () => medicosService.list()
    },
    {
      name: 'Listar Pacientes',
      fn: () => pacientesService.list()
    },
    {
      name: 'Listar Procedimentos',
      fn: () => procedimentosService.list()
    },
  ];

  const testAll = async () => {
    for (const test of tests) {
      await testEndpoint(test.name, test.fn);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusIcon = (status?: 'loading' | 'success' | 'error') => {
    if (!status) return null;
    if (status === 'loading') return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Integração com API</CardTitle>
          <CardDescription>
            Teste se todos os endpoints estão respondendo corretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAll}>
              Testar Todos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestResults({})}
            >
              Limpar Resultados
            </Button>
          </div>

          <div className="space-y-2">
            {tests.map((test) => (
              <div
                key={test.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults[test.name])}
                  <span className="font-medium">{test.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => testEndpoint(test.name, test.fn)}
                  disabled={testResults[test.name] === 'loading'}
                >
                  Testar
                </Button>
              </div>
            ))}
          </div>

          {Object.keys(testResults).length > 0 && (
            <Alert>
              <AlertDescription>
                {Object.values(testResults).filter(r => r === 'success').length} de {Object.keys(testResults).length} testes passaram
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <DashboardPreview />
    </div>
  );
}

function DashboardPreview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    retry: false,
  });

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview do Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview do Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Erro ao carregar dados: {(error as Error).message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Preview do Dashboard</CardTitle>
        <CardDescription>Dados reais da API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Procedimentos</div>
            <div className="text-2xl font-bold">{data.totalProcedimentos}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Médicos</div>
            <div className="text-2xl font-bold">{data.totalMedicos}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Pacientes</div>
            <div className="text-2xl font-bold">{data.totalPacientes}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Faturamento</div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(data.faturamentoMes)}
            </div>
          </div>
        </div>

        {data.topMedicos && data.topMedicos.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Top Médicos</h3>
            <div className="space-y-2">
              {data.topMedicos.map((medico) => (
                <div key={medico.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{medico.nome}</span>
                  <span className="text-sm text-muted-foreground">
                    {medico.total} procedimentos
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
