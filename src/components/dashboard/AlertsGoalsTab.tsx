import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Target, TrendingDown, TrendingUp } from "lucide-react";

interface AlertsGoalsTabProps {
  goals: {
    leadsTarget: number;
    revenueTarget: number;
    maxCPL: number;
    minROI: number;
  };
  current: {
    leads: number;
    revenue: number;
    cpl: number;
    roi: number;
  };
}

const AlertsGoalsTab = ({ goals, current }: AlertsGoalsTabProps) => {
  // Calculate progress percentages
  const leadsProgress = goals.leadsTarget > 0 ? (current.leads / goals.leadsTarget) * 100 : 0;
  const revenueProgress = goals.revenueTarget > 0 ? (current.revenue / goals.revenueTarget) * 100 : 0;

  // Generate alerts
  const alerts = [];
  
  if (goals.maxCPL > 0 && current.cpl > goals.maxCPL) {
    alerts.push({
      type: "warning",
      title: "CPL acima do limite",
      description: `O CPL atual (R$ ${current.cpl.toFixed(2)}) está acima do limite de R$ ${goals.maxCPL.toFixed(2)}`,
    });
  }

  if (goals.minROI > 0 && current.roi < goals.minROI) {
    alerts.push({
      type: "warning",
      title: "ROI abaixo da meta",
      description: `O ROI atual (${current.roi.toFixed(1)}%) está abaixo da meta de ${goals.minROI.toFixed(1)}%`,
    });
  }

  if (revenueProgress < 50 && revenueProgress > 0) {
    alerts.push({
      type: "info",
      title: "Receita abaixo do ritmo esperado",
      description: `Você está em ${revenueProgress.toFixed(1)}% da meta de receita. Considere aumentar investimento.`,
    });
  }

  if (leadsProgress >= 100) {
    alerts.push({
      type: "success",
      title: "Meta de leads atingida! 🎉",
      description: `Você já alcançou ${current.leads} leads, superando a meta de ${goals.leadsTarget}.`,
    });
  }

  if (revenueProgress >= 100) {
    alerts.push({
      type: "success",
      title: "Meta de receita atingida! 🎉",
      description: `Você já faturou R$ ${current.revenue.toLocaleString('pt-BR')}, superando a meta de R$ ${goals.revenueTarget.toLocaleString('pt-BR')}.`,
    });
  }

  return (
    <div className="space-y-8">
      {/* Progress Cards */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
          Progresso das Metas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leads Progress */}
          <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Leads
                </CardTitle>
                <Badge variant={leadsProgress >= 100 ? "default" : "secondary"} className="font-semibold">
                  {leadsProgress.toFixed(1)}%
                </Badge>
              </div>
              <CardDescription>
                {current.leads.toLocaleString('pt-BR')} de {goals.leadsTarget.toLocaleString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min(leadsProgress, 100)} className="h-3" />
              <div className="flex items-center gap-2 mt-3">
                {leadsProgress >= 100 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">Meta alcançada!</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Faltam {(goals.leadsTarget - current.leads).toLocaleString('pt-BR')} leads
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Progress */}
          <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Receita
                </CardTitle>
                <Badge variant={revenueProgress >= 100 ? "default" : "secondary"} className="font-semibold">
                  {revenueProgress.toFixed(1)}%
                </Badge>
              </div>
              <CardDescription>
                R$ {current.revenue.toLocaleString('pt-BR')} de R$ {goals.revenueTarget.toLocaleString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min(revenueProgress, 100)} className="h-3" />
              <div className="flex items-center gap-2 mt-3">
                {revenueProgress >= 100 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">Meta alcançada!</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Faltam R$ {(goals.revenueTarget - current.revenue).toLocaleString('pt-BR')}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CPL Status */}
          <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                CPL (Custo por Lead)
              </CardTitle>
              <CardDescription>
                Limite máximo: R$ {goals.maxCPL.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    R$ {current.cpl.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {current.cpl <= goals.maxCPL ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent font-medium">Dentro do limite</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">Acima do limite</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Diferença</div>
                  <div className={cn(
                    "text-xl font-bold flex items-center gap-1",
                    current.cpl <= goals.maxCPL ? "text-accent" : "text-destructive"
                  )}>
                    {current.cpl <= goals.maxCPL ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                    R$ {Math.abs(current.cpl - goals.maxCPL).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Status */}
          <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                ROI
              </CardTitle>
              <CardDescription>
                Meta mínima: {goals.minROI.toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {current.roi.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {current.roi >= goals.minROI ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        <span className="text-sm text-accent font-medium">Acima da meta</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">Abaixo da meta</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Diferença</div>
                  <div className={cn(
                    "text-xl font-bold flex items-center gap-1",
                    current.roi >= goals.minROI ? "text-accent" : "text-destructive"
                  )}>
                    {current.roi >= goals.minROI ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(current.roi - goals.minROI).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
          Alertas e Notificações
        </h2>

        {alerts.length === 0 ? (
          <Card className="border-2 border-border/50 rounded-2xl">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tudo certo por aqui!</h3>
              <p className="text-muted-foreground">
                Não há alertas no momento. Suas métricas estão dentro dos parâmetros esperados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                variant={alert.type === "warning" ? "destructive" : "default"}
                className={cn(
                  "border-2 rounded-xl",
                  alert.type === "success" && "border-accent/50 bg-accent/5",
                  alert.type === "info" && "border-primary/50 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  {alert.type === "warning" && <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />}
                  {alert.type === "success" && <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />}
                  {alert.type === "info" && <TrendingUp className="w-5 h-5 text-primary mt-0.5" />}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{alert.title}</h4>
                    <AlertDescription>{alert.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default AlertsGoalsTab;
