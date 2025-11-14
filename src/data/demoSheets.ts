/**
 * DADOS FAKE: Google Sheets
 * 
 * Este arquivo contém planilhas simuladas para testar o fluxo
 * de conexão e mapeamento com Google Sheets.
 * 
 * ESTRUTURA:
 * - files: lista de planilhas disponíveis
 * - cada planilha tem: id, name, tabs, preview
 * 
 * ONDE É USADO:
 * - Modal de conexão com Google Sheets
 * - Página de mapeamento de colunas
 * - Preview de dados da planilha
 */

export const demoSheets = {
  files: [
    {
      id: "sheet-1",
      name: "Planilha de Métricas — Lançamento",
      tabs: ["Página1", "Métricas", "Leads2025"],
      lastSync: "2025-01-15 14:30",
      preview: [
        ["Nome", "Email", "Lead?", "Venda?", "Valor", "Data"],
        ["João Silva", "joao@teste.com", "Sim", "Não", "0", "2025-01-02"],
        ["Maria Santos", "maria@teste.com", "Sim", "Sim", "197", "2025-01-04"],
        ["Pedro Costa", "pedro@teste.com", "Não", "Não", "0", "2025-01-06"],
        ["Ana Paula", "ana@teste.com", "Sim", "Sim", "297", "2025-01-08"],
        ["Carlos Lima", "carlos@teste.com", "Sim", "Não", "0", "2025-01-10"],
        ["Julia Rocha", "julia@teste.com", "Sim", "Sim", "197", "2025-01-12"],
        ["Roberto Alves", "roberto@teste.com", "Sim", "Sim", "397", "2025-01-14"]
      ]
    },
    {
      id: "sheet-2",
      name: "Dados de Leads",
      tabs: ["Leads", "Conversões", "Métricas"],
      lastSync: "2025-01-14 09:15",
      preview: [
        ["ID", "Nome", "Status", "Origem", "CPL", "Data"],
        ["001", "Lead A", "Ativo", "Facebook", "15.50", "2025-01-01"],
        ["002", "Lead B", "Convertido", "Google", "12.30", "2025-01-02"],
        ["003", "Lead C", "Ativo", "Instagram", "18.90", "2025-01-03"]
      ]
    },
    {
      id: "sheet-3",
      name: "Métricas Campanhas",
      tabs: ["Visão Geral", "Facebook", "Google Ads"],
      lastSync: "2025-01-15 16:45",
      preview: [
        ["Campanha", "Investimento", "Leads", "Vendas", "ROI", "Data"],
        ["Camp A", "1500", "120", "15", "2.5", "2025-01-10"],
        ["Camp B", "2000", "180", "22", "3.2", "2025-01-11"],
        ["Camp C", "1200", "95", "10", "1.8", "2025-01-12"]
      ]
    }
  ]
};
