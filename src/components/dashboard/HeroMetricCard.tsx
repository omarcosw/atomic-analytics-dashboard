import { memo, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HeroMetricCardProps {
  metric: {
    id: string;
    name: string;
    value: number;
    valueType: "number" | "currency" | "percent";
    isOverridden: boolean;
    trend?: number;
    goal?: number;
    sparklineData?: number[];
  };
  onClick: () => void;
}

// Hook para animação countUp
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

// Componente Sparkline
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
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#005CFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#005CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="url(#sparklineGradient)"
        stroke="none"
      />
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

const HeroMetricCard = ({ metric, onClick }: HeroMetricCardProps) => {
  const animatedValue = useCountUp(metric.value, 1200);
  
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

  const goalPercentage = metric.goal ? (metric.value / metric.goal) * 100 : null;

  return (
    <Card 
      className="group relative cursor-pointer overflow-hidden border transition-all duration-150 bg-gradient-to-br from-[#F8FAFF] to-white border-border/40 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 col-span-2 min-h-[200px]"
      style={{ borderRadius: '14px' }}
      onClick={onClick}
    >
      <CardHeader className="pb-3 pt-5 px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1">
            <DollarSign className="w-5 h-5" style={{ color: '#005CFF' }} />
            <CardTitle 
              className="text-[14px] font-semibold leading-tight tracking-wide"
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
      
      <CardContent className="px-6 pb-5">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Valor principal */}
          <div>
            <div 
              className="text-[52px] font-bold leading-none mb-3 transition-transform duration-200 group-hover:scale-[1.01]"
              style={{ color: '#005CFF' }}
            >
              {formatValue(animatedValue, metric.valueType)}
            </div>

            {/* Meta informações */}
            <div className="space-y-2">
              {metric.goal && goalPercentage !== null && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Meta: </span>
                  <span className="font-semibold" style={{ color: '#111827' }}>
                    {formatValue(metric.goal, metric.valueType)}
                  </span>
                  <span className="text-muted-foreground"> • </span>
                  <span 
                    className="font-semibold"
                    style={{ color: goalPercentage >= 100 ? '#18A34A' : '#F39C12' }}
                  >
                    {goalPercentage.toFixed(0)}% atingido
                  </span>
                </div>
              )}

              {metric.trend !== undefined && (
                <div className="flex items-center gap-1.5">
                  {metric.trend >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" style={{ color: '#18A34A' }} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" style={{ color: '#E53935' }} />
                  )}
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: metric.trend >= 0 ? '#18A34A' : '#E53935' }}
                  >
                    {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-0.5">
                    nos últimos 7 dias
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sparkline */}
          {metric.sparklineData && metric.sparklineData.length > 0 && (
            <div className="flex items-center justify-center">
              <Sparkline data={metric.sparklineData} />
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Brilho na borda ao hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        style={{
          borderRadius: '14px',
          boxShadow: 'inset 0 0 0 1px rgba(0, 92, 255, 0.1)'
        }}
      />
    </Card>
  );
};

export default memo(HeroMetricCard);
