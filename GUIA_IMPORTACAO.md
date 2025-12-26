# 📥 Guia de Importação de Dados - MedControl

## 🎯 Objetivo

Sistema de importação em massa de procedimentos médicos via arquivo CSV, com criação automática de médicos, pacientes e tipos de procedimento.

---

## 📋 Formato do CSV

### Campos Obrigatórios

| Campo | Descrição | Exemplo | Formato |
|-------|-----------|---------|---------|
| **data** | Data do procedimento | `2024-01-15` ou `15/01/2024` | YYYY-MM-DD ou DD/MM/YYYY |
| **nome do procedimento** | Tipo do procedimento | `Consulta`, `Exame` | Texto livre |
| **nome dos medicos** | Nome do médico | `Dr. João Silva` | Texto livre |
| **nome do paciente** | Nome do paciente | `Maria Santos` | Texto livre |

### Exemplo de CSV

```csv
data,nome do procedimento,nome dos medicos,nome do paciente
2024-01-15,Consulta,Dr. Carlos Silva,Maria Santos
2024-01-16,Exame,Dr. Carlos Silva,José Oliveira
2024-01-20,Consulta,Dra. Ana Paula,Maria Santos
```

**⚠️ Importante:**
- A primeira linha DEVE conter os nomes das colunas (headers)
- Use vírgula (`,`), ponto-e-vírgula (`;`) ou TAB como separador
- O sistema detecta automaticamente o separador

---

## 🚀 Passo a Passo

### 1️⃣ **Preparar o CSV**

Você pode:
- Baixar o template no portal (botão "Baixar Template")
- Usar o arquivo `exemplo_importacao.csv` incluído
- Criar seu próprio CSV seguindo o formato acima

### 2️⃣ **Acessar a Página de Import**

No menu lateral: **Importar Dados** ou acesse `/app/import`

### 3️⃣ **Upload do Arquivo**

1. Clique em "Clique para selecionar um arquivo CSV"
2. Selecione seu arquivo .csv
3. O sistema mostrará quantos registros foram encontrados
4. Clique em "Validar Dados"

### 4️⃣ **Visualização e Validação**

O sistema irá:
- ✅ Validar todos os campos obrigatórios
- ✅ Verificar formato de datas
- ✅ Mostrar preview de todos os registros
- ❌ Destacar linhas com erros

**Estatísticas mostradas:**
- Total de registros
- Registros válidos
- Registros com erros

### 5️⃣ **Importação**

1. Revise os dados na tabela
2. Clique em "Importar X Registros"
3. Aguarde o processamento (pode levar alguns segundos)

### 6️⃣ **Resultado**

O sistema mostrará:
- ✅ Quantidade de procedimentos importados
- 📊 Quantos médicos foram criados/atualizados
- 📊 Quantos pacientes foram criados/atualizados
- 📊 Quantos tipos de procedimento foram criados
- ⚠️ Avisos (se houver)
- ❌ Erros (se houver)

---

## 🔄 Lógica de Criação Automática

### Médicos
- **Identificação**: Por nome (normalizado)
- **Se não existir**: Cria novo médico com:
  - Nome extraído do CSV
  - CRM: gerado temporariamente (deve ser editado depois)
  - Especialidade: "A definir"
  - Status: Ativo

### Pacientes
- **Identificação**: Por nome (normalizado)
- **Se não existir**: Cria novo paciente com:
  - Nome extraído do CSV
  - Outros campos vazios (podem ser preenchidos depois)

### Tipos de Procedimento
- **Identificação**: Por nome (normalizado, case-insensitive)
- **Se não existir**: Cria novo tipo com:
  - Nome extraído do CSV
  - Valor de referência: R$ 0,00 (deve ser editado depois)
  - Status: Ativo

### Procedimentos
- Sempre cria novos registros
- Vincula com médico, paciente e tipo existentes ou criados

---

## ✅ Boas Práticas

### Antes de Importar

1. **Revise os dados** no Excel/Planilha
2. **Padronize nomes**:
   - Use o mesmo formato para o mesmo médico (ex: sempre "Dr. João Silva")
   - Use o mesmo formato para o mesmo paciente
3. **Verifique datas**:
   - Todas devem estar no mesmo formato
   - Datas não podem ser futuras
4. **Faça backup** do arquivo original

### Durante a Importação

1. **Comece com arquivo pequeno** (10-20 registros) para testar
2. **Revise o preview** cuidadosamente
3. **Corrija erros** antes de importar
4. **Anote avisos** para ações posteriores

### Após a Importação

1. **Acesse o Dashboard** para ver os dados
2. **Edite médicos** para adicionar CRM e especialidade
3. **Edite tipos** para adicionar valores de referência
4. **Complete dados de pacientes** (CPF, telefone, etc.)

---

## 🐛 Solução de Problemas

### Erro: "Campos não encontrados no CSV"

**Causa**: Os nomes das colunas não estão corretos

**Solução**: Certifique-se que a primeira linha tem exatamente:
```
data,nome do procedimento,nome dos medicos,nome do paciente
```

### Erro: "Data em formato inválido"

**Causa**: Data não está em formato reconhecido

**Solução**: Use apenas:
- `YYYY-MM-DD` (ex: `2024-01-15`)
- `DD/MM/YYYY` (ex: `15/01/2024`)

### Registros duplicados

**Causa**: Mesmo médico/paciente com nomes ligeiramente diferentes

**Exemplo**: `Dr. João Silva` vs `Dr João Silva` (sem ponto)

**Solução**: Padronize os nomes antes de importar

### Acentuação incorreta

**Causa**: Encoding do arquivo

**Solução**: 
1. Abra o CSV no Excel
2. Salve como "CSV UTF-8"
3. Tente importar novamente

---

## 📊 Exemplos de CSV

### Exemplo Básico
```csv
data,nome do procedimento,nome dos medicos,nome do paciente
2024-01-15,Consulta,Dr. Carlos Silva,Maria Santos
2024-01-16,Exame,Dr. Carlos Silva,José Oliveira
```

### Exemplo com Data BR
```csv
data,nome do procedimento,nome dos medicos,nome do paciente
15/01/2024,Consulta,Dr. Carlos Silva,Maria Santos
16/01/2024,Exame,Dr. Carlos Silva,José Oliveira
```

### Exemplo com Ponto-e-vírgula
```csv
data;nome do procedimento;nome dos medicos;nome do paciente
2024-01-15;Consulta;Dr. Carlos Silva;Maria Santos
2024-01-16;Exame;Dr. Carlos Silva;José Oliveira
```

---

## 🔐 Segurança

- Apenas usuários autenticados podem importar
- Todos os dados são validados antes da importação
- Logs de importação são mantidos (futuro)
- Não é possível importar dados inválidos

---

## 📈 Limites

**Atualmente:**
- Tamanho máximo do arquivo: ~10MB
- Registros por importação: ilimitado (mas recomendado < 10.000)
- Tempo de processamento: ~1 segundo por 100 registros

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique este guia
2. Baixe o template e compare com seu arquivo
3. Teste com o `exemplo_importacao.csv` incluído
4. Entre em contato com suporte técnico

---

**Última atualização**: 2024-12-23
