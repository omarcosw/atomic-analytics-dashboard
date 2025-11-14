# Atomic+ Analytics — Dashboard para Infoprodutores

Este é um dashboard analytics plug-and-play para infoprodutores que querem visualizar métricas de lançamentos e produtos digitais.

---

## 📁 Estrutura do Projeto (Onde está cada coisa)

```
/src
  /components        → Componentes visuais (cards, gráficos, botões)
  /pages            → Páginas do app (dashboard, público, login)
  /data             → Dados de demonstração (métricas e gráficos FAKE)
  /utils            → Funções auxiliares (formatação, cálculos)
  /styles           → Estilos globais e design system
  /hooks            → Lógica reutilizável React
```

---

## ✏️ Como Editar as Métricas

### Passo 1: Abra o arquivo de métricas
Vá em: `src/data/demoMetrics.ts`

### Passo 2: Encontre a métrica que quer mudar
Exemplo:
```typescript
faturamentoTotal: {
  title: "Faturamento Total",
  value: 47580.50,        // ← EDITE ESTE VALOR
  valueType: "currency",
  trend: 12.6,            // ← Tendência (%)
  ...
}
```

### Passo 3: Salve o arquivo
As mudanças aparecem automaticamente na tela.

---

## 📊 Como Editar os Gráficos

### Passo 1: Abra o arquivo de gráficos
Vá em: `src/data/demoCharts.ts`

### Passo 2: Encontre o gráfico que quer mudar
Exemplo:
```typescript
export const faturamentoDiarioData = [
  { dia: "Dia 1", valor: 2800 },   // ← EDITE OS VALORES
  { dia: "Dia 2", valor: 3200 },
  { dia: "Dia 3", valor: 2900 },
  ...
];
```

### Passo 3: Salve o arquivo
O gráfico atualiza automaticamente.

---

## 🎨 Como Mudar as Cores e Design

### Passo 1: Abra o arquivo de design
Vá em: `src/index.css`

### Passo 2: Edite as variáveis CSS
Exemplo:
```css
:root {
  /* Cores principais */
  --primary: 217 100% 50%;         /* Azul principal */
  --success: 142 71% 37%;          /* Verde de sucesso */
  --destructive: 4 90% 58%;        /* Vermelho de alerta */
  
  /* Bordas e sombras */
  --radius-card: 0.875rem;         /* Arredondamento dos cards */
  --shadow-card: 0 8px 24px rgb(15 23 42 / 0.06);
}
```

### Passo 3: Salve e veja a mudança
Todas as cores do app vão atualizar automaticamente.

---

## ➕ Como Adicionar uma Nova Métrica

### Passo 1: Adicione no arquivo de métricas
Em `src/data/demoMetrics.ts`, copie uma métrica existente:

```typescript
minhaNovaMetrica: {
  title: "Minha Métrica",
  value: 1500,
  valueType: "number",  // "number", "currency" ou "percent"
  trend: 5.2,
  sparklineData: [100, 120, 110, 150],
}
```

### Passo 2: Adicione no dashboard
Em `src/pages/ProjectDashboard.tsx`, adicione o componente:

```tsx
<MetricCard {...allDemoMetrics.geral.minhaNovaMetrica} />
```

Pronto! Sua nova métrica aparecerá no dashboard.

---

## 📈 Como Adicionar um Novo Gráfico

### Passo 1: Adicione os dados do gráfico
Em `src/data/demoCharts.ts`:

```typescript
export const meuNovoGraficoData = [
  { mes: "Jan", vendas: 120 },
  { mes: "Fev", vendas: 150 },
  { mes: "Mar", vendas: 180 },
];
```

### Passo 2: Adicione o gráfico no dashboard
Em `src/pages/ProjectDashboard.tsx`:

```tsx
<ChartCard title="Meu Novo Gráfico" subtitle="Últimos 3 meses">
  <ResponsiveContainer width="100%" height={340}>
    <BarChart data={meuNovoGraficoData}>
      <XAxis dataKey="mes" />
      <YAxis />
      <Bar dataKey="vendas" fill="hsl(var(--primary))" />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>
```

---

## 🔓 Como Ativar/Desativar um Dashboard

### No Dashboard Interno
1. Vá em `/project/1` (ou qualquer ID de projeto)
2. Clique no botão **"Ativar dashboard"** no topo
3. Um link público será gerado automaticamente
4. Copie e compartilhe o link

### O que acontece quando ativo?
- Link público fica acessível
- Qualquer pessoa com o link pode ver o dashboard (somente leitura)

### Para desativar
- Clique em **"Desativar dashboard"**
- O link público para de funcionar

---

## 🌐 Como Funciona o Dashboard Público

### Rota pública
`https://seudominio.com/d/dash-1-a3f9d2`

### Características
- Mesma aparência do dashboard interno
- Modo **somente leitura** (não pode editar)
- Ideal para compartilhar com clientes/parceiros
- Se o dashboard estiver inativo, mostra "Dashboard indisponível"

---

## 🚀 Próximos Passos (Para Desenvolvedores)

### 1. Conectar ao Backend Real
- Atualmente os dados são FAKE (mock)
- Para conectar a APIs reais, edite os arquivos em `/hooks`
- Substitua `allDemoMetrics` por chamadas de API

### 2. Integrar Google Sheets
- Conectar OAuth do Google
- Mapear células/colunas da planilha para as métricas
- Atualizar valores automaticamente

### 3. Adicionar Autenticação
- Implementar login/signup
- Proteger rotas privadas
- Gerenciar usuários e projetos

### 4. Adicionar Sistema de Pagamento (Billing)
- Integrar Stripe ou similar
- Criar planos (Free, Pro, Agency)
- Bloquear features por plano (paywalls)

### 5. Deploy em Produção
- Fazer build: `npm run build`
- Deploy no Vercel, Netlify ou servidor próprio
- Configurar domínio personalizado

---

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Fazer build para produção
npm run build

# Visualizar build
npm run preview
```

---

## 📚 Tecnologias Usadas

- **React** — Framework JavaScript
- **TypeScript** — JavaScript com tipagem
- **Tailwind CSS** — Estilização rápida
- **Recharts** — Biblioteca de gráficos
- **Vite** — Build tool rápido
- **Shadcn/UI** — Componentes prontos

---

## 🆘 Precisa de Ajuda?

- Documentação React: https://react.dev
- Documentação Tailwind: https://tailwindcss.com
- Documentação Recharts: https://recharts.org

---

## 📝 Licença

Este projeto é de código aberto. Use como quiser!

---

**Desenvolvido com ❤️ para infoprodutores que querem dados simples e visuais.**
