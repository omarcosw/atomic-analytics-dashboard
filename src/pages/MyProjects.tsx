import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Rocket, TrendingUp, Calendar, Copy, Archive, Trash2, ExternalLink, Sparkles, ArrowRight, Settings, LogOut, User, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthFake } from "@/hooks/useAuthFake";
import ProjectWizard from "@/components/projects/ProjectWizard";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { demoProjects } from "@/data/demoProjects";
import { demoOnboarding, isOnboardingActive } from "@/data/demoOnboarding";

const MyProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuthFake();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(demoProjects.length === 0);
  const [projects, setProjects] = useState(demoProjects);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Proteção de rota - redirecionar para login se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} horas`;
    return `há ${Math.floor(hours / 24)} dias`;
  };

  const handleDuplicate = (projectId: string) => {
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (!projectToDuplicate) return;

    const newProject = {
      ...projectToDuplicate,
      id: `${Date.now()}`,
      name: `${projectToDuplicate.name} (cópia)`,
      isActive: false,
      publicSlug: null,
    };

    setProjects([...projects, newProject]);
    toast({
      title: "Dashboard duplicado",
      description: "Uma cópia do dashboard foi criada com sucesso.",
    });
  };

  const handleArchive = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast({
      title: "Dashboard arquivado",
      description: "O dashboard foi movido para arquivados.",
      variant: "default",
    });
  };

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;
    
    setProjects(projects.filter(p => p.id !== projectToDelete));
    toast({
      title: "Dashboard excluído",
      description: "O dashboard foi excluído permanentemente.",
      variant: "destructive",
    });
    
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Você saiu da sua conta",
      description: "Até logo!",
    });
    navigate("/auth");
  };

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <OnboardingWizard onComplete={() => setShowOnboarding(false)} />;
  }

  // Não renderizar nada enquanto verifica autenticação
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Meus Projetos
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie todos os seus lançamentos e funis
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/settings/appearance")}
                className="gap-2"
              >
                <Settings className="w-5 h-5" />
                Aparência
              </Button>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 gap-2"
                onClick={() => setIsWizardOpen(true)}
              >
                <Plus className="w-5 h-5" />
                Novo Projeto
              </Button>
              
              {/* User menu dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Minha conta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings/general")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings/appearance")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Aparência
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ajuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Banner de Onboarding */}
      {isOnboardingActive() && (
        <div className="border-b border-border bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Finalize o onboarding</p>
                  <p className="text-xs text-muted-foreground">
                    Configure seu primeiro dashboard em poucos passos ({demoOnboarding.step - 1}/6 completos)
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/onboarding")}
                className="gap-2"
              >
                Continuar onboarding
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              Você ainda não criou nenhum dashboard. Clique no botão acima para começar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
            const TypeIcon = project.type === "launch" ? Rocket : TrendingUp;
            const progress = (project.metrics.leads / project.goals.leadsTarget) * 100;

            return (
              <Card
                key={project.id}
                className="group border-2 border-border/50 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-card-premium)] hover:-translate-y-1 cursor-pointer rounded-2xl"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TypeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant={project.status === "running" ? "default" : "secondary"}>
                      {project.status === "running" ? "Rodando" : "Em preparação"}
                    </Badge>
                    <Badge variant={project.isActive ? "default" : "outline"} className={project.isActive ? "bg-success/10 text-success border-success/20" : ""}>
                      {project.isActive ? "● Ativo" : "○ Inativo"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3" />
                    Atualizado {formatTimeSince(project.lastUpdated)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Leads</div>
                      <div className="text-xl font-bold">{project.metrics.leads}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {progress.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Receita</div>
                      <div className="text-lg font-bold">
                        {project.metrics.revenue.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl font-bold">{project.metrics.roi}%</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/project/${project.id}`);
                      }}
                    >
                      Abrir Projeto
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(project.id);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(project.id);
                      }}
                    >
                      <Archive className="w-4 h-4 mr-1" />
                      Arquivar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </main>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este dashboard? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ProjectWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />

    {/* Footer */}
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Atomic+ Analytics. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-sm">
            <button 
              onClick={() => navigate("/legal/terms")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </button>
            <button 
              onClick={() => navigate("/legal/privacy")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidade
            </button>
            <button 
              onClick={() => navigate("/help")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Ajuda
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
};

export default MyProjects;
