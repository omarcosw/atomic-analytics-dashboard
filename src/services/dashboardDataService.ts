import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { getProjectById as getProjectRecordById } from "@/services/projectsService";

export type DashboardProject = Tables<"projects">;
export type DashboardGoalRecord = Record<string, number>;

export type DashboardSnapshot = Tables<"daily_snapshots">;

export type DashboardMetric = {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  trend?: number;
  goal?: number;
  sparklineData?: number[];
};

export const fetchProjectById = async (projectId: string) => {
  const project = await getProjectRecordById(projectId);
  return project as DashboardProject | null;
};

export const fetchSnapshots = async (projectId: string) => {
  const { data, error } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("project_id", projectId)
    .order("snapshot_date", { ascending: true });

  if (error) {
    console.error("[fetchSnapshots]", error);
    return [];
  }

  return (data ?? []) as DashboardSnapshot[];
};

type MetricValue = Tables<"metric_values">;
type Metric = Tables<"metrics">;

const formatToValueType = (format: string): DashboardMetric["valueType"] => {
  if (format === "currency") return "currency";
  if (format === "percent") return "percent";
  return "number";
};

const fetchPrimaryMetrics = async (projectId: string) => {
  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("project_id", projectId)
    .eq("is_primary", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[fetchPrimaryMetrics]", error);
    return [];
  }

  return (data ?? []) as Metric[];
};

const fetchLatestMetricValue = async (metricId: string) => {
  const { data, error } = await supabase
    .from("metric_values")
    .select("*")
    .eq("metric_id", metricId)
    .order("ref_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchLatestMetricValue]", error);
    return null;
  }

  return data as MetricValue | null;
};

export const fetchDashboardMetrics = async (projectId: string) => {
  const metrics = await fetchPrimaryMetrics(projectId);

  const metricsWithValues = await Promise.all(
    metrics.map(async (metric) => {
      const latest = await fetchLatestMetricValue(metric.id);
      return {
        id: metric.id,
        name: metric.label,
        value: latest ? Number(latest.value) : 0,
        valueType: formatToValueType(metric.format),
        trend: undefined,
        goal: undefined,
      } as DashboardMetric;
    })
  );

  return metricsWithValues;
};

export const fetchProjectBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("public_slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[fetchProjectBySlug]", error);
    return null;
  }

  return data as DashboardProject | null;
};

export const fetchPublicDashboardData = async (slug: string) => {
  const project = await fetchProjectBySlug(slug);
  if (!project) {
    return { project: null, metrics: [] };
  }
  const metrics = await fetchDashboardMetrics(project.id);
  return { project, metrics };
};
