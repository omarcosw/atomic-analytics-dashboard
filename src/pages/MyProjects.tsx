import { useState, useEffect, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast";
import ProjectWizard from "@/components/projects/ProjectWizard";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { demoOnboarding, isOnboardingActive } from "@/data/demoOnboarding";
import { useAuth } from "@/hooks/useAuth";
import { createProject, deleteProject, fetchProjects, updateProject, type ProjectRecord } from "@/services/projectsService";
import { TechBackground } from "@/components/layout/TechBackground";

const MyProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Proteção de rota - redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const formatTimeSince = (dateInput: Date | string) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} horas`;
    return `há ${Math.floor(hours / 24)} dias`;
  };

  const refreshProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setProjectsLoading(false);
      return;
    }
    try {
      setProjectsLoading(true);
      const data = await fetchProjects(user.id);
      setProjects(data);
      setShowOnboarding(data.length === 0);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar seus dashboards. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProjectsLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const handleDuplicate = async (projectId: string) => {
    if (!user) return;
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (!projectToDuplicate) return;

    try {
      await createProject({
        user_id: user.id,
        name: `${projectToDuplicate.name} (cópia)`,
        type: projectToDuplicate.type,
        status: "preparing",
        start_date: projectToDuplicate.start_date,
        end_date: projectToDuplicate.end_date,
        goals: projectToDuplicate.goals,
      });
      toast({
        title: "Dashboard duplicado",
        description: "Uma cópia do dashboard foi criada com sucesso.",
      });
      refreshProjects();
    } catch (error) {
      console.error("Erro ao duplicar projeto:", error);
      toast({
        title: "Erro ao duplicar",
        description: "Não foi possível duplicar este dashboard.",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (projectId: string) => {
    if (!user) return;
    try {
      await updateProject(projectId, { status: "archived" }, user.id);
      toast({
        title: "Dashboard arquivado",
        description: "O dashboard foi movido para arquivados.",
      });
      refreshProjects();
    } catch (error) {
      console.error("Erro ao arquivar projeto:", error);
      toast({
        title: "Erro ao arquivar",
        description: "Não foi possível arquivar este dashboard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || !user) return;

    try {
      await deleteProject(projectToDelete, user.id);
      toast({
        title: "Dashboard excluído",
        description: "O dashboard foi removido permanentemente.",
        variant: "destructive",
      });
      refreshProjects();
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir este dashboard.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Você saiu da sua conta",
      description: "Até logo!",
    });
    navigate("/auth");
  };

  // Show onboarding for first-time users
  if (!projectsLoading && showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => {
          setShowOnboarding(false);
          refreshProjects();
        }}
      />
    );
  }

  // Não renderizar nada enquanto verifica autenticação
  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <TechBackground>
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-white/50">Atomic+ Projects</p>
              <h1 className="text-4xl font-bold text-white mt-3">Meus projetos</h1>
              <p className="text-white/70 mt-2 max-w-2xl">
                Gerencie lançamentos, acompanhe funis e organize os dashboards ativos em um único hub.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/settings/appearance")}
                className="gap-2 border-white/30 text-white hover:bg-white/10"
              >
                <Settings className="w-5 h-5" />
                Aparência
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110 gap-2 shadow-[0_20px_45px_rgba(59,130,246,0.45)]"
                onClick={() => setIsWizardOpen(true)}
              >
                <Plus className="w-5 h-5" />
                Novo projeto
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-white/20 text-white/80 hover:text-white">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 border border-white/15 bg-[#050b18]/95 text-white backdrop-blur-2xl"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</p>
                      <p className="text-xs text-white/60">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate("/account/profile")}
                    className="text-white/80 focus:bg-white/10 focus:text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Minha conta
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings/general")}
                    className="text-white/80 focus:bg-white/10 focus:text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings/appearance")}
                    className="text-white/80 focus:bg-white/10 focus:text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Aparência
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/help")}
                    className="text-white/80 focus:bg-white/10 focus:text-white"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Ajuda
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-rose-400 focus:bg-rose-500/20 focus:text-rose-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {isOnboardingActive() && (
          <div className="border-y border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">Finalize o onboarding</p>
                  <p className="text-xs text-white/70">
                    {demoOnboarding.step - 1}/6 passos concluídos — configure seu primeiro dashboard.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/onboarding")}
                className="gap-2 border-white/30 text-white hover:bg-white/10"
              >
                Continuar onboarding
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-10">
            {projectsLoading ? (
              <div className="text-center py-16 text-white/60">Carregando projetos...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="text-white/60">
                  Você ainda não criou nenhum dashboard. Clique em “Novo projeto” para começar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const TypeIcon = project.type === "launch" ? Rocket : TrendingUp;
                  const goals = (project.goals || {}) as Record<string, number>;
                  const leadsTarget = goals?.leadsTarget ?? 0;
                  const revenueTarget = goals?.revenueTarget ?? 0;
                  const maxCPL = goals?.maxCPL ?? 0;
                  const minROI = goals?.minROI ?? 0;

              return (
                <Card
                  key={project.id}
                  className="group border-2 border-border/50 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-card-premium)] hover:-translate-y-1 cursor-pointer rounded-2xl"
                  onClick={() => navigate(`/project/${project.id}`, { state: { project } })}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <TypeIcon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant={project.status === "running" ? "default" : "secondary"}>
                        {project.status === "running" ? "Rodando" : project.status}
                      </Badge>
                      <Badge
                        variant={project.is_active ? "default" : "outline"}
                        className={project.is_active ? "bg-success/10 text-success border-success/20" : ""}
                      >
                        {project.is_active ? "● Ativo" : "○ Inativo"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" />
                      Atualizado {formatTimeSince(project.updated_at)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-2xl border border-white/10 bg-white/5">
                        <div className="text-sm text-white/60 mb-1">Meta de Leads</div>
                        <div className="text-xl font-bold">
                          {leadsTarget ? Number(leadsTarget).toLocaleString("pt-BR") : "—"}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-2xl border border-white/10 bg-white/5">
                        <div className="text-sm text-white/60 mb-1">Meta de Receita</div>
                        <div className="text-lg font-bold">
                          {revenueTarget
                            ? Number(revenueTarget).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                maximumFractionDigits: 0,
                              })
                            : "—"}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-2xl border border-white/10 bg-white/5">
                        <div className="text-sm text-white/60 mb-1">CPL Máximo</div>
                        <div className="text-xl font-bold">
                          {maxCPL
                            ? `R$ ${Number(maxCPL).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : "—"}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-2xl border border-white/10 bg-white/5">
                        <div className="text-sm text-white/60 mb-1">ROI Mínimo</div>
                        <div className="text-xl font-bold">
                          {minROI ? `${Number(minROI).toFixed(0)}%` : "—"}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                      <span>
                        Período:{" "}
                        {project.start_date
                          ? `${new Date(project.start_date).toLocaleDateString("pt-BR")} - ${
                              project.end_date
                                ? new Date(project.end_date).toLocaleDateString("pt-BR")
                                : "sem data final"
                            }`
                          : "Não definido"}
                      </span>
                      {project.public_slug && (
                        <button
                          className="flex items-center gap-1 text-primary text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`${window.location.origin}/d/${project.public_slug}`);
                            toast({
                              title: "Link copiado",
                              description: "Link público copiado para a área de transferência.",
                            });
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Link
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project/${project.id}` , { state: { project } });
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
      </div>
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

      <ProjectWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        onProjectCreated={() => refreshProjects()}
      />

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
  </TechBackground>
  );
};

export default MyProjects;
