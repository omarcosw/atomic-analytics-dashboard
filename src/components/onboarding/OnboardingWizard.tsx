import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  ChevronRight, 
  Rocket, 
  Repeat, 
  Zap, 
  CalendarIcon,
  FileSpreadsheet,
  Target,
  LayoutDashboard
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Form data
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<"launch" | "recurring" | "other">("launch");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedSheet, setSelectedSheet] = useState("");
  const [template, setTemplate] = useState<"launch" | "recurring" | "subscription">("launch");
  const [leadsTarget, setLeadsTarget] = useState("");
  const [revenueTarget, setRevenueTarget] = useState("");
  const [maxCPL, setMaxCPL] = useState("");
  const [minROI, setMinROI] = useState("");

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 2 && !projectName) {
      toast({
        title: "Atenção",
        description: "Por favor, informe o nome do projeto.",
        variant: "destructive",
      });
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handleFinish = () => {
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      type: projectType,
      status: "preparing" as const,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      goals: {
        leadsTarget: leadsTarget ? parseFloat(leadsTarget) : 0,
        revenueTarget: revenueTarget ? parseFloat(revenueTarget) : 0,
        maxCPL: maxCPL ? parseFloat(maxCPL) : 0,
        minROI: minROI ? parseFloat(minROI) : 0,
      },
      template,
      selectedSheet,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    console.log("Creating first project:", newProject);

    toast({
      title: "Projeto criado!",
      description: `Bem-vindo ao Atomic+! Seu projeto "${projectName}" está pronto.`,
    });

    onComplete();
    navigate(`/project/${newProject.id}`);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground min-w-[80px]">
              Passo {step} de {totalSteps}
            </span>
            <Progress value={progress} className="flex-1" />
            <span className="text-sm font-medium text-primary min-w-[50px] text-right">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-8 max-w-2xl animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Bem-vindo ao Atomic+
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                  A forma mais simples de acompanhar seus lançamentos e funis com dados do Google Sheets.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                  <FileSpreadsheet className="w-8 h-8 text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Conecte suas planilhas</h3>
                  <p className="text-sm text-muted-foreground">Integração direta com Google Sheets</p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                  <LayoutDashboard className="w-8 h-8 text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Dashboards prontos</h3>
                  <p className="text-sm text-muted-foreground">Templates para cada tipo de projeto</p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                  <Target className="w-8 h-8 text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Acompanhe metas</h3>
                  <p className="text-sm text-muted-foreground">Alertas e projeções automáticas</p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 h-auto mt-8"
                onClick={handleNext}
              >
                Começar
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Project Info */}
          {step === 2 && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Crie seu primeiro projeto</h2>
                <p className="text-muted-foreground">Vamos começar com as informações básicas</p>
              </div>
              
              <div className="space-y-6 bg-card p-8 rounded-2xl border-2 border-border shadow-lg">
                <div>
                  <Label htmlFor="projectName" className="text-base font-semibold">
                    Nome do Projeto *
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Ex: Lançamento Novembro 2024"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2 h-12 text-base"
                    autoFocus
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Tipo de Projeto</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setProjectType("launch")}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                        projectType === "launch"
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <Rocket className={cn("w-8 h-8 mb-3", projectType === "launch" ? "text-primary" : "text-muted-foreground")} />
                      <h4 className="font-semibold mb-1">Lançamento</h4>
                      <p className="text-xs text-muted-foreground">Campanha pontual</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectType("recurring")}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                        projectType === "recurring"
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <Repeat className={cn("w-8 h-8 mb-3", projectType === "recurring" ? "text-primary" : "text-muted-foreground")} />
                      <h4 className="font-semibold mb-1">Perpétuo</h4>
                      <p className="text-xs text-muted-foreground">Funil contínuo</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectType("other")}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                        projectType === "other"
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <Zap className={cn("w-8 h-8 mb-3", projectType === "other" ? "text-primary" : "text-muted-foreground")} />
                      <h4 className="font-semibold mb-1">Outro</h4>
                      <p className="text-xs text-muted-foreground">Personalizado</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                  onClick={handleNext}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Dates */}
          {step === 3 && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Defina o período</h2>
                <p className="text-muted-foreground">
                  {projectType === "recurring" 
                    ? "Opcional para projetos perpétuos"
                    : "Quando seu projeto começa e termina?"
                  }
                </p>
              </div>
              
              <div className="space-y-6 bg-card p-8 rounded-2xl border-2 border-border shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-semibold">Data de Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2 h-12",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Data de Fim</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2 h-12",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                  onClick={handleNext}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Connect Sheets */}
          {step === 4 && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Conecte suas planilhas</h2>
                <p className="text-muted-foreground">Selecione a planilha do Google Sheets que alimentará seus dados</p>
              </div>
              
              <div className="space-y-6 bg-card p-8 rounded-2xl border-2 border-border shadow-lg">
                <div className="text-center py-12 space-y-4">
                  <FileSpreadsheet className="w-16 h-16 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Conectar Google Sheets</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Autorize o acesso às suas planilhas para começar
                    </p>
                    <Button variant="outline" size="lg" className="gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Conectar Conta Google
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground pt-4">
                    Você poderá configurar as células específicas depois
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                  onClick={handleNext}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Template */}
          {step === 5 && (
            <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Escolha seu template</h2>
                <p className="text-muted-foreground">Começaremos com métricas pré-configuradas para você</p>
              </div>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setTemplate("launch")}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg",
                    template === "launch"
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/30 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", template === "launch" ? "bg-primary/10" : "bg-muted")}>
                      <Rocket className={cn("w-8 h-8", template === "launch" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">Lançamento Clássico</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Ideal para lançamentos com cart open/close. Métricas de leads, vendas, CPL, ROI e ticket médio.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Leads</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Faturamento</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">CPL</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">ROI</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Ticket Médio</span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplate("recurring")}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg",
                    template === "recurring"
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/30 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", template === "recurring" ? "bg-primary/10" : "bg-muted")}>
                      <Repeat className={cn("w-8 h-8", template === "recurring" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">Perpétuo</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Para funis sempre abertos. Foco em CAC, LTV, taxa de conversão mensal e crescimento.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">CAC</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">LTV</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">MRR</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Churn</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Conversão</span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplate("subscription")}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg",
                    template === "subscription"
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/30 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", template === "subscription" ? "bg-primary/10" : "bg-muted")}>
                      <Zap className={cn("w-8 h-8", template === "subscription" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">Assinatura/Comunidade</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Para membros recorrentes. Acompanha inscrições, renovações, retenção e receita recorrente.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Membros Ativos</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Novas Inscrições</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">Renovações</span>
                        <span className="text-xs bg-muted px-3 py-1 rounded-full">ARR</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                  onClick={handleNext}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Goals */}
          {step === 6 && (
            <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Defina suas metas</h2>
                <p className="text-muted-foreground">Opcional - você poderá ajustar depois</p>
              </div>
              
              <div className="space-y-6 bg-card p-8 rounded-2xl border-2 border-border shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="leadsTarget" className="text-base font-semibold">
                      Meta de Leads
                    </Label>
                    <Input
                      id="leadsTarget"
                      type="number"
                      placeholder="Ex: 1000"
                      value={leadsTarget}
                      onChange={(e) => setLeadsTarget(e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="revenueTarget" className="text-base font-semibold">
                      Meta de Receita (R$)
                    </Label>
                    <Input
                      id="revenueTarget"
                      type="number"
                      placeholder="Ex: 50000"
                      value={revenueTarget}
                      onChange={(e) => setRevenueTarget(e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxCPL" className="text-base font-semibold">
                      CPL Máximo (R$)
                    </Label>
                    <Input
                      id="maxCPL"
                      type="number"
                      placeholder="Ex: 15"
                      value={maxCPL}
                      onChange={(e) => setMaxCPL(e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minROI" className="text-base font-semibold">
                      ROI Mínimo (%)
                    </Label>
                    <Input
                      id="minROI"
                      type="number"
                      placeholder="Ex: 200"
                      value={minROI}
                      onChange={(e) => setMinROI(e.target.value)}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                  onClick={handleNext}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 7: Finish */}
          {step === 7 && (
            <div className="text-center space-y-8 max-w-2xl animate-in fade-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold">Tudo pronto!</h1>
                <p className="text-xl text-muted-foreground">
                  Seu projeto <span className="font-semibold text-foreground">{projectName}</span> está configurado e pronto para decolar.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <h3 className="font-semibold mb-4">O que criamos para você:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Projeto configurado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Template {template === "launch" ? "Lançamento" : template === "recurring" ? "Perpétuo" : "Assinatura"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Métricas pré-configuradas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>Metas definidas</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-lg px-12 py-6 h-auto"
                onClick={handleFinish}
              >
                Criar Projeto e Ir para o Dashboard
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground">
                Você poderá conectar as células do Google Sheets no próximo passo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
