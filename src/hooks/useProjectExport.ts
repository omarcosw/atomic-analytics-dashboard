import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type ProjectExportData = {
  version: string;
  exportDate: string;
  project: {
    name: string;
    type: string;
    startDate?: string;
    endDate?: string;
  };
  metrics: Array<{
    id: string;
    name: string;
    value: number;
    valueType: "number" | "currency" | "percent";
    isOverridden?: boolean;
  }>;
  goals?: {
    leadsTarget?: number;
    revenueTarget?: number;
    maxCPL?: number;
    minROI?: number;
  };
  sections?: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
  snapshots?: Array<{
    date: string;
    leads: number;
    revenue: number;
    roi: number;
    conversion: number;
    ticket: number;
    investimento: number;
  }>;
  dashboardConfig?: {
    visibleSections: Record<string, boolean>;
    customSections: Array<{ id: string; name: string; icon: string }>;
  };
};

export const useProjectExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportProject = async (projectData: Omit<ProjectExportData, "version" | "exportDate">) => {
    setIsExporting(true);
    try {
      const exportData: ProjectExportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        ...projectData,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectData.project.name.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Projeto exportado!",
        description: "O arquivo JSON foi baixado com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Error exporting project:", error);
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível exportar o projeto.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportProject,
    isExporting,
  };
};
