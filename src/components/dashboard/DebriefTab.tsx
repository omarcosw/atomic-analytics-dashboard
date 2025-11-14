import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Award,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  DollarSign,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface DebriefTabProps {
  project: {
    name: string;
    startDate?: string;
    endDate?: string;
    type: string;
  };
  metrics: {
    totalLeads: number;
    totalRevenue: number;
    avgTicket: number;
    roi: number;
    cpl: number;
    conversionRate: number;
    bestDay: {
      date: string;
      revenue: number;
    };
    topSource: {
      name: string;
      leads: number;
      revenue: number;
    };
  };
  goals: {
    leadsTarget: number;
    revenueTarget: number;
    maxCPL: number;
    minROI: number;
  };
}

const DebriefTab = ({ project, metrics, goals }: DebriefTabProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const leadsAchieved = goals.leadsTarget > 0 ? (metrics.totalLeads / goals.leadsTarget) * 100 : 0;
  const revenueAchieved = goals.revenueTarget > 0 ? (metrics.totalRevenue / goals.revenueTarget) * 100 : 0;
  const cplOk = goals.maxCPL > 0 ? metrics.cpl <= goals.maxCPL : true;
  const roiOk = goals.minROI > 0 ? metrics.roi >= goals.minROI : true;

  const handleExportPDF = async () => {
    setIsExporting(true);
    toast({
      title: "Gerando PDF",
      description: "Seu debrief está sendo gerado...",
    });

    try {
      // Importação dinâmica do jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Cores
      const primaryColor = [20, 165, 186]; // #14A5BA
      const darkColor = [38, 38, 38];
      const mutedColor = [128, 128, 128];
      const accentColor = [35, 181, 114]; // Green

      let yPos = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("ATOMIC+ ANALYTICS", 20, yPos);

      yPos += 5;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);

      yPos += 15;

      // Title
      doc.setFontSize(18);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("DEBRIEF DO PROJETO", 20, yPos);

      yPos += 10;

      // Project name
      doc.setFontSize(14);
      doc.text(project.name, 20, yPos);

      yPos += 8;

      // Project info
      doc.setFontSize(9);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.setFont("helvetica", "normal");
      const startDate = project.startDate ? format(new Date(project.startDate), "dd/MM/yyyy", { locale: ptBR }) : "N/A";
      const endDate = project.endDate ? format(new Date(project.endDate), "dd/MM/yyyy", { locale: ptBR }) : "N/A";
      doc.text(`Tipo: ${project.type} • Período: ${startDate} até ${endDate}`, 20, yPos);

      yPos += 15;

      // Section: Resultados Principais
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("RESULTADOS PRINCIPAIS", 20, yPos);

      yPos += 10;

      // Metrics
      const metricsData = [
        { label: "Total de Leads", value: metrics.totalLeads.toLocaleString('pt-BR'), achieved: leadsAchieved >= 100 },
        { label: "Faturamento Total", value: `R$ ${metrics.totalRevenue.toLocaleString('pt-BR')}`, achieved: revenueAchieved >= 100 },
        { label: "Ticket Médio", value: `R$ ${metrics.avgTicket.toFixed(2)}`, achieved: true },
        { label: "ROI", value: `${metrics.roi.toFixed(1)}%`, achieved: roiOk },
        { label: "CPL", value: `R$ ${metrics.cpl.toFixed(2)}`, achieved: cplOk },
        { label: "Taxa de Conversão", value: `${metrics.conversionRate.toFixed(1)}%`, achieved: true },
      ];

      doc.setFont("helvetica", "normal");
      metricsData.forEach((metric, index) => {
        const xPos = index % 2 === 0 ? 20 : 110;
        if (index % 2 === 0 && index > 0) yPos += 20;

        // Label
        doc.setFontSize(8);
        doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
        doc.text(metric.label, xPos, yPos);

        // Value
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(metric.value, xPos, yPos + 5);

        // Status
        if (metric.achieved !== undefined) {
          doc.setFontSize(7);
          const statusColor = metric.achieved ? accentColor : [230, 76, 76];
          doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
          doc.setFont("helvetica", "normal");
          doc.text(metric.achieved ? "✓ Meta atingida" : "✗ Abaixo da meta", xPos, yPos + 10);
        }

        doc.setFont("helvetica", "normal");
      });

      yPos += 30;

      // Section: Performance Analysis
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("ANÁLISE DE PERFORMANCE", 20, yPos);

      yPos += 10;

      // Best Day
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("Melhor Dia de Faturamento", 20, yPos);

      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text(format(new Date(metrics.bestDay.date), "dd/MM/yyyy", { locale: ptBR }), 20, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`R$ ${metrics.bestDay.revenue.toLocaleString('pt-BR')}`, 55, yPos);

      yPos += 10;

      // Top Source
      doc.setFontSize(9);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text("Melhor Fonte de Tráfego", 20, yPos);

      yPos += 5;
      doc.setFontSize(8);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.setFont("helvetica", "normal");
      doc.text(metrics.topSource.name, 20, yPos);
      
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`${metrics.topSource.leads} leads • R$ ${metrics.topSource.revenue.toLocaleString('pt-BR')}`, 55, yPos);

      yPos += 15;

      // Section: Comparison with Goals
      doc.setFontSize(12);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("COMPARAÇÃO COM METAS", 20, yPos);

      yPos += 10;

      const goalsData = [
        {
          label: "Meta de Leads",
          current: metrics.totalLeads.toLocaleString('pt-BR'),
          target: goals.leadsTarget.toLocaleString('pt-BR'),
          achieved: metrics.totalLeads >= goals.leadsTarget,
        },
        {
          label: "Meta de Receita",
          current: `R$ ${metrics.totalRevenue.toLocaleString('pt-BR')}`,
          target: `R$ ${goals.revenueTarget.toLocaleString('pt-BR')}`,
          achieved: metrics.totalRevenue >= goals.revenueTarget,
        },
        {
          label: "CPL Máximo",
          current: `R$ ${metrics.cpl.toFixed(2)}`,
          target: `R$ ${goals.maxCPL.toFixed(2)}`,
          achieved: cplOk,
        },
        {
          label: "ROI Mínimo",
          current: `${metrics.roi.toFixed(1)}%`,
          target: `${goals.minROI.toFixed(1)}%`,
          achieved: roiOk,
        },
      ];

      doc.setFont("helvetica", "normal");
      goalsData.forEach((goal) => {
        const statusIcon = goal.achieved ? "✓" : "✗";
        const statusColor = goal.achieved ? accentColor : [230, 76, 76];

        doc.setFontSize(10);
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(statusIcon, 20, yPos);

        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.text(goal.label, 27, yPos);

        doc.setFontSize(8);
        doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`${goal.current} / ${goal.target}`, 27, yPos + 4);

        yPos += 12;
      });

      // Footer
      yPos = 280;
      doc.setDrawColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);

      doc.setFontSize(7);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, yPos + 5);
      doc.text("Powered by Atomic+ Analytics", 140, yPos + 5);

      // Save PDF
      doc.save(`debrief-${project.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);

      toast({
        title: "PDF gerado!",
        description: "O download começará automaticamente.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Debrief do Projeto
          </h2>
          <p className="text-muted-foreground">
            Resumo completo do desempenho de "{project.name}"
          </p>
        </div>
        <Button 
          onClick={handleExportPDF} 
          variant="outline" 
          className="gap-2"
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Exportar PDF
            </>
          )}
        </Button>
      </div>

      {/* Project Info */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Informações do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tipo</div>
              <div className="font-semibold capitalize">{project.type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Início</div>
              <div className="font-semibold">
                {project.startDate 
                  ? format(new Date(project.startDate), "dd/MM/yyyy", { locale: ptBR })
                  : "Não definido"
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Fim</div>
              <div className="font-semibold">
                {project.endDate 
                  ? format(new Date(project.endDate), "dd/MM/yyyy", { locale: ptBR })
                  : "Não definido"
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Duração</div>
              <div className="font-semibold">
                {project.startDate && project.endDate
                  ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias`
                  : "N/A"
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div>
        <h3 className="text-xl font-bold mb-6">Resultados Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-border/50 rounded-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {metrics.totalLeads.toLocaleString('pt-BR')}
              </div>
              {goals.leadsTarget > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {leadsAchieved >= 100 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-accent font-medium">
                        {leadsAchieved.toFixed(0)}% da meta
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive font-medium">
                        {leadsAchieved.toFixed(0)}% da meta
                      </span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 rounded-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                R$ {metrics.totalRevenue.toLocaleString('pt-BR')}
              </div>
              {goals.revenueTarget > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {revenueAchieved >= 100 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-accent font-medium">
                        {revenueAchieved.toFixed(0)}% da meta
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive font-medium">
                        {revenueAchieved.toFixed(0)}% da meta
                      </span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 rounded-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                R$ {metrics.avgTicket.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50 rounded-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {metrics.roi.toFixed(1)}%
              </div>
              {goals.minROI > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {roiOk ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-accent font-medium">Acima da meta</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive font-medium">Abaixo da meta</span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Day */}
        <Card className="border-2 border-border/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Melhor Dia de Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Data</div>
                <div className="text-2xl font-bold">
                  {format(new Date(metrics.bestDay.date), "dd 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Faturamento</div>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  R$ {metrics.bestDay.revenue.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Source */}
        <Card className="border-2 border-border/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Melhor Fonte de Tráfego
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Origem</div>
                <div className="text-2xl font-bold">{metrics.topSource.name}</div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Leads</div>
                  <div className="text-xl font-bold">
                    {metrics.topSource.leads.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Receita</div>
                  <div className="text-xl font-bold">
                    R$ {metrics.topSource.revenue.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Summary */}
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Comparação com Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                {leadsAchieved >= 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-semibold">Meta de Leads</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.totalLeads.toLocaleString('pt-BR')} / {goals.leadsTarget.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              <Badge variant={leadsAchieved >= 100 ? "default" : "destructive"}>
                {leadsAchieved.toFixed(0)}%
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                {revenueAchieved >= 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-semibold">Meta de Receita</div>
                  <div className="text-sm text-muted-foreground">
                    R$ {metrics.totalRevenue.toLocaleString('pt-BR')} / R$ {goals.revenueTarget.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              <Badge variant={revenueAchieved >= 100 ? "default" : "destructive"}>
                {revenueAchieved.toFixed(0)}%
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                {cplOk ? (
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-semibold">CPL Máximo</div>
                  <div className="text-sm text-muted-foreground">
                    R$ {metrics.cpl.toFixed(2)} / R$ {goals.maxCPL.toFixed(2)}
                  </div>
                </div>
              </div>
              <Badge variant={cplOk ? "default" : "destructive"}>
                {cplOk ? "Dentro do limite" : "Acima do limite"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                {roiOk ? (
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <div className="font-semibold">ROI Mínimo</div>
                  <div className="text-sm text-muted-foreground">
                    {metrics.roi.toFixed(1)}% / {goals.minROI.toFixed(1)}%
                  </div>
                </div>
              </div>
              <Badge variant={roiOk ? "default" : "destructive"}>
                {roiOk ? "Acima da meta" : "Abaixo da meta"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebriefTab;
