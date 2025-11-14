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

interface MetricConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: {
    id: string;
    name: string;
    value: number;
    valueType: "number" | "currency" | "percent";
  } | null;
}

const MetricConfigDialog = ({ open, onOpenChange, metric }: MetricConfigDialogProps) => {
  const [mappingType, setMappingType] = useState<"cell" | "column">("cell");
  const [manualValue, setManualValue] = useState("");

  if (!metric) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuração da Métrica: {metric.name}</DialogTitle>
          <DialogDescription>
            Configure como esta métrica deve buscar dados do Google Sheets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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

          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-4 block">
              Ajuste Manual (Opcional)
            </Label>
            <div className="space-y-2">
              <Label htmlFor="manual-value">Sobrescrever valor</Label>
              <Input
                id="manual-value"
                type="number"
                step="any"
                placeholder="Deixe em branco para usar valor calculado"
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Se preenchido, este valor será exibido ao invés do calculado automaticamente
              </p>
            </div>
          </div>

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
              onClick={() => {
                // TODO: Save configuration
                onOpenChange(false);
              }}
            >
              Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetricConfigDialog;
