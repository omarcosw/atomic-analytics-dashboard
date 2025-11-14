import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type MetricId = "faturamento" | "leads" | "roi" | "cpl" | "ctr" | "conversao" | "receita_lead" | "investimento" | "checkouts";

interface Metric {
  id: MetricId;
  label: string;
  value: string;
  change: string;
  description: string;
  isPositive: boolean;
}

interface HeroDashboardFullProps {
  motion: { x: number; y: number };
  isHovering: boolean;
}

const metricCards: Metric[] = [
  {
    id: "faturamento",
    label: "Faturamento",
    value: "R$ 847.392",
    change: "+24%",
    description: "Últimos 30 dias",
    isPositive: true,
  },
  {
    id: "leads",
    label: "Leads",
    value: "3.247",
    change: "+18%",
    description: "Novos cadastros",
    isPositive: true,
  },
  {
    id: "roi",
    label: "ROI",
    value: "4,2x",
    change: "+12%",
    description: "Retorno estimado",
    isPositive: true,
  },
  {
    id: "cpl",
    label: "CPL",
    value: "R$ 12,50",
    change: "-8%",
    description: "Custo por lead",
    isPositive: true,
  },
  {
    id: "ctr",
    label: "CTR",
    value: "2,4%",
    change: "+4%",
    description: "Taxa de cliques",
    isPositive: true,
  },
  {
    id: "conversao",
    label: "Checkout → Venda",
    value: "56,3%",
    change: "+6%",
    description: "Taxa de conversão",
    isPositive: true,
  },
  {
    id: "receita_lead",
    label: "Receita por Lead",
    value: "R$ 38,15",
    change: "+4,7%",
    description: "Ticket médio",
    isPositive: true,
  },
  {
    id: "investimento",
    label: "Investimento",
    value: "R$ 15.580",
    change: "-3%",
    description: "Total investido",
    isPositive: false,
  },
  {
    id: "checkouts",
    label: "Checkouts Iniciados",
    value: "342",
    change: "+2%",
    description: "Total de checkouts",
    isPositive: true,
  },
];

const chartConfigByMetric = {
  faturamento: { label: "Faturamento diário", color: "#60A5FA", data: [42, 58, 71, 65, 83, 92, 100] },
  leads: { label: "Leads por dia", color: "#22C55E", data: [35, 48, 62, 55, 71, 85, 92] },
  roi: { label: "ROI por campanha", color: "#A855F7", data: [28, 45, 58, 68, 75, 82, 88] },
  cpl: { label: "CPL por campanha", color: "#F97316", data: [88, 82, 75, 68, 58, 45, 38] },
};

export const HeroDashboardFull = ({ motion, isHovering }: HeroDashboardFullProps) => {
  const [activeMetric, setActiveMetric] = useState<MetricId>("faturamento");

  const chartConfig = chartConfigByMetric[activeMetric];
  const maxValue = Math.max(...chartConfig.data);

  const baseOpacity = isHovering ? 0.24 : 0.16;

  return (
    <div
      className="hero-dashboard-full"
      style={{
        transform: `translate3d(${motion.x}px, ${motion.y}px, 0)`,
        transition: "transform 0.08s ease-out, opacity 0.3s ease-out",
        opacity: baseOpacity,
      }}
    >
      {/* Header */}
      <div className="hero-dashboard-header">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">Visão geral do lançamento</h3>
          <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 font-medium">
            Modo demo
          </div>
        </div>
        <p className="text-sm text-white/60">Lançamento Novembro 2024</p>
      </div>

      {/* Metrics Grid - 3 columns */}
      <div className="hero-dashboard-metrics-full">
        {metricCards.map((metric) => {
          const isActive = metric.id === activeMetric;
          return (
            <div
              key={metric.id}
              className="hero-metric-card"
              onMouseEnter={() => setActiveMetric(metric.id)}
              style={{
                transform: isActive ? "scale(1.03)" : "scale(1)",
                boxShadow: isActive
                  ? "0 0 24px rgba(96, 165, 250, 0.4), 0 8px 32px rgba(15, 23, 42, 0.3)"
                  : "0 4px 16px rgba(15, 23, 42, 0.2)",
                borderColor: isActive ? "rgba(96, 165, 250, 0.6)" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-white/60 font-medium">{metric.label}</span>
                <div className="flex items-center gap-1">
                  {metric.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      metric.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-xs text-white/50">{metric.description}</div>
            </div>
          );
        })}
      </div>

      {/* Chart - Larger */}
      <div className="hero-dashboard-chart-large">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-white">{chartConfig.label}</span>
          <span className="text-xs text-white/60">Últimos 7 dias</span>
        </div>
        <div className="flex items-end justify-between gap-3 h-40">
          {chartConfig.data.map((value, index) => {
            const heightPercent = (value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: chartConfig.color,
                    boxShadow: `0 0 12px ${chartConfig.color}40`,
                  }}
                />
                <span className="text-[10px] text-white/50">D{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
