import { ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type TechBackgroundProps = {
  children: ReactNode;
  className?: string;
  showParticles?: boolean;
  showBackButton?: boolean;
};

export const TechBackground = ({
  children,
  className,
  showParticles = true,
  showBackButton = true,
}: TechBackgroundProps) => {
  const navigate = useNavigate();
  const orbs = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: `orb-${index}`,
        size: Math.random() * 120 + 40,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.3 + 0.15,
      })),
    [],
  );

  const twinkles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: `twinkle-${index}`,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
      })),
    [],
  );

  const pulseLines = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        id: `pulse-${index}`,
        top: Math.random() * 80 + 10,
        delay: Math.random() * 3,
        duration: Math.random() * 6 + 6,
      })),
    [],
  );

  return (
    <div className={cn("min-h-screen bg-[#030711] text-white relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)] pointer-events-none" />
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {orbs.map((orb) => (
            <span
              key={orb.id}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-500/15 to-purple-500/25 shadow-[0_0_90px_rgba(14,165,233,0.45)] blur-3xl animate-orb"
              style={{
                width: orb.size,
                height: orb.size,
                top: `${orb.top}%`,
                left: `${orb.left}%`,
                animationDuration: `${orb.duration}s`,
                animationDelay: `${orb.delay}s`,
                opacity: orb.opacity,
              }}
            />
          ))}
          {pulseLines.map((line) => (
            <span
              key={line.id}
              className="absolute h-px w-1/2 left-1/4 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent animate-pulse-line"
              style={{ top: `${line.top}%`, animationDuration: `${line.duration}s`, animationDelay: `${line.delay}s` }}
            />
          ))}
          {twinkles.map((twinkle) => (
            <span
              key={twinkle.id}
              className="absolute rounded-full bg-white/70 animate-twinkle"
              style={{
                width: twinkle.size,
                height: twinkle.size,
                top: `${twinkle.top}%`,
                left: `${twinkle.left}%`,
                animationDelay: `${twinkle.delay}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,7,17,0),rgba(14,165,233,0.08))]" />
      {showBackButton && (
        <div className="absolute left-6 bottom-6 z-30">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-white/90 shadow-[0_10px_35px_rgba(0,0,0,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/70 hover:text-white hover:shadow-[0_15px_40px_rgba(14,165,233,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Voltar para a tela anterior"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </button>
        </div>
      )}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default TechBackground;
