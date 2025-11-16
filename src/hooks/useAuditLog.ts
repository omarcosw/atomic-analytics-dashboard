import { supabase } from "@/integrations/supabase/client";

export type AuditAction = 
  | "project_created"
  | "dashboard_activated"
  | "dashboard_deactivated"
  | "metric_created"
  | "metric_updated"
  | "metric_deleted"
  | "goal_updated"
  | "value_overridden"
  | "section_added"
  | "section_removed"
  | "template_applied";

interface AuditLogParams {
  action: AuditAction;
  projectId?: string;
  metadata?: Record<string, unknown>;
}

export const useAuditLog = () => {
  const logEvent = async ({ action, projectId, metadata = {} }: AuditLogParams) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Cannot log audit event: user not authenticated");
      return;
    }

    const { error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: user.id,
        project_id: projectId,
        action,
        metadata
      });

    if (error) {
      console.error("Error logging audit event:", error);
    }
  };

  return { logEvent };
};
