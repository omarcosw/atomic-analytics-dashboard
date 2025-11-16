import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Camera, Calendar, Info } from "lucide-react";
import { format, subDays, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type VisualSnapshot = {
  id: string;
  project_id: string;
  image_url: string;
  snapshot_date: string;
  created_at: string;
};

type VisualHistoryTabProps = {
  projectId: string;
};

export function VisualHistoryTab({ projectId }: VisualHistoryTabProps) {
  const [snapshots, setSnapshots] = useState<VisualSnapshot[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentSnapshot, setCurrentSnapshot] = useState<VisualSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSnapshots = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visual_snapshots")
      .select("*")
      .eq("project_id", projectId)
      .order("snapshot_date", { ascending: false });

    if (error) {
      console.error("Error loading snapshots:", error);
    } else {
      setSnapshots(data || []);
    }
    setLoading(false);
  }, [projectId]);

  const updateCurrentSnapshot = useCallback(() => {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const snapshot = snapshots.find(s => s.snapshot_date === dateStr);
    setCurrentSnapshot(snapshot || null);
  }, [currentDate, snapshots]);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  useEffect(() => {
    updateCurrentSnapshot();
  }, [currentDate, snapshots, updateCurrentSnapshot]);

  const handlePreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const tomorrow = addDays(currentDate, 1);
    if (tomorrow <= new Date()) {
      setCurrentDate(tomorrow);
    }
  };

  const hasNextDay = addDays(currentDate, 1) <= new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Histórico Visual</h2>
          <p className="text-muted-foreground">
            Snapshots automáticos do dashboard ao longo do tempo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousDay}
              >
                <ChevronLeft className="h-4 w-4" />
                Dia Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDay}
                disabled={!hasNextDay}
              >
                Próximo Dia
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando snapshots...</p>
              </div>
            </div>
          ) : currentSnapshot ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                <img
                  src={currentSnapshot.image_url}
                  alt={`Snapshot de ${format(parseISO(currentSnapshot.snapshot_date), "dd/MM/yyyy")}`}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Capturado em {format(parseISO(currentSnapshot.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">
                Nenhum snapshot disponível para esta data
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Snapshots são gerados automaticamente</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {snapshots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Snapshots Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {snapshots.map((snapshot) => (
                <button
                  key={snapshot.id}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                    snapshot.snapshot_date === format(currentDate, "yyyy-MM-dd")
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setCurrentDate(parseISO(snapshot.snapshot_date))}
                >
                  <img
                    src={snapshot.image_url}
                    alt={`Snapshot de ${format(parseISO(snapshot.snapshot_date), "dd/MM/yyyy")}`}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-2 text-xs text-center bg-muted">
                    {format(parseISO(snapshot.snapshot_date), "dd/MM/yyyy")}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
