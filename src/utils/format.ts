/**
 * FUNÇÕES DE FORMATAÇÃO
 * 
 * Este arquivo contém todas as funções que formatam valores para exibição.
 * Usado para formatar moeda, porcentagem, números, etc.
 */

/**
 * Formata um número de acordo com o tipo especificado
 * 
 * @param value - O valor numérico a ser formatado
 * @param type - O tipo de formatação: "currency", "percent" ou "number"
 * @returns String formatada para exibição
 * 
 * Exemplos:
 * - formatValue(1247, "number") → "1.247"
 * - formatValue(47580.50, "currency") → "R$ 47.580,50"
 * - formatValue(3.8, "percent") → "3,8%"
 */
export const formatValue = (value: number, type: "number" | "currency" | "percent"): string => {
  switch (type) {
    case "currency":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    
    case "percent":
      return `${value.toFixed(1)}%`;
    
    default:
      return new Intl.NumberFormat("pt-BR").format(value);
  }
};

/**
 * Formata um número de trend (variação percentual)
 * 
 * @param trend - Valor da variação (ex: 12.6 para +12.6% ou -5.4 para -5.4%)
 * @returns String formatada com sinal
 * 
 * Exemplos:
 * - formatTrend(12.6) → "+12,6%"
 * - formatTrend(-5.4) → "-5,4%"
 */
export const formatTrend = (trend: number): string => {
  const sign = trend >= 0 ? "+" : "";
  return `${sign}${trend.toFixed(1)}%`;
};

/**
 * Formata uma data no formato brasileiro
 * 
 * @param date - Objeto Date
 * @returns String no formato DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

/**
 * Formata um número grande de forma compacta
 * 
 * @param value - Valor numérico
 * @returns String compacta (ex: 1.2K, 3.5M)
 * 
 * Exemplos:
 * - formatCompact(1247) → "1,2K"
 * - formatCompact(520000) → "520K"
 */
export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};
