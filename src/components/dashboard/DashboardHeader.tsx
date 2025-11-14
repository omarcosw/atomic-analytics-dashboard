import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Power, PowerOff, Copy, ExternalLink, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateOnboardingStep, demoOnboarding } from "@/data/demoOnboarding";

interface DashboardHeaderProps {
  projectName: string;
  projectId: string;
}

export const DashboardHeader = ({ projectName, projectId }: DashboardHeaderProps) => {
  const { toast } = useToast();
  
  // Mock state for dashboard activation - id "1" is active by default
  const [isActive, setIsActive] = useState(projectId === "1");
  const [publicSlug] = useState(projectId === "1" ? `dash-${projectId}-a3f9d2` : null);
  
  const publicUrl = publicSlug ? `${window.location.origin}/d/${publicSlug}` : null;
  
  const handleToggleActive = () => {
    if (!isActive) {
      setIsActive(true);
      
      // Atualizar progresso do onboarding (passo 5 -> 6)
      if (demoOnboarding.step === 5) {
        updateOnboardingStep(6);
      }
      
      toast({
        title: "Dashboard ativado com sucesso",
        description: demoOnboarding.step === 6 
          ? "Último passo: abra o link público para concluir o onboarding!"
          : "Seu link público foi gerado e está disponível.",
      });
    } else {
      setIsActive(false);
      toast({
        title: "Dashboard desativado",
        description: "O link público não está mais acessível.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyLink = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast({
        title: "Link copiado!",
        description: "O link público foi copiado para a área de transferência.",
      });
    }
  };

  const handleOpenPublicLink = () => {
    if (publicUrl) {
      // Atualizar progresso do onboarding ao abrir link público (passo 6 -> conclusão)
      if (demoOnboarding.step === 6) {
        updateOnboardingStep(7); // Completa o onboarding
        toast({
          title: "🎉 Onboarding concluído!",
          description: "Bem-vindo ao Atomic+. Você está pronto para começar!",
        });
      }
      
      window.open(publicUrl, "_blank");
    }
  };

  return (
    <div className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto w-full px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">{projectName}</h1>
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={isActive ? "bg-success/10 text-success border-success/20" : ""}
            >
              {isActive ? "● Ativo" : "○ Inativo"}
            </Badge>
          </div>
          <Button
            onClick={handleToggleActive}
            variant={isActive ? "outline" : "default"}
            className={isActive ? "border-destructive/50 text-destructive hover:bg-destructive/10" : "bg-gradient-primary"}
          >
            {isActive ? (
              <>
                <PowerOff className="w-4 h-4 mr-2" />
                Desativar dashboard
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-2" />
                Ativar dashboard
              </>
            )}
          </Button>
        </div>
        
        {/* Public link area */}
        {isActive && publicUrl && (
          <div className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Link público do dashboard:
                </p>
                <Input
                  value={publicUrl}
                  readOnly
                  className="bg-background/50"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopyLink} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar link
                </Button>
                <Button 
                  onClick={handleOpenPublicLink}
                  variant="outline" 
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir em nova aba
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Inactive state message */}
        {!isActive && (
          <Alert className="mt-4 border-warning/20 bg-warning/5">
            <Info className="h-4 w-4 text-warning" />
            <AlertDescription className="text-muted-foreground">
              Este dashboard está inativo. Ative para gerar um link público de visualização.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
