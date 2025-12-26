# 🔌 Guia de Integração com Backend

Este documento descreve como integrar o MedControl com sua API backend.

## 📋 Checklist de Integração

### 1. Configuração Inicial

- [ ] Alterar `.env`:
  ```env
  VITE_USE_MOCKS=false
  VITE_API_BASE_URL=https://sua-api.com/api
  ```

- [ ] Configurar CORS no backend para aceitar requests de:
  - `http://localhost:5173` (desenvolvimento)
  - `https://seu-dominio.com` (produção)

### 2. Autenticação

O frontend espera os seguintes headers e formato de resposta:

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "optional-refresh-token",
  "user": {
    "id": "uuid",
    "name": "Dr. João Silva",
    "email": "joao@email.com",
    "roles": ["ADMIN", "MEDICO"],
    "avatar": "https://optional-url.com/avatar.jpg"
  }
}
```

**Autenticação subsequente:**

Todas as requests após login incluem o header:
```
Authorization: Bearer {accessToken}
```

### 3. Tratamento de Erros

O frontend trata automaticamente:

- **401 Unauthorized**: Limpa sessão e redireciona para `/login`
- **400/422**: Exibe mensagem de validação
- **500**: Exibe erro genérico

**Formato de erro esperado:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Mensagem amigável ao usuário",
  "details": {
    "field": "descrição do erro"
  }
}
```

### 4. Paginação

Endpoints de listagem devem suportar query params:

```
GET /pacientes?page=1&limit=20&sort=-createdAt
```

**Response esperada:**
```json
{
  "data": [/* array de itens */],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### 5. Expansão de Relacionamentos

Para endpoints como `/procedimentos`, o frontend usa `expand`:

```
GET /procedimentos?expand=tipo,medico,paciente
```

O backend deve retornar os objetos completos ao invés de apenas IDs:

```json
{
  "id": "1",
  "data": "2024-12-01T10:00:00Z",
  "tipo": {
    "id": "1",
    "nome": "Consulta",
    "descricao": "..."
  },
  "medico": {
    "id": "1",
    "nome": "Dr. Carlos Silva",
    "crm": "12345-SP"
  },
  "paciente": {
    "id": "1",
    "nome": "Maria Santos",
    "cpf": "123.456.789-00"
  }
}
```

## 🔧 Endpoints Detalhados

### Médicos

```typescript
// Listar
GET /medicos?page=1&limit=20
Response: {
  data: Medico[],
  meta: { total, page, limit, totalPages }
}

// Buscar por ID
GET /medicos/:id
Response: Medico

// Criar
POST /medicos
Body: {
  nome: string,
  crm: string,
  especialidade: string,
  email?: string,
  telefone?: string,
  ativo: boolean
}
Response: Medico

// Atualizar
PATCH /medicos/:id
Body: Partial<MedicoInput>
Response: Medico

// Deletar
DELETE /medicos/:id
Response: 204 No Content
```

### Pacientes

```typescript
// Estrutura similar a Médicos
GET /pacientes
POST /pacientes
GET /pacientes/:id
PATCH /pacientes/:id
DELETE /pacientes/:id

// Adicional: Procedimentos de um paciente
GET /pacientes/:id/procedimentos
Response: ProcedimentoView[]
```

### Procedimentos

```typescript
GET /procedimentos?expand=tipo,medico,paciente
POST /procedimentos
GET /procedimentos/:id?expand=tipo,medico,paciente
PATCH /procedimentos/:id
DELETE /procedimentos/:id

// Body para criar/atualizar:
{
  data: string,        // ISO date
  tipoId: string,
  medicoId: string,
  pacienteId: string,
  observacoes?: string,
  valor?: number
}
```

### Dashboard

```typescript
GET /dashboard/stats
Response: {
  totalProcedimentos: number,
  totalPacientes: number,
  totalMedicos: number,
  procedimentosMes: number,
  procedimentosPorTipo: Array<{
    tipo: string,
    quantidade: number
  }>,
  procedimentosPorMedico: Array<{
    medico: string,
    quantidade: number
  }>,
  evolucaoMensal: Array<{
    mes: string,
    quantidade: number
  }>
}
```

### Menu Dinâmico (Opcional)

Se quiser controlar o menu pelo backend:

```typescript
GET /me/menus
Response: MenuItem[]

type MenuItem = {
  id: string,
  label: string,
  to?: string,
  icon?: string,  // Nome do ícone do lucide-react
  children?: MenuItem[],
  roles?: string[]
}
```

## 🔐 Segurança

### JWT Token

O frontend espera que o backend:

1. Valide o token em cada request
2. Retorne `401` quando token for inválido/expirado
3. Opcionalmente, implemente refresh token

### Rate Limiting

Recomendado limitar requests por:
- IP: 100 req/min
- Usuário autenticado: 1000 req/min

### HTTPS

Em produção, sempre usar HTTPS e configurar:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 📊 Validações Backend

O backend deve validar:

### Médicos
- [ ] CRM único
- [ ] Formato válido de CRM (ex: 12345-UF)
- [ ] Email único (se fornecido)
- [ ] Telefone no formato brasileiro

### Pacientes
- [ ] CPF válido e único
- [ ] Data de nascimento não no futuro
- [ ] Email único (se fornecido)

### Procedimentos
- [ ] Data não no futuro
- [ ] Médico, paciente e tipo existem
- [ ] Valor >= 0

## 🧪 Testando a Integração

1. **Desligar mocks:**
   ```env
   VITE_USE_MOCKS=false
   ```

2. **Verificar network tab** no DevTools:
   - Requests devem ir para `VITE_API_BASE_URL`
   - Token deve estar no header `Authorization`

3. **Testar fluxos:**
   - [ ] Login com credenciais válidas
   - [ ] Login com credenciais inválidas
   - [ ] Acesso a rota protegida sem token
   - [ ] Acesso com token expirado
   - [ ] CRUD de cada entidade
   - [ ] Paginação
   - [ ] Dashboard com dados reais

## 🐛 Debugging

### Frontend não recebe dados

1. Verificar CORS no backend
2. Verificar formato da response (deve ser JSON)
3. Verificar status codes (200, 201, 204)

### Token não está sendo enviado

1. Verificar se login foi bem-sucedido
2. Verificar localStorage: `auth-storage`
3. Verificar interceptor em `services/http.ts`

### Erro 401 em loop

1. Verificar se endpoint `/auth/login` não requer autenticação
2. Verificar se token está no formato correto

## 📞 Suporte

Para dúvidas sobre integração, consulte:
- TypeScript types em `src/types/index.ts`
- Services em `src/services/*.service.ts`
- Dados mock em `src/services/mocks/data.ts`

---

**Última atualização:** 2024-12-23
