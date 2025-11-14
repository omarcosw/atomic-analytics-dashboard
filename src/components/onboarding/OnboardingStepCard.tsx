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

  return (
    <div
      className={`relative border rounded-xl p-6 transition-all ${
        isCompleted
          ? "bg-green-50 border-green-200"
          : isActive
          ? "bg-blue-50 border-blue-400 border-2 shadow-lg"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Badge de status */}
      <div className="absolute -top-3 -right-3">
        {isCompleted ? (
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        ) : isActive ? (
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
            <Circle className="w-6 h-6 text-white fill-white" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Passo {stepNumber}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex justify-end">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Concluído
            </div>
          ) : isActive ? (
            <Button onClick={onStart} size="sm" className="gap-2">
              Iniciar passo
            </Button>
          ) : (
            <Button disabled size="sm" variant="ghost">
              Aguarde o passo anterior
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
