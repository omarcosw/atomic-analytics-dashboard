/**
 * DADOS FAKE: Mapeamentos do Usuário
 * 
 * Este arquivo armazena os mapeamentos entre colunas da planilha
 * e as métricas do dashboard.
 * 
 * FORMATO:
 * {
 *   "sheet-id": {
 *     "Nome da Métrica": "Coluna da Planilha"
 *   }
 * }
 * 
 * ONDE É USADO:
 * - Página de mapeamento
 * - Dashboard (para mostrar fonte conectada)
 * 
 * COMO EDITAR:
 * - Na página de mapeamento, o usuário escolhe as colunas
 * - Este objeto é atualizado automaticamente
 */

export const userMappings: Record<string, Record<string, string>> = {
  "sheet-1": {
    "Leads Captados": "C",
    "Vendas Confirmadas": "D",
    "Faturamento": "E",
    "CPL": "",
    "Investimento": ""
  }
};

// Função helper para atualizar mapeamentos
export const updateMapping = (sheetId: string, metric: string, column: string) => {
  if (!userMappings[sheetId]) {
    userMappings[sheetId] = {};
  }
  userMappings[sheetId][metric] = column;
};

// Função helper para verificar se há fonte conectada
export const hasConnectedSource = () => {
  return Object.keys(userMappings).length > 0;
};

// Função helper para obter fonte conectada
export const getConnectedSource = () => {
  const sheetIds = Object.keys(userMappings);
  return sheetIds.length > 0 ? sheetIds[0] : null;
};
