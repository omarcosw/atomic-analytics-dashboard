export interface MetricTemplate {
  name: string;
  slug: string;
  description?: string;
  valueType: 'number' | 'currency' | 'percent';
  visualizationType: 'number' | 'line_chart' | 'bar_chart' | 'pie_chart';
  sections: string[];
}

export interface SectionTemplate {
  id: string;
  name: string;
  icon?: string;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  sections: SectionTemplate[];
  metrics: MetricTemplate[];
}

export const dashboardTemplates: Record<string, DashboardTemplate> = {
  'lancamento-classico': {
    id: 'lancamento-classico',
    name: 'Lançamento Clássico',
    description: 'Template completo para lançamentos tradicionais com foco em conversão e ROI',
    sections: [
      { id: 'overview', name: 'Visão Geral' },
      { id: 'traffic', name: 'Tráfego' },
      { id: 'funnel', name: 'Funil' },
      { id: 'revenue', name: 'Receita' },
      { id: 'comparatives', name: 'Comparativos' }
    ],
    metrics: [
      {
        name: 'Leads',
        slug: 'leads',
        description: 'Total de leads captados',
        valueType: 'number',
        visualizationType: 'line_chart',
        sections: ['overview', 'funnel', 'comparatives']
      },
      {
        name: 'Receita',
        slug: 'receita',
        description: 'Receita total gerada',
        valueType: 'currency',
        visualizationType: 'line_chart',
        sections: ['overview', 'revenue', 'comparatives']
      },
      {
        name: 'Ticket Médio',
        slug: 'ticket-medio',
        description: 'Valor médio por venda',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'revenue']
      },
      {
        name: 'ROAS',
        slug: 'roas',
        description: 'Return on Ad Spend',
        valueType: 'number',
        visualizationType: 'number',
        sections: ['overview', 'comparatives']
      },
      {
        name: 'ROI',
        slug: 'roi',
        description: 'Retorno sobre investimento',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['overview', 'revenue', 'comparatives']
      },
      {
        name: 'Conversão',
        slug: 'conversao',
        description: 'Taxa de conversão geral',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['overview', 'funnel']
      },
      {
        name: 'Investimento',
        slug: 'investimento',
        description: 'Investimento total em tráfego',
        valueType: 'currency',
        visualizationType: 'bar_chart',
        sections: ['overview', 'traffic']
      },
      {
        name: 'Checkouts Iniciados',
        slug: 'checkouts-iniciados',
        description: 'Número de checkouts iniciados',
        valueType: 'number',
        visualizationType: 'line_chart',
        sections: ['funnel', 'comparatives']
      },
      {
        name: 'Origem do Tráfego',
        slug: 'origem-trafego',
        description: 'Distribuição por origem',
        valueType: 'number',
        visualizationType: 'pie_chart',
        sections: ['traffic']
      },
      {
        name: 'Faturamento Dia a Dia',
        slug: 'faturamento-diario',
        description: 'Receita diária',
        valueType: 'currency',
        visualizationType: 'bar_chart',
        sections: ['revenue', 'comparatives']
      }
    ]
  },

  'perpetuo': {
    id: 'perpetuo',
    name: 'Perpétuo',
    description: 'Template para funis perpétuos com foco em LTV e horizontalidade',
    sections: [
      { id: 'overview', name: 'Visão Geral' },
      { id: 'daily-revenue', name: 'Receita Diária' },
      { id: 'horizontality', name: 'Horizontalidade' },
      { id: 'ltv', name: 'LTV' },
      { id: 'leadscore', name: 'Leadscore' },
      { id: 'funnel', name: 'Funil Perene' }
    ],
    metrics: [
      {
        name: 'Receita Diária',
        slug: 'receita-diaria',
        description: 'Receita média por dia',
        valueType: 'currency',
        visualizationType: 'line_chart',
        sections: ['overview', 'daily-revenue']
      },
      {
        name: 'LTV',
        slug: 'ltv',
        description: 'Lifetime Value médio',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'ltv']
      },
      {
        name: 'CAC',
        slug: 'cac',
        description: 'Custo de Aquisição de Cliente',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'ltv']
      },
      {
        name: 'LTV/CAC',
        slug: 'ltv-cac-ratio',
        description: 'Relação LTV/CAC',
        valueType: 'number',
        visualizationType: 'number',
        sections: ['overview', 'ltv']
      },
      {
        name: 'Horizontalidade',
        slug: 'horizontalidade',
        description: 'Distribuição de vendas ao longo do tempo',
        valueType: 'percent',
        visualizationType: 'bar_chart',
        sections: ['horizontality']
      },
      {
        name: 'Leads Score Alto',
        slug: 'leads-score-alto',
        description: 'Leads com score alto',
        valueType: 'number',
        visualizationType: 'number',
        sections: ['leadscore']
      },
      {
        name: 'Taxa de Ativação',
        slug: 'taxa-ativacao',
        description: 'Percentual de leads ativados',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['funnel', 'overview']
      },
      {
        name: 'Conversão Funil',
        slug: 'conversao-funil',
        description: 'Taxa de conversão do funil',
        valueType: 'percent',
        visualizationType: 'line_chart',
        sections: ['funnel']
      }
    ]
  },

  'funil-inscricao': {
    id: 'funil-inscricao',
    name: 'Funil de Inscrição',
    description: 'Template focado em análise página a página do funil de inscrição',
    sections: [
      { id: 'overview', name: 'Visão Geral' },
      { id: 'pages', name: 'Páginas' },
      { id: 'conversion', name: 'Conversão Página a Página' },
      { id: 'cost', name: 'Custo por Etapa' },
      { id: 'abandonment', name: 'Abandono' }
    ],
    metrics: [
      {
        name: 'Visitas Landing Page',
        slug: 'visitas-lp',
        description: 'Total de visitas na LP',
        valueType: 'number',
        visualizationType: 'number',
        sections: ['overview', 'pages']
      },
      {
        name: 'Conversão LP → Formulário',
        slug: 'conversao-lp-form',
        description: 'Taxa de conversão LP para formulário',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['conversion', 'pages']
      },
      {
        name: 'Conversão Formulário → Confirmação',
        slug: 'conversao-form-confirm',
        description: 'Taxa de conversão formulário para confirmação',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['conversion']
      },
      {
        name: 'Taxa de Abandono',
        slug: 'taxa-abandono',
        description: 'Percentual de abandono geral',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['overview', 'abandonment']
      },
      {
        name: 'Custo por Lead',
        slug: 'cpl',
        description: 'Custo médio por lead',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'cost']
      },
      {
        name: 'Custo por Etapa',
        slug: 'custo-etapa',
        description: 'Custo médio em cada etapa do funil',
        valueType: 'currency',
        visualizationType: 'bar_chart',
        sections: ['cost']
      },
      {
        name: 'Abandono por Etapa',
        slug: 'abandono-etapa',
        description: 'Percentual de abandono em cada etapa',
        valueType: 'percent',
        visualizationType: 'bar_chart',
        sections: ['abandonment']
      }
    ]
  },

  'assinatura': {
    id: 'assinatura',
    name: 'Assinatura / Comunidade',
    description: 'Template para modelos de assinatura com foco em MRR e churn',
    sections: [
      { id: 'overview', name: 'Visão Geral' },
      { id: 'mrr', name: 'MRR' },
      { id: 'refunds', name: 'Reembolsos' },
      { id: 'churn', name: 'Churn' },
      { id: 'growth', name: 'Crescimento Líquido' }
    ],
    metrics: [
      {
        name: 'MRR',
        slug: 'mrr',
        description: 'Monthly Recurring Revenue',
        valueType: 'currency',
        visualizationType: 'line_chart',
        sections: ['overview', 'mrr']
      },
      {
        name: 'ARR',
        slug: 'arr',
        description: 'Annual Recurring Revenue',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'mrr']
      },
      {
        name: 'Assinantes Ativos',
        slug: 'assinantes-ativos',
        description: 'Total de assinantes ativos',
        valueType: 'number',
        visualizationType: 'line_chart',
        sections: ['overview', 'growth']
      },
      {
        name: 'Novos Assinantes',
        slug: 'novos-assinantes',
        description: 'Novos assinantes no período',
        valueType: 'number',
        visualizationType: 'bar_chart',
        sections: ['growth']
      },
      {
        name: 'Taxa de Churn',
        slug: 'churn-rate',
        description: 'Percentual de cancelamentos',
        valueType: 'percent',
        visualizationType: 'line_chart',
        sections: ['overview', 'churn']
      },
      {
        name: 'Reembolsos',
        slug: 'reembolsos',
        description: 'Total de reembolsos',
        valueType: 'currency',
        visualizationType: 'bar_chart',
        sections: ['refunds']
      },
      {
        name: 'Taxa de Reembolso',
        slug: 'taxa-reembolso',
        description: 'Percentual de reembolsos',
        valueType: 'percent',
        visualizationType: 'number',
        sections: ['refunds']
      },
      {
        name: 'Crescimento Líquido',
        slug: 'crescimento-liquido',
        description: 'Novos assinantes - Churn',
        valueType: 'number',
        visualizationType: 'line_chart',
        sections: ['growth']
      },
      {
        name: 'ARPU',
        slug: 'arpu',
        description: 'Average Revenue Per User',
        valueType: 'currency',
        visualizationType: 'number',
        sections: ['overview', 'mrr']
      }
    ]
  }
};

export function getTemplateById(templateId: string): DashboardTemplate | null {
  return dashboardTemplates[templateId] || null;
}

export function getAllTemplates(): DashboardTemplate[] {
  return Object.values(dashboardTemplates);
}
