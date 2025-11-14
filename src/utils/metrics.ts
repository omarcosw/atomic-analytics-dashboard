/**
 * FUNÇÕES AUXILIARES PARA MÉTRICAS
 * 
 * Este arquivo contém funções que ajudam a determinar cores, ícones
 * e outros aspectos visuais das métricas.
 */

/**
 * Determina a cor da métrica baseada no nome e tipo
 * 
 * @param name - Nome da métrica
 * @param valueType - Tipo do valor
 * @returns Código de cor hexadecimal
 */
export const getMetricColor = (name: string, valueType: string): string => {
  const nameLower = name.toLowerCase();
  
  // Métricas de receita e faturamento = AZUL
  if (valueType === "currency" || nameLower.includes("receita") || nameLower.includes("faturamento")) {
    return "#005CFF";
  }
  
  // Métricas de leads e vendas = VERDE
  if (nameLower.includes("leads") || nameLower.includes("vendas")) {
    return "#18A34A";
  }
  
  // Métricas de conversão e ROI = ROXO
  if (valueType === "percent" || nameLower.includes("conversão") || nameLower.includes("roi")) {
    return "#7C3AED";
  }
  
  // Métricas de tráfego e custos = LARANJA
  if (nameLower.includes("tráfego") || nameLower.includes("cpl") || nameLower.includes("cpc")) {
    return "#F39C12";
  }
  
  // Padrão = AZUL
  return "#005CFF";
};

/**
 * Determina se um valor de trend é positivo
 * 
 * @param trend - Valor da variação
 * @returns true se positivo, false se negativo
 */
export const isTrendPositive = (trend: number): boolean => {
  return trend >= 0;
};

/**
 * Calcula a porcentagem de uma meta atingida
 * 
 * @param current - Valor atual
 * @param goal - Meta a ser atingida
 * @returns Porcentagem atingida (0-100+)
 */
export const calculateGoalPercentage = (current: number, goal: number): number => {
  if (!goal || goal === 0) return 0;
  return (current / goal) * 100;
};
