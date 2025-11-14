import { memo, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Target, Percent, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  metric: {
    id: string;
    name: string;
    value: number;
    valueType: "number" | "currency" | "percent";
    isOverridden: boolean;
    trend?: number; // Variação em % (ex: +12.6 ou -5.2)
    sparklineData?: number[]; // Dados para mini gráfico
  };
  onClick: () => void;
}

// Hook para animação countUp
const useCountUp = (end: number, duration: number = 800) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    countRef.current = 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function para suavidade
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

// Determinar cor da métrica baseada no tipo
const getMetricColor = (name: string, valueType: string): string => {
  if (valueType === "currency" || name.toLowerCase().includes("receita") || name.toLowerCase().includes("faturamento")) {
    return "#005CFF"; // Azul para receita
  }
  if (name.toLowerCase().includes("leads") || name.toLowerCase().includes("vendas")) {
    return "#2ECC71"; // Verde para leads
  }
  if (valueType === "percent" || name.toLowerCase().includes("conversão") || name.toLowerCase().includes("roi")) {
    return "#9B59B6"; // Roxo para conversão
  }
  if (name.toLowerCase().includes("tráfego") || name.toLowerCase().includes("cpl") || name.toLowerCase().includes("cpc")) {
    return "#F39C12"; // Laranja para tráfego
  }
  return "#005CFF"; // Default azul
};

const getMetricIcon = (name: string, valueType: string, color: string) => {
  const iconClass = "w-4 h-4";
  const style = { color };
  
  if (name.toLowerCase().includes("leads") || name.toLowerCase().includes("vendas")) {
    return <Users className={iconClass} style={style} />;
  }
  if (valueType === "currency" || name.toLowerCase().includes("receita") || name.toLowerCase().includes("faturamento")) {
    return <DollarSign className={iconClass} style={style} />;
  }
  if (valueType === "percent" || name.toLowerCase().includes("roi") || name.toLowerCase().includes("conversão")) {
    return <Percent className={iconClass} style={style} />;
  }
  return <Target className={iconClass} style={style} />;
};

// Componente Sparkline miniatura
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
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

const MetricCard = ({ metric, onClick }: MetricCardProps) => {
  const animatedValue = useCountUp(metric.value);
  const metricColor = getMetricColor(metric.name, metric.valueType);

  const formatValue = (value: number, type: string) => {
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

  return (
    <Card 
      className={`
        group relative cursor-pointer overflow-hidden border transition-all duration-150
        ${metric.isOverridden 
          ? 'bg-[#FFF9E6] border-[#F39C12]/20 hover:border-[#F39C12]/40' 
          : 'bg-gradient-to-br from-[#F8FAFF] to-white border-border/40 hover:border-primary/30'
        }
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        hover:-translate-y-0.5
        h-[160px]
      `}
      style={{ borderRadius: '14px' }}
      onClick={onClick}
    >
      {/* Sparkline miniatura */}
      {metric.sparklineData && metric.sparklineData.length > 0 && (
        <Sparkline data={metric.sparklineData} color={metricColor} />
      )}

      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            {getMetricIcon(metric.name, metric.valueType, metricColor)}
            <CardTitle 
              className="text-[13px] font-semibold leading-tight tracking-wide"
              style={{ color: '#7A7A7A', letterSpacing: '0.3px' }}
            >
              {metric.name}
            </CardTitle>
          </div>
          {metric.isOverridden && (
            <Badge 
              className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: '#FFF3CD',
                color: '#F39C12',
                border: '1px solid #F39C12'
              }}
            >
              AJUSTADO
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-4 relative">
        {/* Valor principal com animação */}
        <div 
          className="text-[42px] font-bold leading-none mb-2 transition-transform duration-200 group-hover:scale-[1.02]"
          style={{ color: metricColor }}
        >
          {formatValue(animatedValue, metric.valueType)}
        </div>

        {/* Meta-informações (variação) */}
        {metric.trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-3">
            {metric.trend >= 0 ? (
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#2ECC71' }} />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" style={{ color: '#E74C3C' }} />
            )}
            <span 
              className="text-xs font-semibold"
              style={{ color: metric.trend >= 0 ? '#2ECC71' : '#E74C3C' }}
            >
              {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground ml-0.5">
              nos últimos 7 dias
            </span>
          </div>
        )}
      </CardContent>
      
      {/* Brilho leve na borda ao hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        style={{
          borderRadius: '14px',
          boxShadow: `inset 0 0 0 1px ${metricColor}15`
        }}
      />
    </Card>
  );
};

// Memoizar componente para evitar re-renders desnecessários
export default memo(MetricCard, (prevProps, nextProps) => {
  // Só re-renderizar se alguma propriedade relevante mudou
  return (
    prevProps.metric.id === nextProps.metric.id &&
    prevProps.metric.value === nextProps.metric.value &&
    prevProps.metric.isOverridden === nextProps.metric.isOverridden &&
    prevProps.onClick === nextProps.onClick
  );
});
