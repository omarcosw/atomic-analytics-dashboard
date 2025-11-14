/**
 * COMPONENTE: Card de Métrica HERO (Destaque)
 * 
 * Este é o card GRANDE que fica em destaque no topo do dashboard.
 * Usado para a métrica mais importante (geralmente Faturamento Total).
 * 
 * DIFERENÇAS DO CARD NORMAL:
 * - Ocupa 2 colunas na grid
 * - Valor maior e mais visível
 * - Mostra progresso da meta com barra
 * - Mini gráfico maior e mais visível
 * 
 * PROPRIEDADES:
 * - metric: objeto com informações da métrica + goal (meta)
 * - onClick: função chamada quando o card é clicado
 */

import { memo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatValue } from "@/utils/format";
import { calculateGoalPercentage, isTrendPositive } from "@/utils/metrics";
import "@/styles/theme.css";

// Tipo de dados da métrica hero
export interface HeroMetricData {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  isOverridden: boolean;
  trend?: number;
  goal?: number; // Meta a ser atingida
  sparklineData?: number[];
}

interface MetricCardHeroProps {
  metric: HeroMetricData;
  onClick: () => void;
}

// ========================================
// ANIMAÇÃO COUNTUP
// ========================================
const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
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
// SPARKLINE MAIOR (para card hero)
// ========================================
const Sparkline = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg 
      className="w-full h-20 opacity-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Gradiente de preenchimento */}
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#005CFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#005CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Área preenchida */}
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="url(#sparklineGradient)"
        stroke="none"
      />
      
      {/* Linha */}
      <polyline
        points={points}
        fill="none"
        stroke="#005CFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
const MetricCardHero = ({ metric, onClick }: MetricCardHeroProps) => {
  // Animação do valor
  const animatedValue = useCountUp(metric.value, 1200);
  
  // Calcular % da meta atingida
  const goalPercentage = metric.goal ? calculateGoalPercentage(metric.value, metric.goal) : null;
  
  // Trend é positivo?
  const trendIsPositive = metric.trend ? isTrendPositive(metric.trend) : true;

  return (
    <Card 
      className="premium-card group relative cursor-pointer overflow-hidden col-span-2 min-h-[220px] border-t-[3px]"
      onClick={onClick}
      style={{ borderTopColor: 'var(--color-primary)' }}
    >
      <CardHeader className="pb-3 pt-6 px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1">
            <DollarSign className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <CardTitle className="text-[14px] font-semibold leading-tight tracking-wide uppercase" style={{ color: 'var(--color-gray)' }}>
              {metric.name}
            </CardTitle>
          </div>
          
          {/* Badge "AJUSTADO" */}
          {metric.isOverridden && (
            <Badge className="badge-adjusted">
              AJUSTADO
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {/* Valor GRANDE */}
          <div 
            className="text-[52px] font-bold leading-none tracking-tight"
            style={{ color: 'var(--color-primary)' }}
          >
            {formatValue(animatedValue, metric.valueType)}
          </div>

          {/* Linha com Variação + Meta */}
          <div className="flex items-center justify-between gap-4">
            {/* Variação (trend) */}
            {metric.trend !== undefined && (
              <div className="flex items-center gap-1.5">
                {trendIsPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${trendIsPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  nos últimos 7 dias
                </span>
              </div>
            )}

            {/* Progresso da meta */}
            {goalPercentage !== null && metric.goal && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">
                  Meta: {formatValue(metric.goal, metric.valueType)}
                </div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {goalPercentage.toFixed(1)}% atingido
                </div>
              </div>
            )}
          </div>

          {/* Barra de progresso da meta */}
          {goalPercentage !== null && (
            <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${Math.min(goalPercentage, 100)}%`,
                  backgroundColor: 'var(--color-primary)'
                }}
              />
            </div>
          )}

          {/* Mini gráfico */}
          {metric.sparklineData && (
            <div className="mt-3">
              <Sparkline data={metric.sparklineData} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Exportar com memo
export default memo(MetricCardHero);
