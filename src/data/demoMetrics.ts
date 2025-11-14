/**
 * DADOS DE DEMONSTRAÇÃO - MÉTRICAS
 * 
 * Este arquivo contém todos os valores FAKE usados para demonstração.
 * Para alterar os valores que aparecem no dashboard, edite este arquivo.
 * 
 * COMO USAR:
 * - value: o número que aparece no card
 * - trend: a variação em % (positivo = subiu, negativo = caiu)
 * - sparklineData: os pontos do mini gráfico que aparece no card
 * - goal: meta do projeto (quando aplicável)
 */

// Tipo de métrica (para facilitar entendimento)
export type Metric = {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  isOverridden: boolean;
  trend?: number;
  goal?: number;
  sparklineData?: number[];
};

// ========================================
// ABA: VISÃO GERAL
// ========================================
export const visaoGeralMetrics: Metric[] = [
  {
    id: "faturamento-total",
    name: "Faturamento Total",
    value: 47580.50,
    valueType: "currency",
    isOverridden: false,
    trend: 12.6,
    goal: 120000,
    sparklineData: [2800, 3200, 2900, 4100, 3800, 5100, 4700]
  },
  {
    id: "leads-captados",
    name: "Leads Captados",
    value: 1247,
    valueType: "number",
    isOverridden: false,
    trend: 8.2,
    sparklineData: [48, 60, 52, 74, 69, 88, 81]
  },
  {
    id: "taxa-conversao",
    name: "Taxa de Conversão",
    value: 23.8,
    valueType: "percent",
    isOverridden: false,
    trend: -2.1,
    sparklineData: [22.5, 24.1, 23.3, 24.8, 22.9, 23.8, 23.8]
  },
  {
    id: "ticket-medio",
    name: "Ticket Médio",
    value: 159.80,
    valueType: "currency",
    isOverridden: false,
    trend: 3.2,
    sparklineData: [155, 158, 154, 162, 157, 161, 160]
  },
  {
    id: "roi",
    name: "ROI",
    value: 3.2,
    valueType: "percent",
    isOverridden: false,
    trend: 18.5,
    sparklineData: [2.8, 2.9, 3.0, 3.1, 3.0, 3.2, 3.2]
  },
  {
    id: "cpl",
    name: "CPL (Custo por Lead)",
    value: 12.50,
    valueType: "currency",
    isOverridden: false,
    trend: -5.4,
    sparklineData: [14, 13.5, 12.8, 13.2, 12.1, 11.9, 12.5]
  },
  {
    id: "receita-por-lead",
    name: "Receita por Lead",
    value: 38.15,
    valueType: "currency",
    isOverridden: false,
    trend: 4.8,
    sparklineData: [35, 37, 36, 39, 38, 40, 38]
  },
  {
    id: "investimento-total",
    name: "Investimento Total",
    value: 15580.00,
    valueType: "currency",
    isOverridden: false,
    trend: 9.3,
    sparklineData: [14200, 14800, 15100, 15300, 15450, 15520, 15580]
  },
  {
    id: "checkouts-iniciados",
    name: "Checkouts Iniciados",
    value: 342,
    valueType: "number",
    isOverridden: false,
    trend: 18.7,
    sparklineData: [45, 52, 48, 58, 54, 62, 63]
  },
  {
    id: "vendas-confirmadas",
    name: "Vendas Confirmadas",
    value: 298,
    valueType: "number",
    isOverridden: false,
    trend: 15.2,
    sparklineData: [38, 44, 41, 50, 46, 54, 55]
  },
  {
    id: "leads-qualificados",
    name: "Leads Qualificados",
    value: 986,
    valueType: "number",
    isOverridden: false,
    trend: 22.4,
    sparklineData: [38, 48, 42, 59, 56, 71, 67]
  }
];

// ========================================
// ABA: FUNIL
// ========================================
export const funilMetrics: Metric[] = [
  {
    id: "visitas",
    name: "Visitas na Página",
    value: 520000,
    valueType: "number",
    isOverridden: false,
    trend: 15.3,
    sparklineData: [71000, 74000, 73000, 76000, 75000, 78000, 77000]
  },
  {
    id: "cliques-cta",
    name: "Cliques no CTA",
    value: 32000,
    valueType: "number",
    isOverridden: false,
    trend: 12.1,
    sparklineData: [4200, 4500, 4400, 4800, 4600, 5100, 4900]
  },
  {
    id: "leads-funil",
    name: "Leads",
    value: 1247,
    valueType: "number",
    isOverridden: false,
    trend: 8.2,
    sparklineData: [48, 60, 52, 74, 69, 88, 81]
  },
  {
    id: "checkouts-funil",
    name: "Checkouts Iniciados",
    value: 342,
    valueType: "number",
    isOverridden: false,
    trend: 18.7,
    sparklineData: [45, 52, 48, 58, 54, 62, 63]
  },
  {
    id: "vendas-funil",
    name: "Vendas",
    value: 298,
    valueType: "number",
    isOverridden: false,
    trend: 15.2,
    sparklineData: [38, 44, 41, 50, 46, 54, 55]
  },
  {
    id: "taxa-visita-lead",
    name: "Taxa Visita → Lead",
    value: 0.24,
    valueType: "percent",
    isOverridden: false,
    trend: -1.2,
    sparklineData: [0.25, 0.24, 0.23, 0.24, 0.24, 0.24, 0.24]
  },
  {
    id: "taxa-lead-checkout",
    name: "Taxa Lead → Checkout",
    value: 27.4,
    valueType: "percent",
    isOverridden: false,
    trend: 8.5,
    sparklineData: [25.8, 26.5, 27.1, 27.8, 26.9, 27.4, 27.4]
  },
  {
    id: "taxa-checkout-venda",
    name: "Taxa Checkout → Venda",
    value: 87.1,
    valueType: "percent",
    isOverridden: false,
    trend: -2.3,
    sparklineData: [88.5, 87.8, 88.1, 86.2, 87.5, 86.9, 87.1]
  }
];

// ========================================
// ABA: TRÁFEGO
// ========================================
export const trafegoMetrics: Metric[] = [
  {
    id: "investimento-trafego",
    name: "Investimento Total",
    value: 15580.00,
    valueType: "currency",
    isOverridden: false,
    trend: 9.3,
    sparklineData: [2100, 2200, 2150, 2300, 2250, 2400, 2350]
  },
  {
    id: "cpl-medio",
    name: "CPL Médio",
    value: 12.50,
    valueType: "currency",
    isOverridden: false,
    trend: -5.4,
    sparklineData: [14, 13.5, 12.8, 13.2, 12.1, 11.9, 12.5]
  },
  {
    id: "ctr",
    name: "CTR Médio",
    value: 1.8,
    valueType: "percent",
    isOverridden: false,
    trend: 12.3,
    sparklineData: [1.6, 1.7, 1.7, 1.8, 1.8, 1.9, 1.8]
  },
  {
    id: "cpc",
    name: "CPC Médio",
    value: 0.72,
    valueType: "currency",
    isOverridden: false,
    trend: -8.1,
    sparklineData: [0.78, 0.76, 0.74, 0.75, 0.71, 0.70, 0.72]
  },
  {
    id: "cpm",
    name: "CPM Médio",
    value: 18.20,
    valueType: "currency",
    isOverridden: false,
    trend: 3.7,
    sparklineData: [17.5, 17.8, 17.6, 18.2, 18.0, 18.4, 18.2]
  },
  {
    id: "cliques-totais",
    name: "Cliques Totais",
    value: 32000,
    valueType: "number",
    isOverridden: false,
    trend: 12.1,
    sparklineData: [4200, 4500, 4400, 4800, 4600, 5100, 4900]
  },
  {
    id: "impressoes",
    name: "Impressões Totais",
    value: 520000,
    valueType: "number",
    isOverridden: false,
    trend: 18.4,
    sparklineData: [71000, 74000, 73000, 76000, 75000, 78000, 77000]
  }
];

// ========================================
// ABA: RECEITA
// ========================================
export const receitaMetrics: Metric[] = [
  {
    id: "faturamento-receita",
    name: "Faturamento Total",
    value: 47580.50,
    valueType: "currency",
    isOverridden: false,
    trend: 12.6,
    sparklineData: [2800, 3200, 2900, 4100, 3800, 5100, 4700]
  },
  {
    id: "receita-hoje",
    name: "Receita Hoje",
    value: 5200.80,
    valueType: "currency",
    isOverridden: false,
    trend: 22.3,
    sparklineData: [2800, 3200, 2900, 4100, 3800, 5100, 5200]
  },
  {
    id: "receita-produto-a",
    name: "Receita Produto A",
    value: 28500.00,
    valueType: "currency",
    isOverridden: false,
    trend: 15.2,
    sparklineData: [1600, 1800, 1700, 2300, 2100, 2900, 2700]
  },
  {
    id: "receita-produto-b",
    name: "Receita Produto B",
    value: 9700.00,
    valueType: "currency",
    isOverridden: false,
    trend: 8.1,
    sparklineData: [900, 1100, 950, 1400, 1300, 1700, 1600]
  },
  {
    id: "receita-produto-c",
    name: "Receita Produto C",
    value: 3800.00,
    valueType: "currency",
    isOverridden: false,
    trend: 5.4,
    sparklineData: [300, 400, 350, 500, 450, 600, 580]
  },
  {
    id: "mrr",
    name: "Receita Recorrente",
    value: 12800.00,
    valueType: "currency",
    isOverridden: false,
    trend: 18.9,
    sparklineData: [10200, 10800, 11200, 11600, 12000, 12400, 12800]
  },
  {
    id: "receita-projetada",
    name: "Receita Projetada",
    value: 78450.00,
    valueType: "currency",
    isOverridden: false,
    trend: 0,
    sparklineData: [47580, 52000, 56500, 61200, 66000, 71000, 78450]
  }
];

// ========================================
// ABA: LEADS & LTV
// ========================================
export const leadsLtvMetrics: Metric[] = [
  {
    id: "leads-totais",
    name: "Leads Totais",
    value: 1247,
    valueType: "number",
    isOverridden: false,
    trend: 8.2,
    sparklineData: [48, 60, 52, 74, 69, 88, 81]
  },
  {
    id: "leads-qualificados-ltv",
    name: "Leads Qualificados",
    value: 986,
    valueType: "number",
    isOverridden: false,
    trend: 22.4,
    sparklineData: [38, 48, 42, 59, 56, 71, 67]
  },
  {
    id: "percent-qualificados",
    name: "% Leads Qualificados",
    value: 79.0,
    valueType: "percent",
    isOverridden: false,
    trend: 12.8,
    sparklineData: [76.5, 78.2, 77.8, 79.5, 78.9, 80.1, 79.0]
  },
  {
    id: "ltv-medio",
    name: "LTV Médio",
    value: 327.00,
    valueType: "currency",
    isOverridden: false,
    trend: 6.5,
    sparklineData: [305, 312, 318, 322, 320, 328, 327]
  },
  {
    id: "ltv-top20",
    name: "LTV Top 20%",
    value: 780.00,
    valueType: "currency",
    isOverridden: false,
    trend: 8.9,
    sparklineData: [720, 735, 742, 755, 760, 775, 780]
  },
  {
    id: "churn",
    name: "Churn",
    value: 3.2,
    valueType: "percent",
    isOverridden: false,
    trend: -15.8,
    sparklineData: [3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2]
  },
  {
    id: "clientes-ativos",
    name: "Clientes Ativos",
    value: 412,
    valueType: "number",
    isOverridden: false,
    trend: 24.6,
    sparklineData: [52, 58, 56, 64, 62, 69, 67]
  }
];

// ========================================
// ABA: ALERTAS & METAS
// ========================================
export const alertasMetasMetrics: Metric[] = [
  {
    id: "meta-leads",
    name: "Meta de Leads",
    value: 2400,
    valueType: "number",
    isOverridden: false,
    trend: 0,
    goal: 2400
  },
  {
    id: "meta-leads-percent",
    name: "% Meta de Leads",
    value: 52.0,
    valueType: "percent",
    isOverridden: false,
    trend: 8.2
  },
  {
    id: "meta-receita",
    name: "Meta de Receita",
    value: 120000,
    valueType: "currency",
    isOverridden: false,
    trend: 0,
    goal: 120000
  },
  {
    id: "meta-receita-percent",
    name: "% Meta de Receita",
    value: 39.0,
    valueType: "percent",
    isOverridden: false,
    trend: 12.6
  }
];

// Exportar todas as métricas em um único objeto para facilitar
export const allDemoMetrics = {
  visaoGeral: visaoGeralMetrics,
  funil: funilMetrics,
  trafego: trafegoMetrics,
  receita: receitaMetrics,
  leadsLtv: leadsLtvMetrics,
  alertasMetas: alertasMetasMetrics
};
