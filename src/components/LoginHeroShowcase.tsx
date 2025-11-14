import { useState } from "react";

export const LoginHeroShowcase = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: relY * -6, // inclina pra cima/baixo
      y: relX * 6,  // inclina pra esquerda/direita
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const style = {
    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
    transition: "transform 0.12s ease-out",
  };


  const chartData = [35, 50, 42, 60, 68, 80, 72];

  return (
    <div
      className="w-full max-w-[600px] transition-transform"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <div
        className="
          bg-white/10
          border border-white/10
          rounded-2xl
          backdrop-blur-xl
          p-6
          shadow-lg
          select-none
        "
      >
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-white/60">Resumo em tempo real</p>
              <p className="text-base font-semibold text-white">
                Lançamento Novembro 2024
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 text-[11px] font-medium">
              Demo interativo
            </span>
          </div>

          {/* BLOCO SUPERIOR: MÉTRICAS */}
          <div className="grid grid-cols-2 gap-4">
            {/* COLUNA ESQUERDA: PRINCIPAL */}
            <div className="rounded-2xl bg-white/7 border border-white/15 px-4 py-3 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-white/60">Faturamento total</p>
                <p className="text-xl font-semibold text-white">R$ 847.392</p>
              </div>
              <div className="mt-2">
                <p className="text-[11px] text-emerald-300">+24% vs último lançamento</p>
                <p className="text-[11px] text-white/45">Últimos 30 dias</p>
              </div>
            </div>

            {/* COLUNA DIREITA: 3 SECUNDÁRIAS */}
            <div className="flex flex-col gap-2">
              {/* Leads */}
              <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-white/60">Leads</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">3.247</p>
                  <p className="text-[11px] text-emerald-300">+18%</p>
                </div>
              </div>

              {/* ROI */}
              <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-white/60">ROI</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">4,2x</p>
                  <p className="text-[11px] text-emerald-300">+12%</p>
                </div>
              </div>

              {/* CPL */}
              <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[11px] text-white/60">CPL</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">R$ 12,50</p>
                  <p className="text-[11px] text-rose-300">-8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO INFERIOR: GRÁFICO */}
          <div className="rounded-2xl bg-white/5 border border-white/12 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/60">Faturamento diário</span>
              <span className="text-[11px] text-white/40">Últimos 7 dias</span>
            </div>
            <div className="h-20 flex items-end gap-1">
              {chartData.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-full bg-gradient-to-t from-blue-400/40 to-white"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
