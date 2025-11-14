import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, RefreshCw, Settings } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import AddMetricDialog from "@/components/dashboard/AddMetricDialog";
import MetricConfigDialog from "@/components/dashboard/MetricConfigDialog";

// Mock data
const mockMetrics = [
  {
    id: "1",
    name: "Leads Captados",
    value: 1247,
    valueType: "number" as const,
    isOverridden: false,
  },
  {
    id: "2",
    name: "Faturamento Total",
    value: 47580.50,
    valueType: "currency" as const,
    isOverridden: false,
  },
  {
    id: "3",
    name: "Taxa de Conversão",
    value: 3.8,
    valueType: "percent" as const,
    isOverridden: true,
  },
  {
    id: "4",
    name: "CPL (Custo por Lead)",
    value: 12.50,
    valueType: "currency" as const,
    isOverridden: false,
  },
];

const DashboardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(mockMetrics);
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<typeof mockMetrics[0] | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implement refresh logic
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleMetricClick = (metric: typeof mockMetrics[0]) => {
    setSelectedMetric(metric);
    setIsConfigDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboards")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold">Lançamento Novembro 2024</h1>
                <p className="text-sm text-muted-foreground">
                  {metrics.length} métricas configuradas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              <Button
                onClick={() => setIsAddMetricOpen(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Métrica
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {metrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nenhuma métrica configurada</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Adicione sua primeira métrica para começar a visualizar seus dados
            </p>
            <Button
              onClick={() => setIsAddMetricOpen(true)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar métrica
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onClick={() => handleMetricClick(metric)}
              />
            ))}
          </div>
        )}
      </main>

      <AddMetricDialog
        open={isAddMetricOpen}
        onOpenChange={setIsAddMetricOpen}
        availableSections={[
          { id: "overview", name: "Visão Geral" },
          { id: "funnel", name: "Funil" },
          { id: "traffic", name: "Tráfego" },
          { id: "revenue", name: "Receita" },
          { id: "leads", name: "Leads & LTV" },
          { id: "alerts", name: "Alertas & Metas" },
        ]}
        onCreateMetric={(metric) => {
          setMetrics([...metrics, metric]);
        }}
      />

      <MetricConfigDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        metric={selectedMetric}
      />
    </div>
  );
};

export default DashboardEditor;
