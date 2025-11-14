/**
 * PÁGINA: Fontes de Dados
 * 
 * Gerenciamento de conexões com Google Sheets.
 * 
 * FUNCIONALIDADES:
 * - Conectar nova planilha
 * - Listar planilhas conectadas
 * - Editar mapeamento
 * - Desconectar planilha
 * 
 * DADOS:
 * - Usa /data/demoSheets.ts (fake)
 * - Usa /data/userMappings.ts (fake)
 */

import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { ConnectSheetsModal } from "@/components/ConnectSheetsModal";
import { Plus, FileSpreadsheet, Settings, Unplug, CheckCircle, AlertCircle } from "lucide-react";
import { demoSheets } from "@/data/demoSheets";
import { userMappings } from "@/data/userMappings";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { updateOnboardingStep, demoOnboarding } from "@/data/demoOnboarding";
import { useEffect } from "react";

const DataSources = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  // Abrir modal automaticamente se vindo do onboarding
  useEffect(() => {
    if (searchParams.get("openModal") === "true") {
      setModalOpen(true);
      
      // Atualizar progresso do onboarding (passo 2)
      if (demoOnboarding.step === 2) {
        setTimeout(() => {
          toast({
            title: "Passo 2 iniciado",
            description: "Conecte sua planilha do Google Sheets.",
          });
        }, 500);
      }
    }
  }, [searchParams]);

  const connectedSources = demoSheets.files.filter(
    sheet => userMappings[sheet.id]
  );

  const handleEditMapping = (sheetId: string) => {
    navigate("/mapping");
  };

  const handleDisconnect = (sheetId: string, sheetName: string) => {
    toast({
      title: "Planilha desconectada",
      description: `${sheetName} foi removida das suas fontes.`,
      variant: "destructive"
    });
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Fontes de Dados"
            subtitle="Conecte suas planilhas e configure suas métricas."
          />
          <Button onClick={() => setModalOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Conectar Google Sheets
          </Button>
        </div>

        {/* Lista de fontes conectadas */}
        {connectedSources.length > 0 ? (
          <div className="grid gap-4">
            {connectedSources.map((source) => {
              const mappingsCount = Object.values(userMappings[source.id] || {}).filter(v => v).length;
              const totalMetrics = Object.keys(userMappings[source.id] || {}).length;
              const isComplete = mappingsCount === totalMetrics;

              return (
                <div
                  key={source.id}
                  className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{source.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {isComplete ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-medium">Sincronizado</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-orange-600 font-medium">Configuração incompleta</span>
                              </>
                            )}
                          </div>
                          <span>•</span>
                          <span>Última sincronização: {source.lastSync}</span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {mappingsCount} de {totalMetrics} métricas mapeadas
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMapping(source.id)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Editar mapeamento
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(source.id, source.name)}
                      >
                        <Unplug className="mr-2 h-4 w-4" />
                        Desconectar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Estado vazio
          <div className="bg-white border border-dashed rounded-lg p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma fonte conectada</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Conecte sua primeira planilha do Google Sheets para começar a importar métricas automaticamente.
            </p>
            <Button onClick={() => setModalOpen(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Conectar Google Sheets
            </Button>
          </div>
        )}
      </div>

      <ConnectSheetsModal open={modalOpen} onOpenChange={setModalOpen} />
    </PageLayout>
  );
};

export default DataSources;
