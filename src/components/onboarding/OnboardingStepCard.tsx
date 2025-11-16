/**
 * COMPONENTE: Card de Passo do Onboarding
 * 
 * Exibe um passo do onboarding com:
 * - Ícone visual
 * - Título e descrição
 * - Status (pendente, ativo, concluído)
 * - Botão de ação
 * 
 * ONDE É USADO:
 * - Página de onboarding
 */

import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStepCardProps {
  stepNumber: number;
  currentStep: number;
  title: string;
  description: string;
  icon: string;
  onStart: () => void;
}

export const OnboardingStepCard = ({
  stepNumber,
  currentStep,
  title,
  description,
  icon,
  onStart,
}: OnboardingStepCardProps) => {
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;
  const isPending = currentStep < stepNumber;

  const containerClasses = cn(
    "relative rounded-3xl border p-6 transition-all backdrop-blur-xl",
    isCompleted && "bg-emerald-500/10 border-emerald-400/30 shadow-[0_15px_60px_rgba(16,185,129,0.25)]",
    isActive && "bg-white/10 border-white/40 shadow-[0_20px_65px_rgba(59,130,246,0.4)]",
    isPending && "bg-white/5 border-white/10",
  );

  return (
    <div className={containerClasses}>
      {/* Badge de status */}
      <div className="absolute -top-3 -right-3">
        {isCompleted ? (
          <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/40">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        ) : isActive ? (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Circle className="w-6 h-6 text-[#030711]" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-white/70" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase">
                Passo {stepNumber}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/70">{description}</p>
          </div>
        </div>

        <div className="flex justify-end">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-emerald-300 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Concluído
            </div>
          ) : isActive ? (
            <Button onClick={onStart} size="sm" className="gap-2 bg-white text-[#030711] hover:bg-white/90">
              Iniciar passo
            </Button>
          ) : (
            <Button disabled size="sm" variant="ghost" className="text-white/50">
              Aguarde o passo anterior
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
