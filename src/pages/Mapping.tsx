/**
 * PÁGINA: Mapeamento de Métricas
 * 
 * Configura quais colunas da planilha correspondem a cada métrica.
 * 
 * FUNCIONALIDADES:
 * - Selecionar coluna para cada métrica
 * - Salvar configuração
 * - Voltar para fontes de dados
 * 
 * DADOS:
 * - Lê de /data/userMappings.ts
 * - Atualiza mapeamentos ao salvar
 */

import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userMappings, updateMapping } from "@/data/userMappings";
import { toast } from "@/hooks/use-toast";
import { updateOnboardingStep, demoOnboarding } from "@/data/demoOnboarding";

const Mapping = () => {
  const navigate = useNavigate();
  
  // Métricas disponíveis para mapear
  const metrics = [
    "Leads Captados",
    "Vendas Confirmadas",
    "Faturamento",
    "CPL",
    "Investimento",
    "ROI",
    "Conversão",
    "Ticket Médio"
  ];

  // Colunas fake da planilha
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Estado local dos mapeamentos
  const [mappings, setMappings] = useState<Record<string, string>>(
    userMappings["sheet-1"] || {}
  );

  const handleColumnChange = (metric: string, column: string) => {
    setMappings(prev => ({
      ...prev,
      [metric]: column
    }));
  };

  const handleSave = () => {
    // Atualizar mapeamentos (fake)
    Object.entries(mappings).forEach(([metric, column]) => {
      updateMapping("sheet-1", metric, column);
    });

    // Atualizar progresso do onboarding (passo 4 -> 5)
    if (demoOnboarding.step === 4) {
      updateOnboardingStep(5);
    }

    toast({
      title: "Mapeamento salvo com sucesso!",
      description: "As métricas estão configuradas e prontas para uso.",
    });

    // Voltar para fontes de dados ou ir para dashboard se no onboarding
    setTimeout(() => {
      if (demoOnboarding.step === 5) {
        navigate("/project/1");
        toast({
          title: "Próximo passo",
          description: "Ative seu dashboard para gerar o link público.",
        });
      } else {
        navigate("/data-sources");
      }
    }, 1000);
  };

  const completedMappings = Object.values(mappings).filter(v => v).length;

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/data-sources")}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>

        <SectionHeader
          title="Mapeamento de Métricas"
          subtitle="Associe as colunas da planilha às métricas do dashboard."
        />

        {/* Progresso */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">
              Progresso do mapeamento
            </span>
            <span className="text-sm font-semibold text-emerald-300">
              {completedMappings} / {metrics.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-2 rounded-full transition-all shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
              style={{ width: `${(completedMappings / metrics.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Grid de mapeamentos */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-xl">
          <div className="grid gap-6 md:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric} className="space-y-2">
                <Label className="text-sm font-semibold text-white/80">{metric}</Label>
                <Select
                  value={mappings[metric] || ""}
                  onValueChange={(value) => handleColumnChange(metric, value)}
                >
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Selecione uma coluna" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050b18] border border-white/10 text-white">
                    <SelectItem value="" className="text-white/80 focus:bg-white/10 focus:text-white">
                      Nenhuma
                    </SelectItem>
                    {columns.map((col) => (
                      <SelectItem key={col} value={col} className="text-white/80 focus:bg-white/10 focus:text-white">
                        Coluna {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/data-sources")}
            className="border-white/30 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar mapeamento
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Mapping;
