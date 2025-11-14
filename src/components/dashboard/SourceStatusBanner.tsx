import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { hasConnectedSource } from "@/data/userMappings";

export const SourceStatusBanner = () => {
  const navigate = useNavigate();
  const isConnected = hasConnectedSource();

  if (isConnected) {
    return (
      <div className="w-full p-4 rounded-lg bg-success/5 border border-success/20 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <FileSpreadsheet className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Fonte: Google Sheets conectada
              </p>
              <p className="text-xs text-muted-foreground">
                Suas métricas estão sendo atualizadas automaticamente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-success/10 text-success border-success/20">
              Ativo
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/data-sources")}
              className="text-xs"
            >
              Gerenciar fontes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg bg-warning/5 border border-warning/20 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle className="w-5 h-5 text-warning" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Nenhuma fonte configurada
            </p>
            <p className="text-xs text-muted-foreground">
              Conecte uma planilha em 'Fontes de Dados' para atualizar suas métricas.
            </p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate("/data-sources")}
          className="bg-gradient-primary"
        >
          Conectar agora
        </Button>
      </div>
    </div>
  );
};
