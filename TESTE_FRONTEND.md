# 🧪 Guia de Teste - Frontend Integrado

## 🎯 **Objetivo**

Testar se o frontend React está consumindo corretamente a API FastAPI com dados reais do Supabase.

---

## ✅ **Pré-requisitos**

Antes de começar:

```
□ Backend rodando (http://localhost:8000)
□ Dados importados (pelo menos alguns procedimentos)
□ Frontend com VITE_USE_MOCKS=false
□ Token JWT válido (login funcionando)
```

---

## 🚀 **Testes Rápidos**

### **1️⃣ Teste de Conexão**

**Página:** http://localhost:5173/app/test

Esta página testa todos os endpoints automaticamente:
- ✅ GET /dashboard/stats
- ✅ GET /medicos
- ✅ GET /pacientes
- ✅ GET /procedimentos

**Resultado esperado:**
- Todos os testes com ✅ verde
- Preview do dashboard com dados reais

---

### **2️⃣ Dashboard**

**Página:** http://localhost:5173/app/dashboard

**O que testar:**
- ✅ Cards mostram números reais (não mock)
- ✅ Top médicos aparecem
- ✅ Gráfico de procedimentos por mês
- ✅ Lista de últimos procedimentos

**Como saber se está usando dados reais:**
- Números batem com o que você importou
- Nomes de médicos/pacientes são os que você criou
- Não aparecem dados fictícios (Dr. Silva Mock, etc)

---

### **3️⃣ Lista de Médicos**

**Página:** http://localhost:5173/app/medicos

**O que testar:**
- ✅ Mostra médicos criados via import
- ✅ Busca funciona (digite parte do nome)
- ✅ CRM aparece como vazio (ainda não editado)
- ✅ Especialidade: "A definir"

**Teste de busca:**
1. Digite "Dr" na busca
2. Deve filtrar só médicos com "Dr" no nome

---

### **4️⃣ Lista de Pacientes**

**Página:** http://localhost:5173/app/pacientes

**O que testar:**
- ✅ Mostra pacientes criados via import
- ✅ Busca funciona
- ✅ CPF aparece vazio (não foi preenchido no import)

---

### **5️⃣ Lista de Procedimentos**

**Página:** http://localhost:5173/app/procedimentos

**O que testar:**
- ✅ Mostra procedimentos importados
- ✅ Data, tipo, médico, paciente aparecem
- ✅ Filtros funcionam (por data, médico, paciente)
- ✅ Paginação funciona

**Teste de filtros:**
1. Filtrar por data (ex: janeiro/2024)
2. Deve mostrar só procedimentos daquele mês

---

### **6️⃣ Import de CSV**

**Página:** http://localhost:5173/app/import

**O que testar:**
- ✅ Upload de CSV funciona
- ✅ Preview mostra dados
- ✅ Validação funciona
- ✅ Import executa e retorna estatísticas
- ✅ Após import, novos dados aparecem no dashboard

**Teste completo:**
1. Crie arquivo `teste.csv`:
```csv
data,nome do procedimento,nome dos medicos,nome do paciente
2024-12-27,Consulta,Dr. Teste Frontend,Paciente Teste
```
2. Faça upload
3. Valide
4. Importe
5. Vá no dashboard → deve ter +1 procedimento
6. Vá em médicos → deve ter "Dr. Teste Frontend"

---

## 🐛 **Troubleshooting**

### **Problema: Dashboard mostra 0 em tudo**

**Causa:** Backend não tem dados OU frontend em modo mock

**Solução:**
1. Verifique `.env`: `VITE_USE_MOCKS=false`
2. Importe dados via `/app/import`
3. Reinicie frontend

---

### **Problema: Erro 401 Unauthorized**

**Causa:** Token expirado ou inválido

**Solução:**
1. Faça logout
2. Faça login novamente
3. Teste novamente

---

### **Problema: Dados não atualizam**

**Causa:** Cache do React Query

**Solução:**
1. Recarregue a página (F5)
2. Ou force refresh no componente

---

### **Problema: "Failed to fetch"**

**Causa:** Backend não está rodando OU CORS

**Solução:**
1. Verifique: http://localhost:8000/api/docs
2. Se não abrir → backend está parado
3. Se abrir → verifique console do navegador (F12)

---

## 📊 **Validação de Dados**

### **Compare Supabase vs Frontend**

1. **Supabase Table Editor:**
   - Vá em `procedimentos`
   - Conte quantos registros tem

2. **Frontend Dashboard:**
   - Deve mostrar o mesmo número

3. **Se não bater:**
   - Frontend está em modo mock
   - OU cache antigo
   - OU erro na API

---

## ✅ **Checklist de Sucesso**

```
□ Página /app/test → todos os testes verdes
□ Dashboard mostra números reais (não 0)
□ Lista de médicos mostra médicos importados
□ Lista de pacientes mostra pacientes importados
□ Lista de procedimentos mostra dados reais
□ Busca funciona em todas as listas
□ Import de CSV cria novos registros
□ Novos registros aparecem imediatamente no dashboard
```

---

## 🎯 **Teste End-to-End Completo**

### **Fluxo:**

1. **Login**
   - http://localhost:5173
   - Email: admin@medcontrol.com
   - Senha: admin123

2. **Dashboard Vazio**
   - Deve mostrar 0 procedimentos (se novo)

3. **Import CSV**
   - Upload de 5-10 procedimentos
   - Validar
   - Importar

4. **Verificar Dashboard**
   - Deve mostrar: 5-10 procedimentos
   - Top médicos aparece
   - Gráfico atualiza

5. **Ver Listas**
   - Médicos → mostra criados
   - Pacientes → mostra criados
   - Procedimentos → mostra todos

6. **Buscar**
   - Buscar médico por nome → funciona
   - Buscar paciente por nome → funciona

7. **Filtrar Procedimentos**
   - Por data → funciona
   - Por médico → funciona

**Se tudo funcionou → FRONTEND 100% INTEGRADO! 🎉**

---

## 🔧 **Configurações Importantes**

### **Arquivo .env do Frontend**

```env
VITE_USE_MOCKS=false          # DEVE SER false
VITE_API_BASE_URL=http://localhost:8000/api
```

### **Verificar no Console (F12)**

Se algo não funciona:
1. Abra DevTools (F12)
2. Aba **Network**
3. Veja se requests estão indo para `localhost:8000`
4. Status deve ser **200 OK** (não 401, 404, 500)

---

## 📝 **Próximos Passos**

Depois de testar tudo:

**A)** Criar páginas de **edição**
- Editar médico (adicionar CRM)
- Editar paciente (adicionar CPF)
- Editar procedimento

**B)** Melhorar **Dashboard**
- Gráficos mais bonitos
- Filtros por período
- Export para Excel

**C)** **Relatórios**
- Por médico
- Por mês
- Faturamento

---

**Teste tudo e me avise o resultado!** 🚀
