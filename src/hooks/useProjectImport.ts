import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type ProjectImportData = {
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

export const useProjectImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<ProjectImportData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateImportData = (data: unknown): data is ProjectImportData => {
    return (
      data &&
      typeof data === "object" &&
      data.version &&
      data.project &&
      data.project.name &&
      Array.isArray(data.metrics)
    );
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  const importProject = async (file: File) => {
    setIsImporting(true);
    try {
      const fileContent = await readFile(file);
      const data = JSON.parse(fileContent);

      if (!validateImportData(data)) {
        throw new Error("Invalid project file format");
      }

      setImportedData(data);

      // Simular criação de projeto
      // Em produção, isso salvaria no Supabase
      const newProjectId = Math.floor(Math.random() * 1000);

      toast({
        title: "Projeto importado!",
        description: `"${data.project.name}" foi importado com ${data.metrics.length} métricas.`,
      });

      // Redirecionar para o novo projeto
      setTimeout(() => {
        navigate(`/project/${newProjectId}`);
      }, 1500);

      return true;
    } catch (error) {
      console.error("Error importing project:", error);
      toast({
        title: "Erro ao importar",
        description: error instanceof Error ? error.message : "Arquivo inválido ou corrompido.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importProject,
    isImporting,
    importedData,
  };
};
