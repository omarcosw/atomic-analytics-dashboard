import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompareProjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProject: {
    id: string;
    name: string;
  };
}

// Mock data - replace with real data
const mockProjects = [
  { id: "1", name: "Lançamento Novembro 2024" },
  { id: "2", name: "Perpétuo - Comunidade Elite" },
  { id: "3", name: "Lançamento Outubro 2024" },
];

const mockComparisonData = {
  project1: {
    leads: 1247,
    revenue: 47580,
    ticket: 247,
    roi: 285,
    conversion: 3.8,
  },
  project2: {
    leads: 842,
    revenue: 28450,
    ticket: 337,
    roi: 320,
    conversion: 4.2,
  },
};

const mockRevenueComparison = [
  { day: "Dia 1", project1: 2450, project2: 1800 },
  { day: "Dia 2", project1: 3200, project2: 2100 },
  { day: "Dia 3", project1: 2800, project2: 2400 },
  { day: "Dia 4", project1: 4100, project2: 3200 },
  { day: "Dia 5", project1: 3850, project2: 2950 },
  { day: "Dia 6", project1: 5200, project2: 4100 },
  { day: "Dia 7", project1: 4900, project2: 3800 },
];

const CompareProjectsDialog = ({ open, onOpenChange, currentProject }: CompareProjectsDialogProps) => {
  const [compareProject, setCompareProject] = useState<string>("");

  const data1 = mockComparisonData.project1;
  const data2 = mockComparisonData.project2;

  const renderComparisonCard = (
    title: string,
    value1: number,
    value2: number,
    format: "number" | "currency" | "percent",
    icon: React.ReactNode
  ) => {
    const diff = value1 - value2;
    const percentDiff = ((diff / value2) * 100);
    const isPositive = diff > 0;

    const formatValue = (val: number) => {
      if (format === "currency") {
        return `R$ ${val.toLocaleString('pt-BR')}`;
      }
      if (format === "percent") {
        return `${val.toFixed(1)}%`;
      }
      return val.toLocaleString('pt-BR');
    };

    return (
      <Card className="border-2 border-border/50 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {formatValue(value1)}
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div className="text-2xl font-bold text-muted-foreground">
                {formatValue(value2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-accent" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                {isPositive ? "+" : ""}{percentDiff.toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground">
                {isPositive ? "melhor" : "pior"} que o comparado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Comparar Projetos</DialogTitle>
          <DialogDescription>
            Compare o desempenho entre diferentes projetos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Projeto Principal</label>
              <div className="p-3 rounded-lg border-2 border-primary/30 bg-primary/5">
                <p className="font-semibold">{currentProject.name}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comparar com</label>
              <Select value={compareProject} onValueChange={setCompareProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects
                    .filter(p => p.id !== currentProject.id)
                    .map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {compareProject && (
            <>
              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderComparisonCard(
                  "Leads",
                  data1.leads,
                  data2.leads,
                  "number",
                  <Users className="w-4 h-4" />
                )}
                {renderComparisonCard(
                  "Receita",
                  data1.revenue,
                  data2.revenue,
                  "currency",
                  <DollarSign className="w-4 h-4" />
                )}
                {renderComparisonCard(
                  "Ticket Médio",
                  data1.ticket,
                  data2.ticket,
                  "currency",
                  <Target className="w-4 h-4" />
                )}
                {renderComparisonCard(
                  "ROI",
                  data1.roi,
                  data2.roi,
                  "percent",
                  <TrendingUp className="w-4 h-4" />
                )}
                {renderComparisonCard(
                  "Conversão",
                  data1.conversion,
                  data2.conversion,
                  "percent",
                  <Target className="w-4 h-4" />
                )}
              </div>

              {/* Revenue Overlay Chart */}
              <Card className="border-2 border-border/50 rounded-2xl">
                <CardHeader>
                  <CardTitle>Comparação de Receita Diária</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockRevenueComparison}>
                      <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.2} />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={13} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={13} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '2px solid hsl(var(--border))',
                          borderRadius: '12px',
                          padding: '12px',
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="project1" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                        name={currentProject.name}
                        dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="project2" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={3}
                        name="Projeto Comparado"
                        dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareProjectsDialog;
