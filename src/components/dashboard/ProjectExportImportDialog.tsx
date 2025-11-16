import { useState } from "react";
import { Upload, Download, FileJson, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProjectExport } from "@/hooks/useProjectExport";
import { useProjectImport } from "@/hooks/useProjectImport";

type ProjectDialogMetrics = {
  id: string;
  name: string;
  value: number;
  valueType: "number" | "currency" | "percent";
  isOverridden?: boolean;
  trend?: number;
  goal?: number;
  sparklineData?: number[];
};

type ProjectDialogData = {
  id: string;
  name: string;
  type?: string;
  metrics: ProjectDialogMetrics[];
  goals?: Record<string, number>;
  snapshots?: Array<Record<string, unknown>>;
  dashboardConfig?: Record<string, unknown>;
};

interface ProjectExportImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectData: ProjectDialogData;
}

export function ProjectExportImportDialog({
  open,
  onOpenChange,
  projectData,
}: ProjectExportImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { exportProject, isExporting } = useProjectExport();
  const { importProject, isImporting } = useProjectImport();

  const handleExport = async () => {
    await exportProject({
      project: {
        name: projectData.name,
        type: projectData.type || "Outro",
      },
      metrics: projectData.metrics,
      goals: projectData.goals,
      snapshots: projectData.snapshots,
      dashboardConfig: projectData.dashboardConfig,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    const success = await importProject(selectedFile);
    if (success) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exportar/Importar Projeto</DialogTitle>
          <DialogDescription>
            Faça backup ou transfira projetos entre workspaces
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <Alert>
              <FileJson className="h-4 w-4" />
              <AlertDescription>
                O arquivo JSON incluirá todas as métricas, metas, seções customizadas e snapshots
                históricos do projeto.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Dados a serem exportados:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  {projectData.metrics.length} métricas
                </li>
                {projectData.goals && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Metas e objetivos
                  </li>
                )}
                {projectData.snapshots && projectData.snapshots.length > 0 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {projectData.snapshots.length} snapshots históricos
                  </li>
                )}
                {projectData.dashboardConfig && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Configurações do dashboard
                  </li>
                )}
              </ul>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exportando..." : "Exportar Projeto"}
            </Button>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecione um arquivo JSON exportado anteriormente. Um novo projeto será criado com
                todas as configurações e dados importados.
              </AlertDescription>
            </Alert>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
              <FileJson className="h-12 w-12 mx-auto text-muted-foreground" />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Escolher outro arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Arraste um arquivo JSON ou clique para selecionar
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar arquivo
                      </span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importando..." : "Importar Projeto"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
