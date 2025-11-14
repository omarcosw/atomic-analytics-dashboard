import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileJson, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface ExportDataDialogProps {
  projectData: {
    id: string;
    name: string;
    metrics: any[];
    snapshots?: any[];
    goals?: any;
    alerts?: any[];
    forecasts?: any[];
  };
}

export const ExportDataDialog = ({ projectData }: ExportDataDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const prepareExportData = () => {
    return {
      project: {
        id: projectData.id,
        name: projectData.name,
        exportDate: new Date().toISOString(),
      },
      metrics: projectData.metrics.map(m => ({
        nome: m.name,
        valor: m.value,
        tipo: m.valueType,
        manual: m.overriddenValue ? 'Sim' : 'Não',
      })),
      snapshots: projectData.snapshots || [],
      metas: projectData.goals || {},
      alertas: projectData.alerts || [],
      projecoes: projectData.forecasts || [],
    };
  };

  const exportAsJSON = () => {
    const data = prepareExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída",
      description: "Arquivo JSON baixado com sucesso.",
    });
    setOpen(false);
  };

  const exportAsCSV = () => {
    const data = prepareExportData();
    
    // Criar CSV com múltiplas seções
    let csv = '=== INFORMAÇÕES DO PROJETO ===\n';
    csv += `Nome,${data.project.name}\n`;
    csv += `ID,${data.project.id}\n`;
    csv += `Data de Exportação,${new Date(data.project.exportDate).toLocaleString('pt-BR')}\n\n`;
    
    csv += '=== MÉTRICAS ===\n';
    csv += 'Nome,Valor,Tipo,Manual\n';
    data.metrics.forEach(m => {
      csv += `${m.nome},${m.valor},${m.tipo},${m.manual}\n`;
    });
    
    csv += '\n=== METAS ===\n';
    csv += 'Tipo,Valor\n';
    if (data.metas) {
      Object.entries(data.metas).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
    }
    
    if (data.snapshots && data.snapshots.length > 0) {
      csv += '\n=== SNAPSHOTS ===\n';
      const snapshotKeys = Object.keys(data.snapshots[0]);
      csv += snapshotKeys.join(',') + '\n';
      data.snapshots.forEach(snapshot => {
        csv += snapshotKeys.map(key => snapshot[key]).join(',') + '\n';
      });
    }
    
    if (data.alertas && data.alertas.length > 0) {
      csv += '\n=== ALERTAS ===\n';
      csv += 'Tipo,Mensagem,Data\n';
      data.alertas.forEach(alert => {
        csv += `${alert.type || ''},${alert.message || ''},${alert.date || ''}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída",
      description: "Arquivo CSV baixado com sucesso.",
    });
    setOpen(false);
  };

  const exportAsXLSX = () => {
    const data = prepareExportData();
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Aba: Informações do Projeto
    const projectInfo = [
      ['Nome do Projeto', data.project.name],
      ['ID', data.project.id],
      ['Data de Exportação', new Date(data.project.exportDate).toLocaleString('pt-BR')],
    ];
    const wsProject = XLSX.utils.aoa_to_sheet(projectInfo);
    XLSX.utils.book_append_sheet(wb, wsProject, 'Projeto');
    
    // Aba: Métricas
    const wsMetrics = XLSX.utils.json_to_sheet(data.metrics);
    XLSX.utils.book_append_sheet(wb, wsMetrics, 'Métricas');
    
    // Aba: Metas
    if (data.metas && Object.keys(data.metas).length > 0) {
      const metasArray = Object.entries(data.metas).map(([key, value]) => ({
        Tipo: key,
        Valor: value,
      }));
      const wsMetas = XLSX.utils.json_to_sheet(metasArray);
      XLSX.utils.book_append_sheet(wb, wsMetas, 'Metas');
    }
    
    // Aba: Snapshots
    if (data.snapshots && data.snapshots.length > 0) {
      const wsSnapshots = XLSX.utils.json_to_sheet(data.snapshots);
      XLSX.utils.book_append_sheet(wb, wsSnapshots, 'Snapshots');
    }
    
    // Aba: Alertas
    if (data.alertas && data.alertas.length > 0) {
      const wsAlertas = XLSX.utils.json_to_sheet(data.alertas);
      XLSX.utils.book_append_sheet(wb, wsAlertas, 'Alertas');
    }
    
    // Aba: Projeções
    if (data.projecoes && data.projecoes.length > 0) {
      const wsProjecoes = XLSX.utils.json_to_sheet(data.projecoes);
      XLSX.utils.book_append_sheet(wb, wsProjecoes, 'Projeções');
    }
    
    // Gerar arquivo
    XLSX.writeFile(wb, `${projectData.name}_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Exportação concluída",
      description: "Arquivo Excel baixado com sucesso.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Dados do Projeto</DialogTitle>
          <DialogDescription>
            Escolha o formato de exportação para baixar todos os dados do projeto
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button
            onClick={exportAsXLSX}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-semibold">Excel (XLSX)</div>
              <div className="text-xs text-muted-foreground">
                Múltiplas abas com métricas, metas, snapshots e alertas
              </div>
            </div>
          </Button>

          <Button
            onClick={exportAsCSV}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold">CSV</div>
              <div className="text-xs text-muted-foreground">
                Arquivo de texto separado por vírgulas
              </div>
            </div>
          </Button>

          <Button
            onClick={exportAsJSON}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-4"
          >
            <FileJson className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-semibold">JSON</div>
              <div className="text-xs text-muted-foreground">
                Formato estruturado para integração com outros sistemas
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
