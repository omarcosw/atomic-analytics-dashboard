/**
 * COMPONENTE: Card de Métrica
 * 
 * Este é o card padrão que exibe uma métrica no dashboard.
 * 
 * PROPRIEDADES:
 * - metric: objeto com informações da métrica (nome, valor, tipo, etc.)
 * - onClick: função chamada quando o card é clicado
 * 
 * VISUAL:
 * - Fundo branco com gradiente sutil
 * - Sombra suave que aumenta no hover
 * - Animação de contagem (countUp) no valor
 * - Mini gráfico (sparkline) de fundo opcional
 * - Badge "AJUSTADO" quando valor foi modificado manualmente
 * 
 * ONDE É USADO:
 * - Todas as abas do dashboard (Visão Geral, Funil, Tráfego, etc.)
 */

import { memo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Percent, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatValue } from "@/utils/format";
import { getMetricColor, isTrendPositive } from "@/utils/metrics";
import "@/styles/theme.css";

// Tipo de dados da métrica
export interface MetricData {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  isOverridden: boolean;
  trend?: number;
  sparklineData?: number[];
}

interface MetricCardProps {
  metric: MetricData;
  onClick: () => void;
}

// ========================================
// ANIMAÇÃO COUNTUP (NÚMEROS SOBEM GRADUALMENTE)
// ========================================
const useCountUp = (end: number, duration: number = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Função de suavização
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const current = end * easeOutQuart;
      
      setCount(current);

      if (percentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// ========================================
// ÍCONE DA MÉTRICA (baseado no nome/tipo)
// ========================================
const getMetricIcon = (name: string, valueType: string, color: string) => {
  const iconClass = "w-4 h-4";
  const style = { color };
  
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes("leads") || nameLower.includes("vendas")) {
    return <Users className={iconClass} style={style} />;
  }
  if (valueType === "currency" || nameLower.includes("receita") || nameLower.includes("faturamento")) {
    return <DollarSign className={iconClass} style={style} />;
  }
  if (valueType === "percent" || nameLower.includes("roi") || nameLower.includes("conversão")) {
    return <Percent className={iconClass} style={style} />;
  }
  return <Target className={iconClass} style={style} />;
};

// ========================================
// MINI GRÁFICO DE FUNDO (SPARKLINE)
// ========================================
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  // Criar pontos do gráfico
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg 
      className="absolute bottom-0 right-0 w-24 h-16 opacity-10 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
const MetricCard = ({ metric, onClick }: MetricCardProps) => {
  // Animação do valor
  const animatedValue = useCountUp(metric.value, 800);
  
  // Cor da métrica (baseada no tipo/nome)
  const metricColor = getMetricColor(metric.name, metric.valueType);
  
  // Ícone da métrica
  const icon = getMetricIcon(metric.name, metric.valueType, metricColor);
  
  // Trend é positivo ou negativo?
  const trendIsPositive = metric.trend ? isTrendPositive(metric.trend) : true;

  return (
    <Card 
      className="premium-card group relative cursor-pointer overflow-hidden h-full"
      onClick={onClick}
    >
      {/* Cabeçalho: Ícone + Nome da métrica */}
      <CardHeader className="pb-2 pt-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {icon}
            <CardTitle className="text-[13px] font-semibold text-[var(--color-gray)] uppercase tracking-wide">
              {metric.name}
            </CardTitle>
          </div>
          
          {/* Badge "AJUSTADO" se valor foi modificado manualmente */}
          {metric.isOverridden && (
            <Badge className="badge-adjusted">
              AJUSTADO
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Conteúdo: Valor e Variação */}
      <CardContent className="px-5 pb-5">
        <div className="relative">
          {/* Valor principal */}
          <div 
            className="text-[40px] font-bold mb-2 leading-none tracking-tight"
            style={{ color: metricColor }}
          >
            {formatValue(animatedValue, metric.valueType)}
          </div>

          {/* Variação (trend) */}
          {metric.trend !== undefined && (
            <div className="flex items-center gap-1.5 text-sm">
              {trendIsPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={trendIsPositive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
              </span>
              <span className="text-muted-foreground text-xs ml-1">
                nos últimos 7 dias
              </span>
            </div>
          )}

          {/* Mini gráfico de fundo */}
          {metric.sparklineData && (
            <Sparkline data={metric.sparklineData} color={metricColor} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Exportar com memo para melhor performance
export default memo(MetricCard);
