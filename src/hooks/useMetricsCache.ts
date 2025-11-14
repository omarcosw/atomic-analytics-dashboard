import { useState, useEffect, useCallback } from "react";
import { cacheManager } from "@/utils/cacheManager";

type Metric = {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  isOverridden?: boolean;
};

export const useMetricsCache = (projectId: string) => {
  const cacheKey = `metrics-${projectId}`;
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    return cacheManager.get<Metric[]>(cacheKey) || [];
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateMetrics = useCallback((newMetrics: Metric[]) => {
    // Detectar apenas métricas que mudaram
    const changed = newMetrics.filter((newMetric) => {
      const existing = metrics.find(m => m.id === newMetric.id);
      if (!existing) return true;
      return JSON.stringify(existing) !== JSON.stringify(newMetric);
    });

    if (changed.length > 0) {
      console.log(`📊 Atualizando ${changed.length} de ${newMetrics.length} métricas`);
      setMetrics(newMetrics);
      cacheManager.set(cacheKey, newMetrics, 5 * 60 * 1000); // 5 min TTL
    }
  }, [metrics, cacheKey]);

  const refreshMetrics = useCallback(async (fetchFn: () => Promise<Metric[]>) => {
    setIsLoading(true);
    try {
      const freshMetrics = await fetchFn();
      updateMetrics(freshMetrics);
    } finally {
      setIsLoading(false);
    }
  }, [updateMetrics]);

  const invalidateCache = useCallback(() => {
    cacheManager.invalidate(cacheKey);
    setMetrics([]);
  }, [cacheKey]);

  const updateSingleMetric = useCallback((metricId: string, updates: Partial<Metric>) => {
    setMetrics(prev => {
      const updated = prev.map(m => 
        m.id === metricId ? { ...m, ...updates } : m
      );
      cacheManager.set(cacheKey, updated);
      return updated;
    });
  }, [cacheKey]);

  return {
    metrics,
    isLoading,
    refreshMetrics,
    invalidateCache,
    updateSingleMetric,
    isCached: cacheManager.has(cacheKey),
  };
};
