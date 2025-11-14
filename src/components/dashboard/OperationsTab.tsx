import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Plus, Trash2, AlertTriangle, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: string;
}

interface Tracker {
  id: string;
  name: string;
  type: "creative" | "campaign";
  status: "active" | "paused" | "testing";
  cpl?: number;
  roas?: number;
  spend?: number;
}

interface AutomationAlert {
  id: string;
  type: "cpl_spike" | "revenue_drop" | "leads_below_curve" | "roas_low";
  message: string;
  severity: "warning" | "critical";
  timestamp: string;
}

const mockChecklist: ChecklistItem[] = [
  { id: "1", text: "Verificar métricas do dia", completed: true, time: "08:00" },
  { id: "2", text: "Analisar CPL por fonte", completed: true, time: "09:00" },
  { id: "3", text: "Ajustar orçamentos de campanha", completed: false, time: "10:00" },
  { id: "4", text: "Revisar criativos em teste", completed: false, time: "14:00" },
  { id: "5", text: "Atualizar relatório diário", completed: false, time: "17:00" },
];

const mockTrackers: Tracker[] = [
  { id: "1", name: "Campanha Facebook - Vídeo 1", type: "campaign", status: "active", cpl: 12.3, roas: 3.2, spend: 450 },
  { id: "2", name: "Criativo Estático - Dor 1", type: "creative", status: "testing", cpl: 15.8, roas: 2.1, spend: 120 },
  { id: "3", name: "Campanha Google - Pesquisa", type: "campaign", status: "active", cpl: 10.5, roas: 4.5, spend: 680 },
  { id: "4", name: "Criativo Carrossel - Benefícios", type: "creative", status: "paused", cpl: 18.2, roas: 1.8, spend: 90 },
];

const mockAutomationAlerts: AutomationAlert[] = [
  {
    id: "1",
    type: "cpl_spike",
    message: "CPL subiu 24% nas últimas 6 horas (de R$ 12,30 para R$ 15,25)",
    severity: "warning",
    timestamp: "Há 2 horas",
  },
  {
    id: "2",
    type: "roas_low",
    message: "ROAS abaixo da meta de 3.0x (atual: 2.4x)",
    severity: "critical",
    timestamp: "Há 4 horas",
  },
];

export const OperationsTab = () => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(mockChecklist);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [trackers] = useState<Tracker[]>(mockTrackers);
  const [automationAlerts] = useState<AutomationAlert[]>(mockAutomationAlerts);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: ChecklistItem = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };
    
    setChecklist(prev => [...prev, newTask]);
    setNewTaskText("");
    
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa criada no checklist.",
    });
  };

  const removeTask = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: new Date().toLocaleString('pt-BR'),
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote("");
    
    toast({
      title: "Nota salva",
      description: "Anotação adicionada com sucesso.",
    });
  };

  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusBadge = (status: Tracker['status']) => {
    const variants = {
      active: "default",
      paused: "secondary",
      testing: "outline",
    } as const;
    
    const labels = {
      active: "Ativa",
      paused: "Pausada",
      testing: "Testando",
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getAlertIcon = (type: AutomationAlert['type']) => {
    switch (type) {
      case "cpl_spike":
        return <TrendingUp className="w-4 h-4" />;
      case "revenue_drop":
        return <TrendingDown className="w-4 h-4" />;
      case "leads_below_curve":
        return <Target className="w-4 h-4" />;
      case "roas_low":
        return <Zap className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Status do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Status do Dia
          </CardTitle>
          <CardDescription>
            Resumo rápido das operações diárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Checklist concluído</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
              <div className="text-sm text-muted-foreground">Tarefas realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{trackers.filter(t => t.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Campanhas ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{automationAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Alertas automáticos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Checklist Diário */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist Diário</CardTitle>
            <CardDescription>
              Tarefas e rotinas do dia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                  />
                  <div className="flex-1">
                    <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                      {item.text}
                    </span>
                    {item.time && (
                      <span className="text-xs text-muted-foreground ml-2">({item.time})</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeTask(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex gap-2">
              <Input
                placeholder="Nova tarefa..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notas do Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Notas do Dia</CardTitle>
            <CardDescription>
              Anotações e observações importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                placeholder="Adicionar nova nota..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button onClick={addNote} size="sm" className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Nota
              </Button>
            </div>

            <Separator />

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma nota ainda. Adicione observações importantes sobre o dia.
                </p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">{note.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Automáticos */}
      {automationAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              Alertas Automáticos
            </CardTitle>
            <CardDescription>
              Automações detectaram variações importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {automationAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.severity === "critical"
                    ? "bg-destructive/10 border-destructive/20"
                    : "bg-orange-100/50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={alert.severity === "critical" ? "text-destructive" : "text-orange-600"}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                  <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                    {alert.severity === "critical" ? "Crítico" : "Atenção"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trackers de Campanhas e Criativos */}
      <Card>
        <CardHeader>
          <CardTitle>Trackers de Campanhas e Criativos</CardTitle>
          <CardDescription>
            Acompanhamento em tempo real das campanhas ativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trackers.map((tracker) => (
              <div
                key={tracker.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {tracker.type === "campaign" ? "Campanha" : "Criativo"}
                    </Badge>
                    {getStatusBadge(tracker.status)}
                  </div>
                  <h4 className="font-semibold">{tracker.name}</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CPL</span>
                    <p className="font-semibold text-lg">
                      R$ {tracker.cpl?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROAS</span>
                    <p className="font-semibold text-lg">
                      {tracker.roas?.toFixed(1)}x
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Investido</span>
                    <p className="font-semibold text-lg">
                      R$ {tracker.spend?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
