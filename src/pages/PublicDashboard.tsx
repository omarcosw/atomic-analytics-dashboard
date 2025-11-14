import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, DollarSign, Target, Bell, FileText } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import HeroMetricCard from "@/components/dashboard/HeroMetricCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data (in production, fetch from API using slug)
const mockMetrics = [
  { id: "2", name: "Faturamento Total", value: 47580.50, valueType: "currency" as const, isOverridden: false, trend: 12.6, goal: 120000, sparklineData: [2450, 3200, 2800, 4100, 3850, 5200, 4900] },
  { id: "1", name: "Leads Captados", value: 1247, valueType: "number" as const, isOverridden: false, trend: 8.2, sparklineData: [42, 58, 51, 73, 68, 89, 82] },
  { id: "3", name: "Taxa de Conversão", value: 3.8, valueType: "percent" as const, isOverridden: true, trend: -2.1 },
  { id: "4", name: "CPL (Custo por Lead)", value: 12.50, valueType: "currency" as const, isOverridden: false, trend: -5.4 },
  { id: "5", name: "Ticket Médio", value: 247.00, valueType: "currency" as const, isOverridden: false, trend: 3.2 },
  { id: "6", name: "ROI", value: 285, valueType: "percent" as const, isOverridden: false, trend: 18.5 },
];

const revenueData = [
  { date: "01/12", value: 2450 },
  { date: "02/12", value: 3200 },
  { date: "03/12", value: 2800 },
  { date: "04/12", value: 4100 },
  { date: "05/12", value: 3850 },
  { date: "06/12", value: 5200 },
  { date: "07/12", value: 4900 },
];

const leadsData = [
  { date: "01/12", value: 42 },
  { date: "02/12", value: 58 },
  { date: "03/12", value: 51 },
  { date: "04/12", value: 73 },
  { date: "05/12", value: 68 },
  { date: "06/12", value: 89 },
  { date: "07/12", value: 82 },
];

// Mock function to verify if dashboard is active
const getDashboardBySlug = (slug: string) => {
  if (slug === "dash-1-a3f9d2") {
    return { id: "1", name: "Lançamento Novembro 2024", isActive: true };
  }
  return null;
};

const PublicDashboard = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isTVMode = searchParams.get('tv') === 'true';
  
  const dashboard = getDashboardBySlug(slug || "");
  
  // If dashboard doesn't exist or is inactive
  if (!dashboard || !dashboard.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3F6FF] to-[#F9FBFF]">
        <Card className="max-w-md w-full mx-4 p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-warning" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Dashboard indisponível</h1>
          <p className="text-muted-foreground">
            Este dashboard está inativo no momento ou não existe.
          </p>
        </Card>
      </div>
    );
  }
  
  // Mock whitelabel config
  const [whitelabel] = useState({
    enabled: false,
    logoUrl: "",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    brandName: "Minha Agência",
  });

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("pt-BR").format(value);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3F6FF] to-[#F9FBFF]"
      style={whitelabel.enabled && whitelabel.primaryColor && whitelabel.secondaryColor ? {
        background: `linear-gradient(135deg, ${whitelabel.primaryColor}08, ${whitelabel.secondaryColor}08)`
      } : undefined}
    >
      {/* Header - Hide in TV Mode */}
      {!isTVMode && (
        <header className="border-b border-border bg-white/80 backdrop-blur-md shadow-sm">
          <div className="mx-auto px-8 py-6 max-w-[1600px]">
            <div className="flex items-center gap-4">
              {whitelabel.enabled && whitelabel.logoUrl && (
                <img src={whitelabel.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
              )}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{dashboard.name}</h1>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Visualização Pública
                </Badge>
              </div>
              <div className="hidden">
                <h1 className="text-2xl font-bold">Lançamento Novembro 2024</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Dashboard público - Somente visualização
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 mx-auto w-full max-w-[1600px] px-8 ${isTVMode ? 'py-6' : 'py-8'}`}>
        <Tabs defaultValue="overview" className="space-y-8">
          {/* Hide TabsList in TV Mode */}
          {!isTVMode && (
            <TabsList className="inline-flex w-auto p-1 rounded-xl" style={{ backgroundColor: '#EEF2FF' }}>
              <TabsTrigger value="overview" className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="funnel" className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Funil</span>
              </TabsTrigger>
              <TabsTrigger value="traffic" className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Tráfego</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Receita</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Alertas & Metas</span>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="overview" className="space-y-10">
            {/* Metrics Cards */}
            <div>
              {!isTVMode && (
                <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
                  Métricas Principais
                </h2>
              )}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isTVMode ? 'mb-10' : ''}`}>
                {mockMetrics.map((metric) => (
                  <Card 
                    key={metric.id}
                    className="group border-2 border-border/50 hover:border-primary/40 transition-all hover:shadow-[var(--shadow-card-premium)] hover:-translate-y-0.5 rounded-2xl overflow-hidden bg-card/90 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground leading-tight uppercase tracking-wide">
                          {metric.name}
                        </CardTitle>
                        {metric.isOverridden && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-[hsl(var(--metric-adjusted))] text-[hsl(var(--metric-adjusted-border))] border-[hsl(var(--metric-adjusted-border))]/30 font-semibold shrink-0"
                          >
                            Ajustado
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-5">
                      <div className={`${isTVMode ? 'text-5xl' : 'text-4xl'} font-bold bg-gradient-primary bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform duration-200 leading-tight`}>
                        {formatValue(metric.value, metric.valueType)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-10">
              {!isTVMode && (
                <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Análise Visual
                </h2>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="border-2 border-border/50 rounded-2xl p-10 bg-card/80 backdrop-blur-sm shadow-[var(--shadow-chart)]">
                  <h3 className="text-xl font-bold mb-8 text-foreground">Faturamento Diário</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.2} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={13} fontWeight={500} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={13} fontWeight={500} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-lg)',
                          padding: '12px',
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={4}
                        name="Faturamento"
                        dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 3, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Leads Chart */}
                <div className="border-2 border-border/50 rounded-2xl p-10 bg-card/80 backdrop-blur-sm shadow-[var(--shadow-chart)]">
                  <h3 className="text-xl font-bold mb-8 text-foreground">Leads Captados por Dia</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={leadsData}>
                      <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.2} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={13} fontWeight={500} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={13} fontWeight={500} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-lg)',
                          padding: '12px',
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={4}
                        name="Leads"
                        dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 3, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-4">
            <p className="text-muted-foreground text-center py-12">
              Conteúdo da aba Funil
            </p>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <p className="text-muted-foreground text-center py-12">
              Conteúdo da aba Tráfego
            </p>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <p className="text-muted-foreground text-center py-12">
              Conteúdo da aba Receita
            </p>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <p className="text-muted-foreground text-center py-12">
              Conteúdo da aba Alertas & Metas
            </p>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer - Hide in TV Mode */}
      {!isTVMode && (
        <footer className="border-t border-border bg-card/50 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            {whitelabel.enabled && whitelabel.brandName ? (
              <div className="flex items-center justify-center gap-2">
                {whitelabel.logoUrl && (
                  <img src={whitelabel.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                )}
                <span>Powered by {whitelabel.brandName}</span>
              </div>
            ) : (
              "Powered by Atomic+ Analytics"
            )}
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicDashboard;
