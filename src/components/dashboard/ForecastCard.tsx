import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Activity } from "lucide-react";

interface ForecastCardProps {
  current: {
    leads: number;
    revenue: number;
    roi: number;
    conversionRate: number;
  };
  goals: {
    leadsTarget: number;
    revenueTarget: number;
    minROI: number;
  };
  daysElapsed: number;
  totalDays: number;
}

const ForecastCard = ({ current, goals, daysElapsed, totalDays }: ForecastCardProps) => {
  // Calculate daily averages
  const avgLeadsPerDay = current.leads / daysElapsed;
  const avgRevenuePerDay = current.revenue / daysElapsed;
  
  // Projected totals
  const projectedLeads = Math.round(avgLeadsPerDay * totalDays);
  const projectedRevenue = avgRevenuePerDay * totalDays;
  const projectedROI = current.roi; // ROI tends to stabilize
  
  // Calculate if on track
  const leadsOnTrack = projectedLeads >= goals.leadsTarget;
  const revenueOnTrack = projectedRevenue >= goals.revenueTarget;
  const roiOnTrack = projectedROI >= goals.minROI;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Projeções e Forecast
        </h2>
        <p className="text-muted-foreground text-sm">
          Baseado no ritmo dos últimos {daysElapsed} dias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leads Forecast */}
        <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Leads Projetados
              </CardTitle>
              {leadsOnTrack ? (
                <TrendingUp className="w-5 h-5 text-accent" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <CardDescription className="text-xs">
              Meta: {goals.leadsTarget.toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {projectedLeads.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={leadsOnTrack ? "default" : "destructive"} className="text-xs">
                {leadsOnTrack ? "No ritmo" : "Abaixo do ritmo"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {((projectedLeads / goals.leadsTarget) * 100).toFixed(0)}% da meta
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecast */}
        <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Receita Projetada
              </CardTitle>
              {revenueOnTrack ? (
                <TrendingUp className="w-5 h-5 text-accent" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <CardDescription className="text-xs">
              Meta: R$ {goals.revenueTarget.toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              R$ {projectedRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={revenueOnTrack ? "default" : "destructive"} className="text-xs">
                {revenueOnTrack ? "No ritmo" : "Abaixo do ritmo"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {((projectedRevenue / goals.revenueTarget) * 100).toFixed(0)}% da meta
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ROI Forecast */}
        <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                ROI Projetado
              </CardTitle>
              {roiOnTrack ? (
                <TrendingUp className="w-5 h-5 text-accent" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
            <CardDescription className="text-xs">
              Meta mínima: {goals.minROI.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {projectedROI.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={roiOnTrack ? "default" : "destructive"} className="text-xs">
                {roiOnTrack ? "Acima da meta" : "Abaixo da meta"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Message */}
      <Card className="border-2 border-primary/20 bg-primary/5 rounded-2xl">
        <CardContent className="py-4">
          <p className="text-sm leading-relaxed">
            <strong className="font-semibold">Projeção:</strong>{" "}
            Pelo ritmo atual, você deve fechar com aproximadamente{" "}
            <strong className="text-primary font-bold">
              {projectedLeads.toLocaleString('pt-BR')} leads
            </strong>{" "}
            e faturamento de{" "}
            <strong className="text-primary font-bold">
              R$ {projectedRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </strong>
            , com ROI de{" "}
            <strong className="text-primary font-bold">
              {projectedROI.toFixed(1)}%
            </strong>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastCard;
