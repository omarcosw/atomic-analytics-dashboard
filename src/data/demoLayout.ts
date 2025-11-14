/**
 * DADOS: Configuração de Layout do Dashboard
 * 
 * Este arquivo define como cada aba do dashboard é exibida:
 * - Quais métricas aparecem
 * - Ordem das métricas
 * - Tipo de card (hero ou normal)
 * - Quais gráficos aparecem
 * - Tipo de gráfico (line, area, bar, etc.)
 * 
 * COMO USAR:
 * - O hook useLayoutConfig lê deste arquivo
 * - O painel de configuração permite editar essas informações
 * - O dashboard renderiza baseado nessa configuração
 */

export interface MetricLayoutItem {
  id: string;
  visible: boolean;
  position: number;
  variant: "hero" | "card";
}

export interface ChartLayoutItem {
  id: string;
  visible: boolean;
  position: number;
  type: "line" | "area" | "bar" | "pie" | "combo" | "funnel";
}

export interface TabLayout {
  metrics: MetricLayoutItem[];
  charts: ChartLayoutItem[];
}

export interface DashboardLayout {
  [tabId: string]: TabLayout;
}

export const demoLayout: DashboardLayout = {
  "visao-geral": {
    metrics: [
      { id: "faturamento", visible: true, position: 1, variant: "hero" },
      { id: "leads", visible: true, position: 2, variant: "card" },
      { id: "conversao", visible: true, position: 3, variant: "card" },
      { id: "ticket", visible: true, position: 4, variant: "card" },
      { id: "roi", visible: true, position: 5, variant: "card" },
      { id: "cpl", visible: true, position: 6, variant: "card" },
      { id: "investimento", visible: true, position: 7, variant: "card" },
      { id: "vendas", visible: true, position: 8, variant: "card" },
      { id: "roas", visible: true, position: 9, variant: "card" },
      { id: "checkout", visible: true, position: 10, variant: "card" },
      { id: "abandono", visible: true, position: 11, variant: "card" },
    ],
    charts: [
      { id: "faturamentoDiario", visible: true, position: 1, type: "area" },
      { id: "leadsPorDia", visible: true, position: 2, type: "area" },
      { id: "leadsVsVendas", visible: true, position: 3, type: "combo" },
      { id: "receitaPorOrigem", visible: true, position: 4, type: "bar" },
    ],
  },
  
  "funil": {
    metrics: [
      { id: "visitantes", visible: true, position: 1, variant: "card" },
      { id: "leads", visible: true, position: 2, variant: "card" },
      { id: "checkout", visible: true, position: 3, variant: "card" },
      { id: "vendas", visible: true, position: 4, variant: "card" },
      { id: "conversaoVisitaLead", visible: true, position: 5, variant: "card" },
      { id: "conversaoLeadCheckout", visible: true, position: 6, variant: "card" },
      { id: "conversaoCheckoutVenda", visible: true, position: 7, variant: "card" },
      { id: "conversaoGeral", visible: true, position: 8, variant: "card" },
    ],
    charts: [
      { id: "funnelData", visible: true, position: 1, type: "funnel" },
      { id: "conversaoPorEtapa", visible: true, position: 2, type: "bar" },
    ],
  },
  
  "trafego": {
    metrics: [
      { id: "investimento", visible: true, position: 1, variant: "card" },
      { id: "cpl", visible: true, position: 2, variant: "card" },
      { id: "ctr", visible: true, position: 3, variant: "card" },
      { id: "cpc", visible: true, position: 4, variant: "card" },
      { id: "cpm", visible: true, position: 5, variant: "card" },
      { id: "cliques", visible: true, position: 6, variant: "card" },
      { id: "impressoes", visible: true, position: 7, variant: "card" },
    ],
    charts: [
      { id: "cplPorOrigem", visible: true, position: 1, type: "bar" },
      { id: "investimentoPorOrigem", visible: true, position: 2, type: "bar" },
      { id: "ctrPorCampanha", visible: true, position: 3, type: "bar" },
      { id: "cliquesPorDia", visible: true, position: 4, type: "area" },
    ],
  },
  
  "receita": {
    metrics: [
      { id: "faturamento", visible: true, position: 1, variant: "hero" },
      { id: "ticket", visible: true, position: 2, variant: "card" },
      { id: "vendas", visible: true, position: 3, variant: "card" },
      { id: "roi", visible: true, position: 4, variant: "card" },
      { id: "roas", visible: true, position: 5, variant: "card" },
      { id: "previsaoReceita", visible: true, position: 6, variant: "card" },
    ],
    charts: [
      { id: "faturamentoDiario", visible: true, position: 1, type: "area" },
      { id: "receitaAcumulada", visible: true, position: 2, type: "area" },
      { id: "receitaPorProduto", visible: true, position: 3, type: "bar" },
      { id: "ticketDistribuicao", visible: true, position: 4, type: "bar" },
    ],
  },
  
  "leads-ltv": {
    metrics: [
      { id: "leads", visible: true, position: 1, variant: "card" },
      { id: "leadsQualificados", visible: true, position: 2, variant: "card" },
      { id: "ltv", visible: true, position: 3, variant: "card" },
      { id: "ltvMedio", visible: true, position: 4, variant: "card" },
      { id: "ltvPorCliente", visible: true, position: 5, variant: "card" },
      { id: "churn", visible: true, position: 6, variant: "card" },
      { id: "clientesAtivos", visible: true, position: 7, variant: "card" },
    ],
    charts: [
      { id: "leadsPorOrigem", visible: true, position: 1, type: "bar" },
      { id: "ltvPorOrigem", visible: true, position: 2, type: "bar" },
      { id: "retencaoData", visible: true, position: 3, type: "area" },
    ],
  },
  
  "alertas-metas": {
    metrics: [
      { id: "metaLeads", visible: true, position: 1, variant: "card" },
      { id: "metaReceita", visible: true, position: 2, variant: "card" },
      { id: "metaCPL", visible: true, position: 3, variant: "card" },
      { id: "metaROI", visible: true, position: 4, variant: "card" },
    ],
    charts: [],
  },
};
