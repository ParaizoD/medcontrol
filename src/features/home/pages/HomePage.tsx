import { useEffect, useState } from 'react';
import { Activity, Users, Stethoscope, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardStats } from '@/types';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-3/4 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos procedimentos e estatísticas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Procedimentos
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcedimentos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.procedimentosMes} neste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPacientes}</div>
            <p className="text-xs text-muted-foreground mt-1">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Médicos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedicos}</div>
            <p className="text-xs text-muted-foreground mt-1">Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.procedimentosMes}</div>
            <p className="text-xs text-muted-foreground mt-1">Procedimentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Procedimentos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Procedimentos por Tipo</CardTitle>
            <CardDescription>
              Distribuição dos tipos mais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.procedimentosPorTipo.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(idx * 360) / stats.procedimentosPorTipo.length}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-sm">{item.tipo}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procedimentos por Médico */}
        <Card>
          <CardHeader>
            <CardTitle>Procedimentos por Médico</CardTitle>
            <CardDescription>Top médicos com mais procedimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.procedimentosPorMedico.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{item.medico}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(item.quantidade / stats.procedimentosPorMedico[0].quantidade) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {item.quantidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>
            Quantidade de procedimentos nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.evolucaoMensal.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted rounded-t-lg relative group">
                  <div
                    className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                    style={{
                      height: `${(item.quantidade / Math.max(...stats.evolucaoMensal.map((m) => m.quantidade))) * 200}px`,
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold bg-popover px-2 py-1 rounded border">
                      {item.quantidade}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.mes}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
