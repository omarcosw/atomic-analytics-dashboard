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
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
          >
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
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl transition-all hover:border-white/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-emerald-400/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-300/30">
                        <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{source.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            {isComplete ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-emerald-300" />
                                <span className="text-emerald-300 font-medium">Sincronizado</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-amber-300" />
                                <span className="text-amber-300 font-medium">Configuração incompleta</span>
                              </>
                            )}
                          </div>
                          <span>•</span>
                          <span>Última sincronização: {source.lastSync}</span>
                        </div>
                        <div className="mt-2 text-sm text-white/60">
                          {mappingsCount} de {totalMetrics} métricas mapeadas
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMapping(source.id)}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Editar mapeamento
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(source.id, source.name)}
                        className="text-white/70 hover:text-white"
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
          <div className="rounded-3xl border border-white/15 border-dashed bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/15">
              <FileSpreadsheet className="w-8 h-8 text-white/70" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma fonte conectada</h3>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              Conecte sua primeira planilha do Google Sheets para começar a importar métricas automaticamente.
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
            >
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
