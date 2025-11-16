/**
 * PÁGINA: Onboarding
 * 
 * Guia inicial para novos usuários configurarem o Atomic+.
 * 
 * FLUXO:
 * 1. Criar primeiro dashboard
 * 2. Conectar Google Sheets
 * 3. Selecionar aba da planilha
 * 4. Configurar mapeamento de métricas
 * 5. Ativar dashboard
 * 6. Visualizar versão pública
 * 
 * DADOS:
 * - Usa /data/demoOnboarding.ts para rastrear progresso
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { OnboardingStepCard } from "@/components/onboarding/OnboardingStepCard";
import { demoOnboarding, skipOnboarding, completeOnboarding } from "@/data/demoOnboarding";
import { toast } from "@/hooks/use-toast";
import { Sparkles, ArrowRight } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(demoOnboarding.step);

  useEffect(() => {
    // Atualizar estado local quando demoOnboarding mudar
    const interval = setInterval(() => {
      setCurrentStep(demoOnboarding.step);
      
      // Se completou todos os passos
      if (demoOnboarding.step > 6 && !demoOnboarding.completed) {
        completeOnboarding();
        toast({
          title: "🎉 Onboarding concluído!",
          description: "Bem-vindo ao Atomic+. Você está pronto para começar!",
        });
        
        setTimeout(() => {
          navigate("/projects");
        }, 2000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSkip = () => {
    skipOnboarding();
    toast({
      title: "Onboarding pulado",
      description: "Você pode voltar ao onboarding a qualquer momento.",
    });
    navigate("/projects");
  };

  const steps = [
    {
      number: 1,
      title: "Criar seu primeiro dashboard",
      description: "Configure um painel para acompanhar as métricas do seu lançamento",
      icon: "🚀",
      action: () => {
        navigate("/projects?openNew=true");
      },
    },
    {
      number: 2,
      title: "Conectar Google Sheets",
      description: "Conecte sua planilha para importar métricas automaticamente",
      icon: "📊",
      action: () => {
        navigate("/data-sources?openModal=true");
      },
    },
    {
      number: 3,
      title: "Selecionar aba da planilha",
      description: "Escolha qual aba contém os dados das suas métricas",
      icon: "📄",
      action: () => {
        toast({
          title: "Continue no modal",
          description: "Selecione a aba da planilha no modal de conexão.",
        });
      },
    },
    {
      number: 4,
      title: "Configurar mapeamento",
      description: "Associe as colunas da planilha às métricas do dashboard",
      icon: "🔗",
      action: () => {
        navigate("/mapping");
      },
    },
    {
      number: 5,
      title: "Ativar dashboard",
      description: "Ative seu dashboard para gerar um link público de visualização",
      icon: "✨",
      action: () => {
        navigate("/project/1");
        toast({
          title: "Vá para o dashboard",
          description: "Clique no botão 'Ativar dashboard' no topo da página.",
        });
      },
    },
    {
      number: 6,
      title: "Visualizar versão pública",
      description: "Abra o link público para ver como seus clientes verão o dashboard",
      icon: "👀",
      action: () => {
        toast({
          title: "Quase lá!",
          description: "Abra o link público do dashboard para concluir o onboarding.",
        });
      },
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8 text-white">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <h1 className="text-4xl font-bold">Bem-vindo ao Atomic+</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Vamos configurar seu ambiente em poucos passos para você começar a acompanhar suas métricas profissionalmente.
          </p>
          
          {/* Barra de progresso */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/60">
                Progresso
              </span>
              <span className="text-sm font-semibold text-emerald-300">
                {currentStep - 1} / 6
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
                style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <OnboardingStepCard
              key={step.number}
              stepNumber={step.number}
              currentStep={currentStep}
              title={step.title}
              description={step.description}
              icon={step.icon}
              onStart={step.action}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 pb-4 border-t border-white/10">
          <Button variant="ghost" onClick={handleSkip} className="text-white/70 hover:text-white">
            Pular onboarding
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/projects")}
            className="gap-2 border-white/20 text-white hover:bg-white/10"
          >
            Ir para meus dashboards
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Onboarding;
