import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, BarChart3, TrendingUp, Users, DollarSign, Target, Bell } from "lucide-react";

interface DashboardConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: {
    visibleSections: {
      overview: boolean;
      funnel: boolean;
      traffic: boolean;
      revenue: boolean;
      leads: boolean;
      alerts: boolean;
    };
    customSections: Array<{ id: string; name: string; icon: string }>;
  };
  onConfigChange: (config: any) => void;
}

const DashboardConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
}: DashboardConfigDialogProps) => {
  const [visibleSections, setVisibleSections] = useState(config.visibleSections);
  const [customSections, setCustomSections] = useState(config.customSections);
  const [newSectionName, setNewSectionName] = useState("");

  const toggleSection = (section: string) => {
    const updated = { ...visibleSections, [section]: !visibleSections[section as keyof typeof visibleSections] };
    setVisibleSections(updated);
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    const newSection = {
      id: `custom-${Date.now()}`,
      name: newSectionName,
      icon: "BarChart3",
    };
    setCustomSections([...customSections, newSection]);
    setNewSectionName("");
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter(s => s.id !== id));
  };

  const handleSave = () => {
    onConfigChange({ visibleSections, customSections });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Configurações do Dashboard
          </DialogTitle>
          <DialogDescription className="text-base">
            Personalize as seções e visualizações do seu dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Seções Padrão */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Seções do Dashboard
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Visão Geral</Label>
                </div>
                <Switch
                  checked={visibleSections.overview}
                  onCheckedChange={() => toggleSection("overview")}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-2/10">
                    <TrendingUp className="w-5 h-5 text-[hsl(var(--chart-2))]" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Funil</Label>
                </div>
                <Switch
                  checked={visibleSections.funnel}
                  onCheckedChange={() => toggleSection("funnel")}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-3/10">
                    <Users className="w-5 h-5 text-[hsl(var(--chart-3))]" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Tráfego</Label>
                </div>
                <Switch
                  checked={visibleSections.traffic}
                  onCheckedChange={() => toggleSection("traffic")}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-4/10">
                    <DollarSign className="w-5 h-5 text-[hsl(var(--chart-4))]" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Receita</Label>
                </div>
                <Switch
                  checked={visibleSections.revenue}
                  onCheckedChange={() => toggleSection("revenue")}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-5/10">
                    <Target className="w-5 h-5 text-[hsl(var(--chart-5))]" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Leads & LTV</Label>
                </div>
                <Switch
                  checked={visibleSections.leads}
                  onCheckedChange={() => toggleSection("leads")}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50 hover:bg-card transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>
                  <Label className="cursor-pointer font-medium text-base">Alertas & Metas</Label>
                </div>
                <Switch
                  checked={visibleSections.alerts}
                  onCheckedChange={() => toggleSection("alerts")}
                />
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Seções Customizadas */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-accent" />
              Seções Personalizadas
            </h3>
            
            {customSections.length > 0 && (
              <div className="space-y-3 mb-6">
                {customSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 rounded-xl border-2 bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{section.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSection(section.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Input
                placeholder="Nome da nova seção"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSection()}
                className="h-11"
              />
              <Button onClick={addCustomSection} size="default" className="px-6">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardConfigDialog;
