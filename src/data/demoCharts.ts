/**
 * DADOS DE DEMONSTRAÇÃO - GRÁFICOS
 * 
 * Este arquivo contém todos os dados FAKE usados nos gráficos.
 * Para alterar os gráficos que aparecem no dashboard, edite este arquivo.
 * 
 * COMO USAR:
 * - Cada gráfico tem um nome descritivo
 * - Os dados são arrays de objetos com as propriedades necessárias
 * - Para adicionar mais pontos, basta adicionar mais objetos no array
 */

// ========================================
// GRÁFICOS DA VISÃO GERAL
// ========================================

// Faturamento diário dos últimos 7 dias
export const faturamentoDiarioData = [
  { date: "01/12", value: 2800 },
  { date: "02/12", value: 3200 },
  { date: "03/12", value: 2900 },
  { date: "04/12", value: 4100 },
  { date: "05/12", value: 3800 },
  { date: "06/12", value: 5100 },
  { date: "07/12", value: 4700 }
];

// Leads captados por dia
export const leadsPorDiaData = [
  { date: "01/12", value: 48 },
  { date: "02/12", value: 60 },
  { date: "03/12", value: 52 },
  { date: "04/12", value: 74 },
  { date: "05/12", value: 69 },
  { date: "06/12", value: 88 },
  { date: "07/12", value: 81 }
];

// Comparação: Leads x Vendas por dia
export const leadsVsVendasData = [
  { date: "01/12", leads: 48, vendas: 38 },
  { date: "02/12", leads: 60, vendas: 45 },
  { date: "03/12", leads: 52, vendas: 41 },
  { date: "04/12", leads: 74, vendas: 58 },
  { date: "05/12", leads: 69, vendas: 52 },
  { date: "06/12", leads: 88, vendas: 72 },
  { date: "07/12", leads: 81, vendas: 65 }
];

// Receita por origem de tráfego
export const receitaPorOrigemData = [
  { origem: "Meta Ads", valor: 28500 },
  { origem: "Google Ads", valor: 9700 },
  { origem: "Orgânico", valor: 5200 },
  { origem: "Direto", valor: 3800 },
  { origem: "Parceiros", valor: 2300 }
];

// ========================================
// GRÁFICOS DO FUNIL
// ========================================

// Funil de conversão completo
export const funnelData = [
  { etapa: "Impressões", valor: 520000 },
  { etapa: "Cliques", valor: 32000 },
  { etapa: "Leads", valor: 1247 },
  { etapa: "Checkouts", valor: 342 },
  { etapa: "Vendas", valor: 298 }
];

// Taxa de conversão por etapa
export const conversaoPorEtapaData = [
  { etapa: "Clique → Lead", taxa: 3.9 },
  { etapa: "Lead → Checkout", taxa: 27.4 },
  { etapa: "Checkout → Venda", taxa: 87.1 }
];

// ========================================
// GRÁFICOS DO TRÁFEGO
// ========================================

// CPL por origem
export const cplPorOrigemData = [
  { origem: "Meta Ads", cpl: 12.50 },
  { origem: "Google Ads", cpl: 9.30 },
  { origem: "Orgânico", cpl: 4.10 }
];

// Investimento por origem
export const investimentoPorOrigemData = [
  { origem: "Meta Ads", valor: 9200 },
  { origem: "Google Ads", valor: 4800 },
  { origem: "Orgânico", valor: 1580 }
];

// Cliques por dia
export const cliquesPorDiaData = [
  { date: "01/12", valor: 4200 },
  { date: "02/12", valor: 4500 },
  { date: "03/12", valor: 4400 },
  { date: "04/12", valor: 4800 },
  { date: "05/12", valor: 4600 },
  { date: "06/12", valor: 5100 },
  { date: "07/12", valor: 4900 }
];

// CTR por campanha (novo gráfico para tráfego)
export const ctrPorCampanhaData = [
  { campanha: "Campanha A", ctr: 2.1 },
  { campanha: "Campanha B", ctr: 1.8 },
  { campanha: "Campanha C", ctr: 1.6 },
  { campanha: "Campanha D", ctr: 2.3 }
];

// ========================================
// GRÁFICOS DA RECEITA
// ========================================

// Receita acumulada ao longo do tempo
export const receitaAcumuladaData = [
  { date: "01/12", valor: 2800 },
  { date: "02/12", valor: 6000 },
  { date: "03/12", valor: 8900 },
  { date: "04/12", valor: 13000 },
  { date: "05/12", valor: 16800 },
  { date: "06/12", valor: 21900 },
  { date: "07/12", valor: 26600 }
];

// Receita por produto
export const receitaPorProdutoData = [
  { produto: "Produto A", valor: 28500 },
  { produto: "Produto B", valor: 9700 },
  { produto: "Produto C", valor: 3800 }
];

// Distribuição do ticket médio
export const ticketDistribuicaoData = [
  { faixa: "Até R$ 100", quantidade: 48 },
  { faixa: "R$ 101-200", quantidade: 92 },
  { faixa: "R$ 201-300", quantidade: 61 },
  { faixa: "R$ 301+", quantidade: 34 }
];

// ========================================
// GRÁFICOS LEADS & LTV
// ========================================

// Leads por origem
export const leadsPorOrigemData = [
  { origem: "Meta Ads", leads: 736 },
  { origem: "Google Ads", leads: 318 },
  { origem: "Orgânico", leads: 193 }
];

// LTV por origem
export const ltvPorOrigemData = [
  { origem: "Meta Ads", ltv: 298 },
  { origem: "Google Ads", ltv: 342 },
  { origem: "Orgânico", ltv: 412 }
];

// Retenção ao longo do tempo
export const retencaoData = [
  { mes: "Mês 1", retencao: 100, churn: 0 },
  { mes: "Mês 2", retencao: 94.2, churn: 5.8 },
  { mes: "Mês 3", retencao: 88.7, churn: 11.3 },
  { mes: "Mês 4", retencao: 84.1, churn: 15.9 },
  { mes: "Mês 5", retencao: 80.5, churn: 19.5 },
  { mes: "Mês 6", retencao: 77.8, churn: 22.2 }
];

// Exportar tudo em um objeto para facilitar
export const allDemoCharts = {
  visaoGeral: {
    faturamentoDiario: faturamentoDiarioData,
    leadsPorDia: leadsPorDiaData,
    leadsVsVendas: leadsVsVendasData,
    receitaPorOrigem: receitaPorOrigemData
  },
  funil: {
    funnel: funnelData,
    conversaoPorEtapa: conversaoPorEtapaData
  },
  trafego: {
    cplPorOrigem: cplPorOrigemData,
    investimentoPorOrigem: investimentoPorOrigemData,
    cliquesPorDia: cliquesPorDiaData,
    ctrPorCampanha: ctrPorCampanhaData
  },
  receita: {
    receitaAcumulada: receitaAcumuladaData,
    receitaPorProduto: receitaPorProdutoData,
    ticketDistribuicao: ticketDistribuicaoData
  },
  leadsLtv: {
    leadsPorOrigem: leadsPorOrigemData,
    ltvPorOrigem: ltvPorOrigemData,
    retencao: retencaoData
  }
};
