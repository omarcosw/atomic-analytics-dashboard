import { useState } from "react";
import { heroMetrics, heroChartData } from "@/data/loginHero";
import { TrendingUp } from "lucide-react";

export const HeroDashboardPreview = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <div
      className="hero-dashboard-preview"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale(${isHovering ? 1.02 : 1})`,
        transition: "transform 0.08s ease-out",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-white/90 text-sm font-semibold mb-1">
          Visão geral de lançamento
        </h3>
        <p className="text-white/60 text-xs">Lançamento Novembro 2024</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {heroMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 transition-all duration-200 hover:bg-white/15 hover:border-white/30"
          >
            <div className="text-white/70 text-[10px] font-medium mb-1">
              {metric.label}
            </div>
            <div className="text-white text-base font-bold mb-1">
              {metric.value}
            </div>
            <div className="flex items-center gap-1 text-green-300 text-[10px] font-medium">
              <TrendingUp className="w-3 h-3" />
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Mini gráfico */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <div className="text-white/70 text-xs font-medium mb-3">
          Receita diária
        </div>
        <div className="relative h-24 flex items-end gap-1">
          {heroChartData.map((point, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-300 hover:to-blue-200"
              style={{
                height: `${point.value}%`,
                opacity: 0.7 + (point.value / 100) * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
