# 🚀 Quick Start - MedControl

## Iniciando em 3 passos

### 1️⃣ Instalar dependências

```bash
cd medcontrol
npm install
```

### 2️⃣ Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

### 3️⃣ Acessar a aplicação

Abra seu navegador em: **http://localhost:5173**

## 🔐 Login (Modo Mock)

**Usuário**: qualquer texto
**Senha**: qualquer texto

> O modo mock está ativado por padrão (`VITE_USE_MOCKS=true`)

## ✅ O que você verá

- ✅ Tela de login moderna e responsiva
- ✅ Dashboard com indicadores de exemplo
- ✅ Menu lateral com navegação
- ✅ Dark mode funcional
- ✅ Layout totalmente responsivo

## 📂 Estrutura Principal

```
medcontrol/
├── src/
│   ├── features/auth/     # Login e autenticação
│   ├── components/        # Componentes reutilizáveis
│   ├── services/          # Integração com API
│   ├── stores/            # Estado global (Zustand)
│   └── types/             # TypeScript interfaces
├── README.md              # Documentação completa
├── BACKEND_INTEGRATION.md # Guia de integração
└── USAGE_EXAMPLES.md      # Exemplos de código
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Linter
```

## 🎯 Próximos Passos

1. **Explorar o código**: Veja `README.md` para estrutura completa
2. **Implementar páginas**: Use `USAGE_EXAMPLES.md` como referência
3. **Integrar backend**: Siga `BACKEND_INTEGRATION.md`

## 📚 Documentação

- **README.md**: Documentação completa do projeto
- **BACKEND_INTEGRATION.md**: Como conectar sua API
- **USAGE_EXAMPLES.md**: Exemplos práticos de uso

## 🆘 Problemas Comuns

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta 5173 em uso

```bash
# Usar outra porta
npm run dev -- --port 3000
```

### Dark mode não funciona

- Verifique se há classes `dark` no `<html>` element
- Limpe localStorage: `localStorage.clear()`

---

**MedControl** - Sistema de Gestão de Procedimentos Médicos
