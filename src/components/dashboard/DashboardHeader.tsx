import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Power, PowerOff, Copy, ExternalLink, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  projectName: string;
  projectId: string;
  isActive: boolean;
  publicSlug: string | null;
  onToggleActive: () => void;
  isToggling?: boolean;
}

export const DashboardHeader = ({
  projectName,
  isActive,
  publicSlug,
  onToggleActive,
  isToggling = false,
}: DashboardHeaderProps) => {
  const { toast } = useToast();
  
  const publicUrl = publicSlug ? `${window.location.origin}/d/${publicSlug}` : null;
  
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
            onClick={onToggleActive}
            variant={isActive ? "outline" : "default"}
            disabled={isToggling}
            className={isActive ? "border-destructive/50 text-destructive hover:bg-destructive/10" : "bg-gradient-primary"}
          >
            {isActive ? (
              <>
                <PowerOff className="w-4 h-4 mr-2" />
                {isToggling ? "Desativando..." : "Desativar dashboard"}
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-2" />
                {isToggling ? "Ativando..." : "Ativar dashboard"}
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
