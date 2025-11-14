import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash, 
  Target, 
  Edit3, 
  Layout, 
  Power,
  FileCheck
} from "lucide-react";

type AuditLog = {
  id: string;
  action: string;
  metadata: any;
  created_at: string;
  user_id: string;
  project_id: string;
};

interface AuditTabProps {
  projectId: string;
}

const actionIcons: Record<string, any> = {
  project_created: Plus,
  dashboard_activated: Power,
  dashboard_deactivated: Power,
  metric_created: Plus,
  metric_updated: Edit,
  metric_deleted: Trash,
  goal_updated: Target,
  value_overridden: Edit3,
  section_added: Layout,
  section_removed: Layout,
  template_applied: FileCheck
};

const actionLabels: Record<string, string> = {
  project_created: "Projeto criado",
  dashboard_activated: "Dashboard ativado",
  dashboard_deactivated: "Dashboard desativado",
  metric_created: "Métrica criada",
  metric_updated: "Métrica atualizada",
  metric_deleted: "Métrica removida",
  goal_updated: "Meta atualizada",
  value_overridden: "Valor ajustado manualmente",
  section_added: "Seção adicionada",
  section_removed: "Seção removida",
  template_applied: "Template aplicado"
};

const actionColors: Record<string, string> = {
  project_created: "bg-green-500/10 text-green-500",
  dashboard_activated: "bg-blue-500/10 text-blue-500",
  dashboard_deactivated: "bg-gray-500/10 text-gray-500",
  metric_created: "bg-green-500/10 text-green-500",
  metric_updated: "bg-yellow-500/10 text-yellow-500",
  metric_deleted: "bg-red-500/10 text-red-500",
  goal_updated: "bg-purple-500/10 text-purple-500",
  value_overridden: "bg-orange-500/10 text-orange-500",
  section_added: "bg-cyan-500/10 text-cyan-500",
  section_removed: "bg-red-500/10 text-red-500",
  template_applied: "bg-indigo-500/10 text-indigo-500"
};

export function AuditTab({ projectId }: AuditTabProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, [projectId]);

  const loadAuditLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error loading audit logs:", error);
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  const formatMetadata = (metadata: Record<string, any>) => {
    const entries = Object.entries(metadata);
    if (entries.length === 0) return null;

    return (
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        {entries.map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{key}:</span>{" "}
            {typeof value === "object" ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Histórico de Auditoria</h2>
        <p className="text-muted-foreground">
          Todas as alterações e eventos importantes do projeto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Eventos Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando histórico...
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento registrado ainda
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => {
                  const Icon = actionIcons[log.action] || Activity;
                  const label = actionLabels[log.action] || log.action;
                  const colorClass = actionColors[log.action] || "bg-gray-500/10 text-gray-500";

                  return (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Badge variant="outline" className={colorClass}>
                              {label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR
                              })}
                            </span>
                          </div>
                          {formatMetadata(log.metadata)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
