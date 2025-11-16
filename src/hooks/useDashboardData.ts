import { useEffect, useState, useCallback, useMemo } from "react";
import {
  fetchProjectById,
  fetchDashboardMetrics,
  fetchSnapshots,
  type DashboardProject,
  type DashboardMetric,
  type DashboardSnapshot,
} from "@/services/dashboardDataService";
import { getStoredProjectById } from "@/services/projectsService";

type DashboardData = {
  project: DashboardProject | null;
  metrics: DashboardMetric[];
  snapshots: DashboardSnapshot[];
  isLoading: boolean;
  reload: () => Promise<void>;
};

export const useDashboardData = (
  projectId?: string,
  initialProject?: DashboardProject | null,
): DashboardData => {
  const storedProject = useMemo(() => {
    if (!projectId) return null;
    return (getStoredProjectById(projectId) as DashboardProject) ?? null;
  }, [projectId]);

  const [project, setProject] = useState<DashboardProject | null>(initialProject ?? storedProject);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [snapshots, setSnapshots] = useState<DashboardSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const [projectData, metricsData, snapshotsData] = await Promise.all([
        fetchProjectById(projectId),
        fetchDashboardMetrics(projectId),
        fetchSnapshots(projectId),
      ]);

      if (projectData) {
        setProject(projectData);
      } else if (initialProject) {
        setProject(initialProject);
      } else {
        const stored = getStoredProjectById(projectId);
        setProject((stored as DashboardProject) ?? null);
      }

      setMetrics(metricsData);
      setSnapshots(snapshotsData);
    } catch (error) {
      console.error("[useDashboardData] erro ao carregar projeto:", error);
      if (initialProject) {
        setProject(initialProject);
      } else {
        const stored = getStoredProjectById(projectId);
        setProject((stored as DashboardProject) ?? null);
      }
      setMetrics([]);
      setSnapshots([]);
    } finally {
      setIsLoading(false);
    }
  }, [initialProject, projectId]);

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    }
  }, [initialProject]);

  useEffect(() => {
    if (!initialProject && storedProject) {
      setProject(storedProject);
    }
  }, [initialProject, storedProject]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    project,
    metrics,
    snapshots,
    isLoading,
    reload: load,
  };
};
