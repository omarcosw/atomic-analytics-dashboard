/**
 * COMPONENTE: Modal de Conexão Google Sheets
 * 
 * Este componente gerencia o fluxo completo de conexão:
 * Passo 1: Autorizar conta Google (simulado)
 * Passo 2: Selecionar planilha
 * Passo 3: Selecionar aba da planilha
 * Passo 4: Preview dos dados
 * 
 * ONDE É USADO:
 * - Página de Fontes de Dados
 * 
 * COMO FUNCIONA:
 * - Usa dados fake de /data/demoSheets.ts
 * - Navega entre passos com botões
 * - Ao final, redireciona para página de mapeamento
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, FileSpreadsheet, Sheet } from "lucide-react";
import { demoSheets } from "@/data/demoSheets";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { updateOnboardingStep, demoOnboarding } from "@/data/demoOnboarding";

interface ConnectSheetsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConnectSheetsModal = ({ open, onOpenChange }: ConnectSheetsModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast({
        title: "Autorização concedida",
        description: "Acesso ao Google Sheets conectado com sucesso.",
      });
    }, 1500);
  };

  const handleSelectSheet = (sheetId: string) => {
    setSelectedSheet(sheetId);
    setStep(3);
    
    // Atualizar progresso do onboarding (passo 2 -> 3)
    if (demoOnboarding.step === 2) {
      updateOnboardingStep(3);
    }
  };

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab);
    setStep(4);
    
    // Atualizar progresso do onboarding (passo 3 -> 4)
    if (demoOnboarding.step === 3) {
      updateOnboardingStep(4);
      toast({
        title: "Passo 3 concluído",
        description: "Aba selecionada com sucesso. Configure o mapeamento agora.",
      });
    }
  };

  const handleConfigureMapping = () => {
    onOpenChange(false);
    navigate("/mapping");
    toast({
      title: "Planilha conectada",
      description: "Configure o mapeamento das métricas agora.",
    });
  };

  const selectedSheetData = demoSheets.files.find(s => s.id === selectedSheet);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Conectar Google Sheets</DialogTitle>
        </DialogHeader>

        {/* Passo 1: Autorização */}
        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Autorizar acesso</h3>
                <p className="text-sm text-muted-foreground">
                  Para conectar suas planilhas, precisamos acessar sua conta Google.
                </p>
              </div>
            </div>
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                "Continuar com Google"
              )}
            </Button>
          </div>
        )}

        {/* Passo 2: Selecionar planilha */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Selecione a planilha</h3>
              <p className="text-sm text-muted-foreground">
                Escolha qual planilha contém as métricas do seu projeto.
              </p>
            </div>
            <div className="space-y-2">
              {demoSheets.files.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => handleSelectSheet(sheet.id)}
                  className="w-full p-4 border rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">{sheet.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {sheet.tabs.length} abas
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Passo 3: Selecionar aba */}
        {step === 3 && selectedSheetData && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Selecione a aba</h3>
              <p className="text-sm text-muted-foreground">
                Escolha a aba que contém os dados das métricas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectedSheetData.tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleSelectTab(tab)}
                  className="p-4 border rounded-lg hover:border-primary hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sheet className="w-4 h-4 text-primary" />
                    <span className="font-medium">{tab}</span>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setStep(2)}>
              Voltar
            </Button>
          </div>
        )}

        {/* Passo 4: Preview */}
        {step === 4 && selectedSheetData && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Preview dos dados</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Aba selecionada: <strong>{selectedTab}</strong>
              </p>
            </div>
            
            {/* Tabela de preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {selectedSheetData.preview[0].map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSheetData.preview.slice(1, 5).map((row, i) => (
                      <tr key={i} className="border-t">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(3)}>
                Voltar
              </Button>
              <Button onClick={handleConfigureMapping} className="flex-1">
                Configurar mapeamento de métricas
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
