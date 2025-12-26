# 💡 Exemplos de Uso dos Services

Este documento contém exemplos práticos de como usar os services do MedControl em suas páginas e componentes.

## 🔐 Autenticação

### Login
```typescript
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { toast } from 'sonner';

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await authService.login({ username, password });
    useAuthStore.getState().setSession(response.accessToken, response.user);
    toast.success(`Bem-vindo, ${response.user.name}!`);
  } catch (error) {
    toast.error('Erro ao fazer login');
  }
};
```

### Logout
```typescript
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useNavigate } from 'react-router-dom';

const handleLogout = () => {
  useAuthStore.getState().clear();
  navigate('/login');
};
```

## 👨‍⚕️ Médicos

### Listar médicos
```typescript
import { useEffect, useState } from 'react';
import { medicosService } from '@/services/medicos.service';
import type { Medico } from '@/types';

function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicos();
  }, []);

  const loadMedicos = async () => {
    try {
      const response = await medicosService.list({ page: 1, limit: 20 });
      setMedicos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {medicos.map(m => (
            <li key={m.id}>{m.nome} - {m.crm}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Criar médico
```typescript
import { useForm } from 'react-hook-form';
import { medicosService } from '@/services/medicos.service';
import type { MedicoInput } from '@/types';

function NovoMedicoForm() {
  const { register, handleSubmit } = useForm<MedicoInput>();

  const onSubmit = async (data: MedicoInput) => {
    try {
      const medico = await medicosService.create(data);
      toast.success('Médico cadastrado com sucesso!');
      // Redirecionar ou limpar form
    } catch (error) {
      toast.error('Erro ao cadastrar médico');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nome')} placeholder="Nome" />
      <input {...register('crm')} placeholder="CRM" />
      <input {...register('especialidade')} placeholder="Especialidade" />
      <button type="submit">Salvar</button>
    </form>
  );
}
```

### Atualizar médico
```typescript
const handleUpdate = async (id: string, changes: Partial<MedicoInput>) => {
  try {
    await medicosService.update(id, changes);
    toast.success('Médico atualizado!');
    loadMedicos(); // Recarregar lista
  } catch (error) {
    toast.error('Erro ao atualizar');
  }
};
```

### Deletar médico
```typescript
const handleDelete = async (id: string) => {
  if (!confirm('Deseja realmente excluir este médico?')) return;
  
  try {
    await medicosService.delete(id);
    toast.success('Médico excluído!');
    setMedicos(prev => prev.filter(m => m.id !== id));
  } catch (error) {
    toast.error('Erro ao excluir');
  }
};
```

## 👥 Pacientes

### Buscar paciente por ID com histórico de procedimentos
```typescript
import { pacientesService } from '@/services/pacientes.service';
import { procedimentosService } from '@/services/procedimentos.service';

const loadPacienteDetalhes = async (id: string) => {
  try {
    const [paciente, procedimentos] = await Promise.all([
      pacientesService.getById(id),
      procedimentosService.getByPaciente(id)
    ]);

    console.log('Paciente:', paciente);
    console.log('Procedimentos:', procedimentos);
  } catch (error) {
    toast.error('Erro ao carregar dados');
  }
};
```

### Criar paciente com validação
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  dataNascimento: z.string(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
});

type FormData = z.infer<typeof schema>;

function NovoPacienteForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await pacientesService.create(data);
      toast.success('Paciente cadastrado!');
    } catch (error) {
      toast.error('Erro ao cadastrar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('nome')} />
        {errors.nome && <p>{errors.nome.message}</p>}
      </div>
      <div>
        <input {...register('cpf')} />
        {errors.cpf && <p>{errors.cpf.message}</p>}
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
}
```

## 💉 Procedimentos

### Listar procedimentos com dados expandidos
```typescript
import { procedimentosService } from '@/services/procedimentos.service';
import type { ProcedimentoView } from '@/types';

const loadProcedimentos = async () => {
  try {
    // Retorna com tipo, médico e paciente expandidos
    const response = await procedimentosService.list({ page: 1, limit: 50 });
    
    response.data.forEach(proc => {
      console.log(`${proc.tipo.nome} - Dr. ${proc.medico.nome} - ${proc.paciente.nome}`);
    });
  } catch (error) {
    toast.error('Erro ao carregar procedimentos');
  }
};
```

### Criar procedimento
```typescript
import { procedimentosService } from '@/services/procedimentos.service';
import type { ProcedimentoInput } from '@/types';

const handleNovoProcedimento = async () => {
  const novoProcedimento: ProcedimentoInput = {
    data: new Date().toISOString(),
    tipoId: '1',
    medicoId: '1',
    pacienteId: '1',
    observacoes: 'Consulta de rotina',
    valor: 200.00
  };

  try {
    await procedimentosService.create(novoProcedimento);
    toast.success('Procedimento registrado!');
  } catch (error) {
    toast.error('Erro ao registrar procedimento');
  }
};
```

### Filtrar procedimentos por data
```typescript
// Backend deve implementar filtros via query params
const loadProcedimentosPorPeriodo = async (inicio: string, fim: string) => {
  try {
    const response = await procedimentosService.list({
      page: 1,
      limit: 100,
      // Backend deve processar esses filtros
      // @ts-ignore - adicionar filtros customizados
      dataInicio: inicio,
      dataFim: fim
    });
    
    return response.data;
  } catch (error) {
    toast.error('Erro ao filtrar procedimentos');
  }
};
```

## 📊 Dashboard

### Carregar estatísticas
```typescript
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardStats } from '@/types';

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
    }
  };

  return (
    <div>
      {stats && (
        <>
          <h2>Total de Procedimentos: {stats.totalProcedimentos}</h2>
          <h2>Pacientes Cadastrados: {stats.totalPacientes}</h2>
          
          <h3>Procedimentos por Tipo:</h3>
          <ul>
            {stats.procedimentosPorTipo.map(item => (
              <li key={item.tipo}>{item.tipo}: {item.quantidade}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
```

## 🎨 Tipos de Procedimento

### Listar apenas ativos
```typescript
import { tiposProcedimentoService } from '@/services/tipos-procedimento.service';

const loadTiposAtivos = async () => {
  try {
    const response = await tiposProcedimentoService.list();
    const ativos = response.data.filter(t => t.ativo);
    return ativos;
  } catch (error) {
    toast.error('Erro ao carregar tipos');
  }
};
```

### Usar em select/dropdown
```typescript
function ProcedimentoForm() {
  const [tipos, setTipos] = useState<TipoProcedimento[]>([]);

  useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    const response = await tiposProcedimentoService.list();
    setTipos(response.data.filter(t => t.ativo));
  };

  return (
    <select name="tipoId">
      <option value="">Selecione...</option>
      {tipos.map(tipo => (
        <option key={tipo.id} value={tipo.id}>
          {tipo.nome} - R$ {tipo.valorReferencia?.toFixed(2)}
        </option>
      ))}
    </select>
  );
}
```

## 🔄 Tratamento de Erros

### Padrão recomendado
```typescript
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.message) {
      toast.error(apiError.message);
    } else if (error.response?.status === 404) {
      toast.error('Recurso não encontrado');
    } else if (error.response?.status === 403) {
      toast.error('Você não tem permissão para esta ação');
    } else {
      toast.error('Erro ao processar requisição');
    }
  } else {
    toast.error('Erro desconhecido');
  }
};

// Uso:
try {
  await medicosService.create(data);
} catch (error) {
  handleApiError(error);
}
```

## 🎯 Custom Hooks

### useDataLoader (reutilizável)
```typescript
import { useState, useEffect } from 'react';

function useDataLoader<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload: load };
}

// Uso:
function MedicosPage() {
  const { data, loading, reload } = useDataLoader(() => 
    medicosService.list().then(r => r.data)
  );

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <button onClick={reload}>Recarregar</button>
      <ul>
        {data?.map(m => <li key={m.id}>{m.nome}</li>)}
      </ul>
    </>
  );
}
```

## 🔍 Busca e Filtros

### Implementação de busca local
```typescript
function PacientesSearchable() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [search, setSearch] = useState('');

  const filtered = pacientes.filter(p => 
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf?.includes(search)
  );

  return (
    <>
      <input 
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nome ou CPF..."
      />
      <ul>
        {filtered.map(p => <li key={p.id}>{p.nome}</li>)}
      </ul>
    </>
  );
}
```

---

**Dica**: Sempre que possível, extraia lógica de serviços para custom hooks reutilizáveis!
