import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type DailySnapshot = {
  id: string;
  project_id: string;
  snapshot_date: string;
  leads: number;
  revenue: number;
  roi: number;
  conversion: number;
  ticket: number;
  investimento: number;
  metrics_data: any;
  created_at: string;
};

export const useReplayMode = (projectId: string) => {
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayDate, setReplayDate] = useState<Date | null>(null);
  const [snapshotData, setSnapshotData] = useState<DailySnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const { toast } = useToast();

  const loadAvailableDates = useCallback(async () => {
    const { data, error } = await supabase
      .from("daily_snapshots")
      .select("snapshot_date")
      .eq("project_id", projectId)
      .order("snapshot_date", { ascending: false });

    if (error) {
      console.error("Error loading available dates:", error);
      return;
    }

    const dates = data.map(d => new Date(d.snapshot_date));
    setAvailableDates(dates);
  }, [projectId]);

  const loadSnapshot = useCallback(async (date: Date) => {
    setIsLoading(true);
    const dateStr = format(date, "yyyy-MM-dd");

    try {
      const { data, error } = await supabase
        .from("daily_snapshots")
        .select("*")
        .eq("project_id", projectId)
        .eq("snapshot_date", dateStr)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast({
            title: "Snapshot não encontrado",
            description: `Não há dados salvos para ${format(date, "dd/MM/yyyy")}`,
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setSnapshotData(null);
        return null;
      }

      setSnapshotData(data);
      toast({
        title: "Modo Replay ativado",
        description: `Visualizando dados de ${format(date, "dd/MM/yyyy")}`,
      });

      return data;
    } catch (error) {
      console.error("Error loading snapshot:", error);
      toast({
        title: "Erro ao carregar snapshot",
        description: "Não foi possível carregar os dados históricos.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  const enterReplayMode = useCallback(async (date: Date) => {
    const snapshot = await loadSnapshot(date);
    if (snapshot) {
      setIsReplayMode(true);
      setReplayDate(date);
    }
  }, [loadSnapshot]);

  const exitReplayMode = useCallback(() => {
    setIsReplayMode(false);
    setReplayDate(null);
    setSnapshotData(null);
    toast({
      title: "Modo ao vivo",
      description: "Visualizando dados em tempo real",
    });
  }, [toast]);

  const navigateToDate = useCallback(async (date: Date) => {
    if (isReplayMode) {
      await loadSnapshot(date);
      setReplayDate(date);
    }
  }, [isReplayMode, loadSnapshot]);

  return {
    isReplayMode,
    replayDate,
    snapshotData,
    isLoading,
    availableDates,
    enterReplayMode,
    exitReplayMode,
    navigateToDate,
    loadAvailableDates,
  };
};
