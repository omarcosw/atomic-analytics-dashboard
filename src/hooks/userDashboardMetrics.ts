// src/hooks/useDashboardMetrics.ts
import { useEffect, useState } from "react";
import {
  getPrimaryMetrics,
  getLatestMetricValue,
  Metric,
} from "../services/metricsService";

// tipo usado na tela (métrica + último valor)
export type MetricWithValue = Metric & {
  latestValue: number | null;
};

export function useDashboardMetrics(projectId: string) {
  const [metrics, setMetrics] = useState<MetricWithValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // buscar métricas principais do projeto
        const baseMetrics = await getPrimaryMetrics(projectId);

        const result: MetricWithValue[] = [];

        // pra cada métrica, buscar o valor mais recente
        for (const m of baseMetrics) {
          const latest = await getLatestMetricValue(m.id);
          result.push({
            ...m,
            latestValue: latest ? Number(latest.value) : null,
          });
        }

        setMetrics(result);
      } catch (err) {
        console.error("[useDashboardMetrics] erro ao carregar métricas", err);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      load();
    }
  }, [projectId]);

  return { metrics, loading };
}
