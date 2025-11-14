import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  FileDown, 
  FileSpreadsheet, 
  Settings, 
  Layout, 
  Presentation,
  History,
  BarChart3
} from "lucide-react";

interface DashboardActionsBarProps {
  isExecutiveMode: boolean;
  isReplayMode: boolean;
  onToggleExecutiveMode: () => void;
  onToggleReplayMode: () => void;
  onExportData: () => void;
  onExportImport: () => void;
  onRefresh: () => void;
  onCompare: () => void;
  onConfigure: () => void;
  onEditLayout: () => void;
}

export const DashboardActionsBar = ({
  isExecutiveMode,
  isReplayMode,
  onToggleExecutiveMode,
  onToggleReplayMode,
  onExportData,
  onExportImport,
  onRefresh,
  onCompare,
  onConfigure,
  onEditLayout,
}: DashboardActionsBarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      {/* Modos de visualização - esquerda */}
      <div className="flex items-center gap-2">
        <Button
          variant={isExecutiveMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleExecutiveMode}
          className={isExecutiveMode ? "bg-gradient-primary" : ""}
        >
          <Presentation className="w-4 h-4 mr-2" />
          Modo Executivo
        </Button>
        <Button
          variant={isReplayMode ? "default" : "outline"}
          size="sm"
          onClick={onToggleReplayMode}
          className={isReplayMode ? "border-primary" : ""}
        >
          <History className="w-4 h-4 mr-2" />
          Modo Replay
        </Button>
      </div>

      {/* Ações - direita */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportData}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExportImport}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar/Importar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCompare}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Comparar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onConfigure}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditLayout}
        >
          <Layout className="w-4 h-4 mr-2" />
          Editar Layout
        </Button>
      </div>
    </div>
  );
};
