# 🗄️ Modelo de Dados - MedControl

Este documento descreve a estrutura de dados esperada pelo frontend e serve como referência para implementação do backend.

## 📊 Diagrama de Relacionamentos

```
┌─────────────────┐
│     Medico      │
│─────────────────│
│ id              │◄────┐
│ nome            │     │
│ crm             │     │
│ especialidade   │     │
│ email           │     │
│ telefone        │     │
│ ativo           │     │
└─────────────────┘     │
                        │
                        │ medicoId
                        │
┌─────────────────┐     │      ┌─────────────────────┐
│    Paciente     │     │      │  TipoProcedimento   │
│─────────────────│     │      │─────────────────────│
│ id              │◄────┼──┐   │ id                  │◄───┐
│ nome            │     │  │   │ nome                │    │
│ cpf             │     │  │   │ descricao           │    │
│ dataNascimento  │     │  │   │ valorReferencia     │    │
│ telefone        │     │  │   │ ativo               │    │
│ email           │     │  │   └─────────────────────┘    │
│ endereco        │     │  │                              │
│ observacoes     │     │  │                              │
└─────────────────┘     │  │                              │
                        │  │                              │
                        │  │ pacienteId              tipoId
                        │  │                              │
                    ┌───┴──┴──────────────────────────────┘
                    │
              ┌─────▼─────────────┐
              │   Procedimento    │
              │───────────────────│
              │ id                │
              │ data              │
              │ tipoId            │
              │ medicoId          │
              │ pacienteId        │
              │ observacoes       │
              │ valor             │
              └───────────────────┘
```

## 📋 Entidades

### Medico

Armazena informações dos profissionais de saúde.

```typescript
{
  id: string;              // UUID gerado pelo backend
  nome: string;            // Nome completo
  crm: string;             // CRM + UF (ex: "12345-SP")
  especialidade: string;   // Especialidade médica
  email?: string;          // E-mail (opcional)
  telefone?: string;       // Telefone com DDD
  ativo: boolean;          // Status ativo/inativo
  createdAt?: string;      // ISO timestamp
  updatedAt?: string;      // ISO timestamp
}
```

**Validações:**
- `nome`: obrigatório, min 3 caracteres
- `crm`: obrigatório, único, formato "XXXXX-UF"
- `especialidade`: obrigatório
- `email`: opcional, único se fornecido, formato válido
- `telefone`: opcional, formato brasileiro
- `ativo`: obrigatório, default: true

**Índices sugeridos:**
- PRIMARY KEY: `id`
- UNIQUE: `crm`
- UNIQUE: `email` (where not null)

---

### Paciente

Armazena informações dos pacientes.

```typescript
{
  id: string;              // UUID
  nome: string;            // Nome completo
  cpf?: string;            // CPF formatado (123.456.789-00)
  dataNascimento?: string; // ISO date (YYYY-MM-DD)
  telefone?: string;       // Telefone com DDD
  email?: string;          // E-mail
  endereco?: string;       // Endereço completo
  observacoes?: string;    // Observações gerais
  createdAt?: string;      // ISO timestamp
  updatedAt?: string;      // ISO timestamp
}
```

**Validações:**
- `nome`: obrigatório, min 3 caracteres
- `cpf`: opcional, único se fornecido, formato válido
- `dataNascimento`: opcional, não pode ser futura
- `email`: opcional, formato válido
- `telefone`: opcional

**Índices sugeridos:**
- PRIMARY KEY: `id`
- UNIQUE: `cpf` (where not null)
- INDEX: `nome` (para buscas)
- INDEX: `email` (where not null)

---

### TipoProcedimento

Cataloga os tipos de procedimentos que podem ser realizados.

```typescript
{
  id: string;              // UUID
  nome: string;            // Nome do procedimento
  descricao?: string;      // Descrição detalhada
  valorReferencia?: number; // Valor de referência (R$)
  ativo: boolean;          // Status ativo/inativo
  createdAt?: string;      // ISO timestamp
  updatedAt?: string;      // ISO timestamp
}
```

**Validações:**
- `nome`: obrigatório, único
- `descricao`: opcional
- `valorReferencia`: opcional, >= 0
- `ativo`: obrigatório, default: true

**Índices sugeridos:**
- PRIMARY KEY: `id`
- UNIQUE: `nome`
- INDEX: `ativo`

**Exemplos:**
- Consulta
- Exame
- Cirurgia
- Retorno
- Procedimento Ambulatorial
- Emergência

---

### Procedimento

Registro central do sistema - cada procedimento realizado.

```typescript
{
  id: string;              // UUID
  data: string;            // ISO timestamp do procedimento
  tipoId: string;          // FK → TipoProcedimento
  medicoId: string;        // FK → Medico
  pacienteId: string;      // FK → Paciente
  observacoes?: string;    // Observações do procedimento
  valor?: number;          // Valor cobrado (R$)
  createdAt?: string;      // ISO timestamp
  updatedAt?: string;      // ISO timestamp
}
```

**Validações:**
- `data`: obrigatório, não pode ser futura
- `tipoId`: obrigatório, deve existir em TipoProcedimento
- `medicoId`: obrigatório, deve existir em Medico
- `pacienteId`: obrigatório, deve existir em Paciente
- `valor`: opcional, >= 0

**Índices sugeridos:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `tipoId` → TipoProcedimento(id)
- FOREIGN KEY: `medicoId` → Medico(id)
- FOREIGN KEY: `pacienteId` → Paciente(id)
- INDEX: `data` (para filtros por período)
- INDEX: `medicoId` (para relatórios)
- INDEX: `pacienteId` (para histórico)

---

### ProcedimentoView (View Expandida)

Quando o frontend solicita `?expand=tipo,medico,paciente`, o backend deve retornar:

```typescript
{
  // Campos do Procedimento
  id: string;
  data: string;
  tipoId: string;
  medicoId: string;
  pacienteId: string;
  observacoes?: string;
  valor?: number;
  
  // Objetos expandidos
  tipo: TipoProcedimento;      // Objeto completo
  medico: Medico;              // Objeto completo
  paciente: Paciente;          // Objeto completo
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}
```

**Implementação sugerida (SQL):**
```sql
SELECT 
  p.*,
  json_build_object(
    'id', tp.id,
    'nome', tp.nome,
    'descricao', tp.descricao,
    'valorReferencia', tp.valor_referencia,
    'ativo', tp.ativo
  ) as tipo,
  json_build_object(
    'id', m.id,
    'nome', m.nome,
    'crm', m.crm,
    'especialidade', m.especialidade,
    'ativo', m.ativo
  ) as medico,
  json_build_object(
    'id', pac.id,
    'nome', pac.nome,
    'cpf', pac.cpf,
    'dataNascimento', pac.data_nascimento
  ) as paciente
FROM procedimentos p
LEFT JOIN tipos_procedimento tp ON p.tipo_id = tp.id
LEFT JOIN medicos m ON p.medico_id = m.id
LEFT JOIN pacientes pac ON p.paciente_id = pac.id
WHERE ...
```

---

## 🔗 Relacionamentos

### One-to-Many

- **Medico** → **Procedimento**: Um médico pode realizar vários procedimentos
- **Paciente** → **Procedimento**: Um paciente pode ter vários procedimentos
- **TipoProcedimento** → **Procedimento**: Um tipo pode ser usado em vários procedimentos

### Regras de Integridade

**DELETE CASCADE:**
- Não recomendado para este sistema (preservar histórico)

**DELETE RESTRICT:**
- Medico: Não pode ser deletado se tiver procedimentos
- Paciente: Não pode ser deletado se tiver procedimentos
- TipoProcedimento: Não pode ser deletado se tiver procedimentos

**Soft Delete (Recomendado):**
- Use campo `ativo: boolean` ou `deletedAt: timestamp`
- Permite manter histórico e integridade referencial

---

## 📊 Queries Comuns

### 1. Listar procedimentos de um paciente

```sql
SELECT p.*, tp.nome as tipo_nome, m.nome as medico_nome
FROM procedimentos p
JOIN tipos_procedimento tp ON p.tipo_id = tp.id
JOIN medicos m ON p.medico_id = m.id
WHERE p.paciente_id = :pacienteId
ORDER BY p.data DESC;
```

### 2. Estatísticas para dashboard

```sql
-- Total de procedimentos
SELECT COUNT(*) FROM procedimentos;

-- Procedimentos no mês atual
SELECT COUNT(*) FROM procedimentos 
WHERE data >= date_trunc('month', CURRENT_DATE);

-- Procedimentos por tipo
SELECT tp.nome, COUNT(p.id) as quantidade
FROM procedimentos p
JOIN tipos_procedimento tp ON p.tipo_id = tp.id
GROUP BY tp.id, tp.nome
ORDER BY quantidade DESC;

-- Procedimentos por médico
SELECT m.nome, COUNT(p.id) as quantidade
FROM procedimentos p
JOIN medicos m ON p.medico_id = m.id
GROUP BY m.id, m.nome
ORDER BY quantidade DESC
LIMIT 10;
```

### 3. Evolução mensal (últimos 6 meses)

```sql
SELECT 
  TO_CHAR(data, 'Mon') as mes,
  COUNT(*) as quantidade
FROM procedimentos
WHERE data >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', data), TO_CHAR(data, 'Mon')
ORDER BY DATE_TRUNC('month', data);
```

---

## 🔐 Considerações de Segurança

### Dados Sensíveis

**Criptografar em repouso:**
- CPF dos pacientes
- Dados de contato (telefone, email)
- Observações médicas

**Logs de auditoria:**
- Criação de procedimentos
- Edição de dados de pacientes
- Exclusão de registros

### LGPD / Privacidade

- Consentimento do paciente para armazenamento de dados
- Direito ao esquecimento (soft delete)
- Anonimização para relatórios agregados
- Acesso restrito por role

---

## 🚀 Performance

### Índices Recomendados

```sql
-- Procedimentos
CREATE INDEX idx_procedimentos_data ON procedimentos(data);
CREATE INDEX idx_procedimentos_medico ON procedimentos(medico_id);
CREATE INDEX idx_procedimentos_paciente ON procedimentos(paciente_id);
CREATE INDEX idx_procedimentos_tipo ON procedimentos(tipo_id);

-- Pacientes
CREATE INDEX idx_pacientes_nome ON pacientes(nome);
CREATE INDEX idx_pacientes_cpf ON pacientes(cpf) WHERE cpf IS NOT NULL;

-- Médicos
CREATE INDEX idx_medicos_nome ON medicos(nome);
CREATE INDEX idx_medicos_ativo ON medicos(ativo);
```

### Particionamento (Para volume alto)

```sql
-- Particionar procedimentos por ano
CREATE TABLE procedimentos_2024 PARTITION OF procedimentos
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## 📝 Script de Criação (PostgreSQL)

```sql
-- Criar banco
CREATE DATABASE medcontrol;

-- Médicos
CREATE TABLE medicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  crm VARCHAR(20) NOT NULL UNIQUE,
  especialidade VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pacientes
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  data_nascimento DATE,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de Procedimento
CREATE TABLE tipos_procedimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  valor_referencia DECIMAL(10, 2),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedimentos
CREATE TABLE procedimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data TIMESTAMP NOT NULL,
  tipo_id UUID NOT NULL REFERENCES tipos_procedimento(id),
  medico_id UUID NOT NULL REFERENCES medicos(id),
  paciente_id UUID NOT NULL REFERENCES pacientes(id),
  observacoes TEXT,
  valor DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_procedimentos_data ON procedimentos(data);
CREATE INDEX idx_procedimentos_medico ON procedimentos(medico_id);
CREATE INDEX idx_procedimentos_paciente ON procedimentos(paciente_id);
CREATE INDEX idx_procedimentos_tipo ON procedimentos(tipo_id);
CREATE INDEX idx_pacientes_nome ON pacientes(nome);
CREATE INDEX idx_medicos_nome ON medicos(nome);
```

---

**Última atualização**: 2024-12-23
