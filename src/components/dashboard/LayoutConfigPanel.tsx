/**
 * COMPONENTE: Painel de Configuração de Layout
 * 
 * Permite configurar o layout do dashboard:
 * - Mostrar/ocultar métricas
 * - Reordenar cards
 * - Mudar tipo de card (hero/card)
 * - Configurar gráficos
 * - Adicionar métricas custom
 * 
 * ONDE É USADO:
 * - Dashboard interno (botão "Editar layout")
 * 
 * NÃO APARECE:
 * - Dashboard público
 */

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, RotateCcw, Plus, Sparkles } from "lucide-react";
import { useLayoutConfig } from "@/hooks/useLayoutConfig";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface LayoutConfigPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTab: string;
  metricsMap: Record<string, { name: string; valueType: string }>;
  chartsMap: Record<string, { name: string }>;
}

export const LayoutConfigPanel = ({
  open,
  onOpenChange,
  currentTab,
  metricsMap,
  chartsMap,
}: LayoutConfigPanelProps) => {
  const {
    getMetricsForTab,
    getChartsForTab,
    updateMetricVisibility,
    updateMetricPosition,
    updateMetricVariant,
    updateChartVisibility,
    updateChartType,
    addCustomMetric,
    resetTabLayout,
  } = useLayoutConfig();

  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricType, setNewMetricType] = useState<string>("number");
  const [showAddMetric, setShowAddMetric] = useState(false);

  const metrics = getMetricsForTab(currentTab);
  const charts = getChartsForTab(currentTab);

  const handleResetLayout = () => {
    resetTabLayout(currentTab);
    toast({
      title: "Layout resetado",
      description: "O layout desta aba foi revertido para o padrão.",
    });
  };

  const handleAddCustomMetric = () => {
    if (!newMetricName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Digite um nome para a métrica.",
        variant: "destructive",
      });
      return;
    }

    addCustomMetric(currentTab, newMetricName, newMetricType);
    toast({
      title: "Métrica adicionada",
      description: `${newMetricName} foi adicionada ao dashboard.`,
    });

    setNewMetricName("");
    setNewMetricType("number");
    setShowAddMetric(false);
  };

  const getMetricName = (metricId: string) => {
    return metricsMap[metricId]?.name || metricId;
  };

  const getChartName = (chartId: string) => {
    return chartsMap[chartId]?.name || chartId;
  };

  const isCustomMetric = (metricId: string) => metricId.startsWith("custom-");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configurar Layout</SheetTitle>
          <SheetDescription>
            Personalize como as métricas e gráficos aparecem nesta aba
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="metrics" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          {/* Tab de Métricas */}
          <TabsContent value="metrics" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {metrics.filter(m => m.visible).length} de {metrics.length} visíveis
              </p>
              <Button variant="outline" size="sm" onClick={handleResetLayout}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
            </div>

            <div className="space-y-2">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="border rounded-lg p-3 space-y-3 bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox
                        checked={metric.visible}
                        onCheckedChange={(checked) =>
                          updateMetricVisibility(currentTab, metric.id, checked as boolean)
                        }
                      />
                      <span className="text-sm font-medium">
                        {getMetricName(metric.id)}
                      </span>
                      {isCustomMetric(metric.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateMetricPosition(currentTab, metric.id, "up")}
                        disabled={metric.position === 1}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateMetricPosition(currentTab, metric.id, "down")}
                        disabled={metric.position === metrics.length}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground w-16">Tipo:</Label>
                    <Select
                      value={metric.variant}
                      onValueChange={(value: "hero" | "card") =>
                        updateMetricVariant(currentTab, metric.id, value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="hero">Hero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar métrica custom */}
            <div className="border-t pt-4">
              {!showAddMetric ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMetric(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova métrica custom
                </Button>
              ) : (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Nova Métrica Custom</h4>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nome da métrica</Label>
                    <Input
                      placeholder="Ex: Taxa de Abertura"
                      value={newMetricName}
                      onChange={(e) => setNewMetricName(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={newMetricType} onValueChange={setNewMetricType}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="currency">Moeda</SelectItem>
                        <SelectItem value="percent">Porcentagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddMetric(false);
                        setNewMetricName("");
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleAddCustomMetric} className="flex-1">
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab de Gráficos */}
          <TabsContent value="charts" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {charts.filter(c => c.visible).length} de {charts.length} visíveis
              </p>
            </div>

            {charts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Nenhum gráfico disponível nesta aba
              </div>
            ) : (
              <div className="space-y-2">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="border rounded-lg p-3 space-y-3 bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={chart.visible}
                        onCheckedChange={(checked) =>
                          updateChartVisibility(currentTab, chart.id, checked as boolean)
                        }
                      />
                      <span className="text-sm font-medium">
                        {getChartName(chart.id)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-16">Tipo:</Label>
                      <Select
                        value={chart.type}
                        onValueChange={(value) =>
                          updateChartType(currentTab, chart.id, value as typeof chart.type)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Linha</SelectItem>
                          <SelectItem value="area">Área</SelectItem>
                          <SelectItem value="bar">Barras</SelectItem>
                          <SelectItem value="pie">Pizza</SelectItem>
                          <SelectItem value="combo">Combo</SelectItem>
                          {currentTab === "funil" && (
                            <SelectItem value="funnel">Funil</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
