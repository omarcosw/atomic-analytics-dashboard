import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CalendarIcon, Rocket, Repeat, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getAllTemplates, type DashboardTemplate } from "@/lib/dashboardTemplates";

interface ProjectWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectWizard = ({ open, onOpenChange }: ProjectWizardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Form data
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<"launch" | "recurring" | "other">("launch");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leadsTarget, setLeadsTarget] = useState("");
  const [revenueTarget, setRevenueTarget] = useState("");
  const [maxCPL, setMaxCPL] = useState("");
  const [minROI, setMinROI] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);

  const templates = getAllTemplates();

  const handleNext = () => {
    if (step === 1 && !projectName) {
      toast({
        title: "Atenção",
        description: "Por favor, informe o nome do projeto.",
        variant: "destructive",
      });
      return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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
      template: selectedTemplate?.id || 'lancamento-classico',
      templateData: selectedTemplate,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // TODO: Save to backend/state management
    console.log("Creating project:", newProject);

    toast({
      title: "Projeto criado!",
      description: `O projeto "${projectName}" foi criado com sucesso.`,
    });

    onOpenChange(false);
    navigate(`/project/${newProject.id}`);
    
    // Reset form
    setStep(1);
    setProjectName("");
    setProjectType("launch");
    setStartDate(undefined);
    setEndDate(undefined);
    setLeadsTarget("");
    setRevenueTarget("");
    setMaxCPL("");
    setMinROI("");
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Novo Projeto
          </DialogTitle>
          <DialogDescription className="text-base">
            Passo {step} de 4: {
              step === 1 ? "Informações Básicas" :
              step === 2 ? "Datas e Cronograma" :
              step === 3 ? "Metas do Projeto" :
              "Template de Dashboard"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="projectName" className="text-base font-semibold">
                  Nome do Projeto *
                </Label>
                <Input
                  id="projectName"
                  placeholder="Ex: Lançamento Novembro 2024"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Tipo de Projeto</Label>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => setProjectType("launch")}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                      projectType === "launch"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Rocket className={cn("w-8 h-8 mb-3", projectType === "launch" ? "text-primary" : "text-muted-foreground")} />
                    <h4 className="font-semibold mb-1">Lançamento</h4>
                    <p className="text-sm text-muted-foreground">Campanha pontual com início e fim</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProjectType("recurring")}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                      projectType === "recurring"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Repeat className={cn("w-8 h-8 mb-3", projectType === "recurring" ? "text-primary" : "text-muted-foreground")} />
                    <h4 className="font-semibold mb-1">Perpétuo</h4>
                    <p className="text-sm text-muted-foreground">Funil contínuo sempre ativo</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProjectType("other")}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                      projectType === "other"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Zap className={cn("w-8 h-8 mb-3", projectType === "other" ? "text-primary" : "text-muted-foreground")} />
                    <h4 className="font-semibold mb-1">Outro</h4>
                    <p className="text-sm text-muted-foreground">Modelo personalizado</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2 h-11",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione a data"}
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
                          "w-full justify-start text-left font-normal mt-2 h-11",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione a data"}
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

              <p className="text-sm text-muted-foreground">
                {projectType === "recurring" 
                  ? "Para projetos perpétuos, as datas são opcionais e servem apenas como referência."
                  : "Defina o período do seu lançamento para melhor acompanhamento das métricas."
                }
              </p>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Defina as metas principais do projeto. Você poderá ajustá-las depois.
              </p>
              
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
                    className="mt-2 h-11"
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
                    className="mt-2 h-11"
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
                    className="mt-2 h-11"
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
                    className="mt-2 h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Template */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Escolha um template de dashboard</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Selecione um template com métricas e seções pré-configuradas
                </p>
                
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        "p-6 rounded-xl border-2 transition-all text-left hover:shadow-md",
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>{template.metrics.length} métricas</span>
                            <span>•</span>
                            <span>{template.sections.length} seções</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {template.metrics.slice(0, 5).map((metric) => (
                              <span key={metric.slug} className="text-xs bg-muted px-2 py-1 rounded">
                                {metric.name}
                              </span>
                            ))}
                            {template.metrics.length > 5 && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                +{template.metrics.length - 5} mais
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-gradient-primary gap-2">
              Criar Projeto
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectWizard;
