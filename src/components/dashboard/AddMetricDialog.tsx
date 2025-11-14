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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface AddMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSections: Array<{ id: string; name: string }>;
  onCreateMetric: (metric: any) => void;
}

const AddMetricDialog = ({ open, onOpenChange, availableSections, onCreateMetric }: AddMetricDialogProps) => {
  const [mappingType, setMappingType] = useState<"cell" | "column">("cell");
  const [metricName, setMetricName] = useState("");
  const [valueType, setValueType] = useState("number");
  const [visualizationType, setVisualizationType] = useState("number");
  const [selectedSections, setSelectedSections] = useState<string[]>(["overview"]);

  const toggleSection = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const handleCreate = () => {
    const newMetric = {
      id: `metric-${Date.now()}`,
      name: metricName,
      value: 0,
      valueType,
      visualizationType,
      sections: selectedSections,
      isOverridden: false,
      mappingType,
    };
    onCreateMetric(newMetric);
    onOpenChange(false);
    // Reset form
    setMetricName("");
    setValueType("number");
    setVisualizationType("number");
    setSelectedSections(["overview"]);
    setMappingType("cell");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Métrica</DialogTitle>
          <DialogDescription>
            Configure uma métrica para acompanhar seus dados do Google Sheets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-name">Nome da métrica</Label>
              <Input
                id="metric-name"
                placeholder="Ex: Leads captados, Faturamento..."
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value-type">Tipo de valor</Label>
              <Select value={valueType} onValueChange={setValueType}>
                <SelectTrigger id="value-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="currency">Moeda (R$)</SelectItem>
                  <SelectItem value="percent">Porcentagem (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualization-type">Tipo de visualização</Label>
              <Select value={visualizationType} onValueChange={setVisualizationType}>
                <SelectTrigger id="visualization-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Número (card)</SelectItem>
                  <SelectItem value="line_chart">Gráfico de linha</SelectItem>
                  <SelectItem value="bar_chart">Gráfico de barras</SelectItem>
                  <SelectItem value="pie_chart">Gráfico de pizza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exibir nas seções</Label>
              <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                {availableSections.map((section) => (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.id}
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                    <Label htmlFor={section.id} className="cursor-pointer text-sm">
                      {section.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-4 block">
              Como buscar os dados?
            </Label>
            <RadioGroup
              value={mappingType}
              onValueChange={(value) => setMappingType(value as "cell" | "column")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="cell" id="mapping-cell" />
                <Label htmlFor="mapping-cell" className="flex-1 cursor-pointer">
                  <div className="font-medium">Célula específica</div>
                  <div className="text-sm text-muted-foreground">
                    Buscar o valor de uma célula (ex: B2)
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="column" id="mapping-column" />
                <Label htmlFor="mapping-column" className="flex-1 cursor-pointer">
                  <div className="font-medium">Coluna com cálculo</div>
                  <div className="text-sm text-muted-foreground">
                    Somar, contar ou calcular média de uma coluna
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {mappingType === "cell" ? (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="spreadsheet">Planilha</Label>
                <Select>
                  <SelectTrigger id="spreadsheet">
                    <SelectValue placeholder="Selecione uma planilha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Métricas Lançamento 2024</SelectItem>
                    <SelectItem value="2">Dashboard Perpétuo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheet">Aba</Label>
                <Select>
                  <SelectTrigger id="sheet">
                    <SelectValue placeholder="Selecione uma aba" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Leads</SelectItem>
                    <SelectItem value="2">Vendas</SelectItem>
                    <SelectItem value="3">Custos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell">Célula</Label>
                <Input
                  id="cell"
                  placeholder="Ex: B2, C10, F5..."
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Digite a referência da célula (ex: B2)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="spreadsheet-col">Planilha</Label>
                <Select>
                  <SelectTrigger id="spreadsheet-col">
                    <SelectValue placeholder="Selecione uma planilha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Métricas Lançamento 2024</SelectItem>
                    <SelectItem value="2">Dashboard Perpétuo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheet-col">Aba</Label>
                <Select>
                  <SelectTrigger id="sheet-col">
                    <SelectValue placeholder="Selecione uma aba" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Leads</SelectItem>
                    <SelectItem value="2">Vendas</SelectItem>
                    <SelectItem value="3">Custos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="column">Coluna</Label>
                  <Input
                    id="column"
                    placeholder="Ex: D"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-row">Linha inicial</Label>
                  <Input
                    id="start-row"
                    type="number"
                    placeholder="2"
                    defaultValue="2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aggregation">Tipo de cálculo</Label>
                <Select defaultValue="sum">
                  <SelectTrigger id="aggregation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Somar valores</SelectItem>
                    <SelectItem value="count">Contar linhas</SelectItem>
                    <SelectItem value="avg">Calcular média</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={handleCreate}
              disabled={!metricName.trim() || selectedSections.length === 0}
            >
              Criar métrica
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMetricDialog;
