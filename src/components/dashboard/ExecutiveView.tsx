import { memo, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target, Users, BarChart } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExecutiveViewProps {
  metrics: Array<{
    id: string;
    name: string;
    value: number;
    valueType: "number" | "currency" | "percent";
  }>;
  revenueData: Array<{ date: string; value: number }>;
  leadsData: Array<{ date: string; value: number }>;
}

export const ExecutiveView = memo(function ExecutiveView({ metrics, revenueData, leadsData }: ExecutiveViewProps) {
  // Memoizar formatação de valores
  const formatValue = useMemo(() => {
    return (value: number, type: "number" | "currency" | "percent") => {
      if (type === "currency") {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      }
      if (type === "percent") {
        return `${value.toFixed(1)}%`;
      }
      return new Intl.NumberFormat("pt-BR").format(value);
    };
  }, []);

  // Métricas essenciais para modo executivo
  const essentialMetrics = [
    { key: "Faturamento Total", icon: DollarSign, gradient: "from-green-500 to-emerald-600" },
    { key: "Leads Captados", icon: Users, gradient: "from-blue-500 to-cyan-600" },
    { key: "ROI", icon: TrendingUp, gradient: "from-purple-500 to-pink-600" },
    { key: "Taxa de Conversão", icon: Target, gradient: "from-orange-500 to-red-600" },
  ];

  const getMetricByName = (name: string) => {
    return metrics.find((m) => m.name === name);
  };

  const calculateTrend = useCallback((data: Array<{ value: number }>) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, item) => sum + item.value, 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + item.value, 0) / 3;
    return ((recent - previous) / previous) * 100;
  }, []);

  // Memoizar cálculo de tendências
  const revenueTrend = useMemo(() => calculateTrend(revenueData), [revenueData, calculateTrend]);
  const leadsTrend = useMemo(() => calculateTrend(leadsData), [leadsData, calculateTrend]);

  return (
    <div className="space-y-8 bg-gradient-to-br from-background via-background to-muted/10 p-8 rounded-2xl">
      {/* Header Executivo */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Visão Executiva
        </h1>
        <p className="text-muted-foreground text-lg">
          Resumo estratégico de desempenho
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {essentialMetrics.map(({ key, icon: Icon, gradient }) => {
          const metric = getMetricByName(key);
          if (!metric) return null;

          return (
            <Card
              key={key}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {formatValue(metric.value, metric.valueType)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos Executivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolução de Receita */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Evolução da Receita</h3>
                <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
              </div>
              <div className="flex items-center gap-2">
                {revenueTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className={`font-bold ${revenueTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {revenueTrend >= 0 ? "+" : ""}{revenueTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Receita"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance de Leads */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Captação de Leads</h3>
                <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
              </div>
              <div className="flex items-center gap-2">
                {leadsTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className={`font-bold ${leadsTrend >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {leadsTrend >= 0 ? "+" : ""}{leadsTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [value, "Leads"]}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Estratégico */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Resumo Estratégico</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status Geral</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="font-semibold text-green-600">Desempenho Positivo</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tendência</p>
              <p className="font-semibold">
                {revenueTrend >= 0 && leadsTrend >= 0
                  ? "Crescimento Consistente"
                  : "Atenção Necessária"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Próximos Passos</p>
              <p className="font-semibold">Manter Estratégia Atual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
