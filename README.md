# 🏥 MedControl - Portal de Gestão Médica

Portal web moderno para gestão de procedimentos médicos, desenvolvido com **React + TypeScript** e arquitetura **API-first**.

## 🎯 Sobre o Projeto

Sistema criado para digitalizar registros de procedimentos médicos realizados em cadernos, permitindo:

- ✅ Cadastro de pacientes e médicos
- ✅ Registro detalhado de procedimentos
- ✅ Dashboard com indicadores em tempo real
- ✅ Gestão de tipos de procedimentos
- ✅ Relatórios e análises

## 🚀 Tecnologias

- **Build**: Vite
- **Framework**: React 18
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS + shadcn/ui
- **Estado**: Zustand (com persist)
- **Rotas**: React Router v6
- **HTTP**: Axios
- **Formulários**: react-hook-form + zod
- **Notificações**: sonner
- **Ícones**: lucide-react

## 📁 Estrutura do Projeto

```
src/
├── app/
│   └── routes.tsx              # Definição de rotas
├── components/
│   ├── layout/                 # Layout components (Sidebar, Topbar, AppLayout)
│   └── ui/                     # Componentes UI base (shadcn)
├── features/
│   ├── auth/                   # Autenticação
│   │   ├── pages/             # LoginPage, ForgotPasswordPage
│   │   ├── services/          # auth.service.ts
│   │   └── stores/            # auth.store.ts
│   └── home/                   # Dashboard
│       └── pages/             # HomePage
├── lib/
│   ├── env.ts                 # Variáveis de ambiente
│   ├── guards.tsx             # Guards de rotas (PrivateRoute)
│   └── utils.ts               # Utilitários (cn, formatters)
├── services/
│   ├── http.ts                # Cliente Axios configurado
│   ├── mocks/                 # Dados mock para desenvolvimento
│   │   └── data.ts
│   ├── auth.service.ts
│   ├── dashboard.service.ts
│   ├── medicos.service.ts
│   ├── pacientes.service.ts
│   ├── procedimentos.service.ts
│   ├── tipos-procedimento.service.ts
│   ├── me.service.ts
│   └── menu.service.ts
├── stores/
│   └── ui.store.ts            # Estado global de UI (tema, sidebar)
├── styles/
│   └── globals.css            # Estilos globais + Tailwind
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx
└── main.tsx
```

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passo a Passo

1. **Clone o repositório** (ou navegue até o diretório)

```bash
cd medcontrol
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

O arquivo `.env` já está configurado para desenvolvimento:

```env
VITE_APP_NAME=MedControl
VITE_APP_VERSION=0.1.0
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCKS=true
```

4. **Execute o projeto**

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## 🔐 Login (Modo Mock)

Com `VITE_USE_MOCKS=true`, você pode fazer login com **qualquer usuário/senha**.

Exemplos:
- **Usuário**: `admin@medcontrol.com`
- **Senha**: `qualquer`

## 🎨 Funcionalidades Implementadas

### ✅ Autenticação
- Tela de login moderna e responsiva
- Recuperação de senha (mock)
- Persistência de sessão (localStorage)
- Guards para rotas privadas
- Redirecionamento automático em 401

### ✅ Layout Principal
- Sidebar colapsável com menu aninhado
- Controle de acesso por role (ADMIN, USER)
- Topbar com busca, tema dark/light e menu de usuário
- Design responsivo (mobile-first)

### ✅ Dashboard
- Cards com indicadores principais
- Gráficos de procedimentos por tipo
- Ranking de médicos
- Evolução mensal

### ✅ Camada de Services
- Cliente HTTP configurado (Axios)
- Interceptadores para token e tratamento de erros
- Services isolados para cada entidade:
  - `authService` - Autenticação
  - `medicosService` - CRUD de médicos
  - `pacientesService` - CRUD de pacientes
  - `procedimentosService` - CRUD de procedimentos
  - `tiposProcedimentoService` - CRUD de tipos
  - `dashboardService` - Estatísticas
- Mocks completos para desenvolvimento

## 📋 Contratos de API (Endpoints Esperados)

### Autenticação
```
POST /auth/login
  Body: { username: string, password: string }
  Response: { accessToken: string, user: Me }

POST /auth/logout

POST /auth/forgot-password
  Body: { email: string }
```

### Usuário
```
GET /me
  Response: Me

PATCH /me
  Body: Partial<Me>

GET /me/menus
  Response: MenuItem[]
```

### Médicos
```
GET /medicos?page=1&limit=20
  Response: PaginatedResponse<Medico>

GET /medicos/:id
  Response: Medico

POST /medicos
  Body: MedicoInput

PATCH /medicos/:id
  Body: Partial<MedicoInput>

DELETE /medicos/:id
```

### Pacientes
```
GET /pacientes?page=1&limit=20
POST /pacientes
GET /pacientes/:id
PATCH /pacientes/:id
DELETE /pacientes/:id
GET /pacientes/:id/procedimentos
```

### Procedimentos
```
GET /procedimentos?page=1&limit=20&expand=tipo,medico,paciente
POST /procedimentos
GET /procedimentos/:id?expand=tipo,medico,paciente
PATCH /procedimentos/:id
DELETE /procedimentos/:id
```

### Tipos de Procedimento
```
GET /tipos-procedimento
POST /tipos-procedimento
GET /tipos-procedimento/:id
PATCH /tipos-procedimento/:id
DELETE /tipos-procedimento/:id
```

### Dashboard
```
GET /dashboard/stats
  Response: DashboardStats
```

## 🔄 Alternando entre Mock e API Real

Para conectar à API real, altere no arquivo `.env`:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=https://sua-api.com/api
```

## 🎯 Próximos Passos / Implementações Futuras

- [ ] Páginas de listagem (Pacientes, Médicos, Procedimentos)
- [ ] Formulários de cadastro/edição
- [ ] Sistema de busca e filtros
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Upload de arquivos/documentos
- [ ] Validações de formulário mais robustas
- [ ] Testes unitários (Vitest)
- [ ] Internacionalização (i18n)

## 📦 Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Gera build de produção
npm run preview    # Preview do build de produção
npm run lint       # Executa o linter
```

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para uso interno.

---

**MedControl** v0.1.0 - Desenvolvido com ❤️ usando React + TypeScript
