import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type Metric = Tables<"metrics">;
export type MetricValue = Tables<"metric_values">;

export type DashboardMetric = {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  format: string;
};

/**
 * Buscar 1 projeto pelo id
 */
export async function getProject(projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("[getProject] erro ao buscar projeto:", error);
    return null;
  }

  return data as Project;
}

/**
 * Buscar todas as métricas principais (is_primary = true) de um projeto
 */
export async function getPrimaryMetrics(projectId: string): Promise<Metric[]> {
  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_primary", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPrimaryMetrics] erro ao buscar métricas:", error);
    return [];
  }

  return (data ?? []) as Metric[];
}

/**
 * Buscar o valor mais recente de uma métrica
 */
export async function getLatestMetricValue(
  metricId: string
): Promise<MetricValue | null> {
  const { data, error } = await supabase
    .from("metric_values")
    .select("*")
    .eq("metric_id", metricId)
    .order("ref_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "[getLatestMetricValue] erro ao buscar valor mais recente:",
      error
    );
    return null;
  }

  return data as MetricValue | null;
}

const mapFormatToValueType = (format: string): DashboardMetric["valueType"] => {
  if (format === "currency") return "currency";
  if (format === "percent") return "percent";
  return "number";
};

export async function getDashboardMetrics(
  projectId: string
): Promise<DashboardMetric[]> {
  const baseMetrics = await getPrimaryMetrics(projectId);
  if (!baseMetrics.length) return [];

  const metricsWithValues = await Promise.all(
    baseMetrics.map(async (metric) => {
      const latest = await getLatestMetricValue(metric.id);
      return {
        id: metric.id,
        name: metric.label,
        value: latest ? Number(latest.value) : 0,
        valueType: mapFormatToValueType(metric.format),
        format: metric.format,
      } as DashboardMetric;
    })
  );

  return metricsWithValues;
}
