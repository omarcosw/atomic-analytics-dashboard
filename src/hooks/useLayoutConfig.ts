/**
 * HOOK: useLayoutConfig
 * 
 * Gerencia a configuração de layout do dashboard.
 * 
 * FUNCIONALIDADES:
 * - Ler layout de cada aba
 * - Atualizar visibilidade de métricas/gráficos
 * - Mudar ordem (position)
 * - Mudar variant (hero/card) e tipo de gráfico
 * - Resetar layout para padrão
 * - Adicionar métricas custom
 * 
 * COMO USAR:
 * const { 
 *   getMetricsForTab, 
 *   getChartsForTab, 
 *   updateMetricVisibility,
 *   ... 
 * } = useLayoutConfig();
 */

import { useState, useCallback } from "react";
import { demoLayout, DashboardLayout, MetricLayoutItem, ChartLayoutItem } from "@/data/demoLayout";

export const useLayoutConfig = () => {
  const [layout, setLayout] = useState<DashboardLayout>(demoLayout);

  // Obter métricas de uma aba (ordenadas por position)
  const getMetricsForTab = useCallback((tabId: string): MetricLayoutItem[] => {
    const tabLayout = layout[tabId];
    if (!tabLayout) return [];
    return [...tabLayout.metrics].sort((a, b) => a.position - b.position);
  }, [layout]);

  // Obter gráficos de uma aba (ordenados por position)
  const getChartsForTab = useCallback((tabId: string): ChartLayoutItem[] => {
    const tabLayout = layout[tabId];
    if (!tabLayout) return [];
    return [...tabLayout.charts].sort((a, b) => a.position - b.position);
  }, [layout]);

  // Atualizar visibilidade de métrica
  const updateMetricVisibility = useCallback((tabId: string, metricId: string, visible: boolean) => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const metricIndex = tabLayout.metrics.findIndex(m => m.id === metricId);
      if (metricIndex === -1) return prev;

      newLayout[tabId] = {
        ...tabLayout,
        metrics: [
          ...tabLayout.metrics.slice(0, metricIndex),
          { ...tabLayout.metrics[metricIndex], visible },
          ...tabLayout.metrics.slice(metricIndex + 1),
        ],
      };

      return newLayout;
    });
  }, []);

  // Atualizar posição de métrica
  const updateMetricPosition = useCallback((tabId: string, metricId: string, direction: "up" | "down") => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const metrics = [...tabLayout.metrics].sort((a, b) => a.position - b.position);
      const metricIndex = metrics.findIndex(m => m.id === metricId);
      if (metricIndex === -1) return prev;

      const newIndex = direction === "up" ? metricIndex - 1 : metricIndex + 1;
      if (newIndex < 0 || newIndex >= metrics.length) return prev;

      // Trocar posições
      const temp = metrics[metricIndex].position;
      metrics[metricIndex].position = metrics[newIndex].position;
      metrics[newIndex].position = temp;

      newLayout[tabId] = {
        ...tabLayout,
        metrics,
      };

      return newLayout;
    });
  }, []);

  // Atualizar variant de métrica
  const updateMetricVariant = useCallback((tabId: string, metricId: string, variant: "hero" | "card") => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const metricIndex = tabLayout.metrics.findIndex(m => m.id === metricId);
      if (metricIndex === -1) return prev;

      newLayout[tabId] = {
        ...tabLayout,
        metrics: [
          ...tabLayout.metrics.slice(0, metricIndex),
          { ...tabLayout.metrics[metricIndex], variant },
          ...tabLayout.metrics.slice(metricIndex + 1),
        ],
      };

      return newLayout;
    });
  }, []);

  // Atualizar visibilidade de gráfico
  const updateChartVisibility = useCallback((tabId: string, chartId: string, visible: boolean) => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const chartIndex = tabLayout.charts.findIndex(c => c.id === chartId);
      if (chartIndex === -1) return prev;

      newLayout[tabId] = {
        ...tabLayout,
        charts: [
          ...tabLayout.charts.slice(0, chartIndex),
          { ...tabLayout.charts[chartIndex], visible },
          ...tabLayout.charts.slice(chartIndex + 1),
        ],
      };

      return newLayout;
    });
  }, []);

  // Atualizar tipo de gráfico
  const updateChartType = useCallback((tabId: string, chartId: string, type: ChartLayoutItem["type"]) => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const chartIndex = tabLayout.charts.findIndex(c => c.id === chartId);
      if (chartIndex === -1) return prev;

      newLayout[tabId] = {
        ...tabLayout,
        charts: [
          ...tabLayout.charts.slice(0, chartIndex),
          { ...tabLayout.charts[chartIndex], type },
          ...tabLayout.charts.slice(chartIndex + 1),
        ],
      };

      return newLayout;
    });
  }, []);

  // Adicionar métrica custom
  const addCustomMetric = useCallback((tabId: string, name: string, valueType: string) => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const tabLayout = newLayout[tabId];
      if (!tabLayout) return prev;

      const maxPosition = Math.max(...tabLayout.metrics.map(m => m.position), 0);
      const customId = `custom-${Date.now()}`;

      newLayout[tabId] = {
        ...tabLayout,
        metrics: [
          ...tabLayout.metrics,
          {
            id: customId,
            visible: true,
            position: maxPosition + 1,
            variant: "card",
          },
        ],
      };

      return newLayout;
    });
  }, []);

  // Resetar layout de uma aba
  const resetTabLayout = useCallback((tabId: string) => {
    setLayout(prev => {
      const newLayout = { ...prev };
      const defaultLayout = demoLayout[tabId];
      if (!defaultLayout) return prev;

      newLayout[tabId] = { ...defaultLayout };
      return newLayout;
    });
  }, []);

  return {
    layout,
    getMetricsForTab,
    getChartsForTab,
    updateMetricVisibility,
    updateMetricPosition,
    updateMetricVariant,
    updateChartVisibility,
    updateChartType,
    addCustomMetric,
    resetTabLayout,
  };
};
