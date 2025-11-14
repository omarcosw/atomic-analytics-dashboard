import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, RefreshCw, Settings, BarChart3, TrendingUp, Users, DollarSign, Target, Bell, ExternalLink, Copy, CheckCircle2, FileText, Sparkles, ClipboardCheck, History, Image as ImageIcon, Presentation, FileDown, StickyNote, FileSpreadsheet, AlertCircle, Layout } from "lucide-react";
import { hasConnectedSource } from "@/data/userMappings";
import { useLayoutConfig } from "@/hooks/useLayoutConfig";
import { useAuthFake } from "@/hooks/useAuthFake";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SourceStatusBanner } from "@/components/dashboard/SourceStatusBanner";
import { DashboardActionsBar } from "@/components/dashboard/DashboardActionsBar";
import MetricCard from "@/components/dashboard/MetricCard";
import HeroMetricCard from "@/components/dashboard/HeroMetricCard";
import { MetricCardSkeleton, HeroMetricCardSkeleton, ChartSkeleton } from "@/components/dashboard/MetricCardSkeleton";
import MetricConfigDialog from "@/components/dashboard/MetricConfigDialog";
import AddMetricDialog from "@/components/dashboard/AddMetricDialog";
import DashboardConfigDialog from "@/components/dashboard/DashboardConfigDialog";
import AlertsGoalsTab from "@/components/dashboard/AlertsGoalsTab";
import DebriefTab from "@/components/dashboard/DebriefTab";
import ForecastCard from "@/components/dashboard/ForecastCard";
import CompareProjectsDialog from "@/components/dashboard/CompareProjectsDialog";
import AIAssistantTab from "@/components/dashboard/AIAssistantTab";
import { ExportDataDialog } from "@/components/dashboard/ExportDataDialog";
import { OperationsTab } from "@/components/dashboard/OperationsTab";
import { AuditTab } from "@/components/dashboard/AuditTab";
import { VisualHistoryTab } from "@/components/dashboard/VisualHistoryTab";
import { ExecutiveView } from "@/components/dashboard/ExecutiveView";
import { NotesTab } from "@/components/dashboard/NotesTab";
import { LayoutConfigPanel } from "@/components/dashboard/LayoutConfigPanel";
import { ChartCard } from "@/components/ChartCard";
import { useMetricsCache } from "@/hooks/useMetricsCache";
import { cacheManager } from "@/utils/cacheManager";
import { useReplayMode } from "@/hooks/useReplayMode";
import { ReplayControls } from "@/components/dashboard/ReplayControls";
import { ProjectExportImportDialog } from "@/components/dashboard/ProjectExportImportDialog";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  allDemoCharts, 
  faturamentoDiarioData, 
  leadsPorDiaData, 
  leadsVsVendasData, 
  receitaPorOrigemData,
  funnelData,
  conversaoPorEtapaData,
  cplPorOrigemData,
  investimentoPorOrigemData,
  cliquesPorDiaData,
  ctrPorCampanhaData,
  receitaAcumuladaData,
  receitaPorProdutoData,
  ticketDistribuicaoData,
  leadsPorOrigemData,
  ltvPorOrigemData,
  retencaoData
} from "@/data/demoCharts";

// Mock data - métricas expandidas organizadas por aba
const mockMetrics = {
  // Visão Geral (todos)
  faturamento: { id: "1", name: "Faturamento Total", value: 47580.50, valueType: "currency" as const, isOverridden: false, trend: 12.6, goal: 120000, sparklineData: [2800, 3200, 2900, 4100, 3800, 5100, 4700] },
  leads: { id: "2", name: "Leads Captados", value: 1247, valueType: "number" as const, isOverridden: false, trend: 8.2, sparklineData: [48, 60, 52, 74, 69, 88, 81] },
  conversao: { id: "3", name: "Taxa de Conversão", value: 3.8, valueType: "percent" as const, isOverridden: true, trend: -2.1, sparklineData: [3.5, 3.9, 3.7, 4.1, 3.6, 3.8, 3.8] },
  ticket: { id: "4", name: "Ticket Médio", value: 247.00, valueType: "currency" as const, isOverridden: false, trend: 3.2, sparklineData: [240, 245, 238, 250, 242, 248, 247] },
  roi: { id: "5", name: "ROI", value: 285, valueType: "percent" as const, isOverridden: false, trend: 18.5, sparklineData: [220, 245, 260, 275, 270, 280, 285] },
  cpl: { id: "6", name: "CPL (Custo por Lead)", value: 12.50, valueType: "currency" as const, isOverridden: false, trend: -5.4, sparklineData: [14, 13.5, 12.8, 13.2, 12.1, 11.9, 12.5] },
  rpl: { id: "7", name: "Receita por Lead", value: 38.15, valueType: "currency" as const, isOverridden: false, trend: 4.8, sparklineData: [35, 37, 36, 39, 38, 40, 38] },
  investimento: { id: "8", name: "Investimento Total", value: 15580.00, valueType: "currency" as const, isOverridden: false, trend: 9.3, sparklineData: [14200, 14800, 15100, 15300, 15450, 15520, 15580] },
  checkouts: { id: "9", name: "Checkouts Iniciados", value: 342, valueType: "number" as const, isOverridden: false, trend: 18.7, sparklineData: [45, 52, 48, 58, 54, 62, 63] },
  vendas: { id: "10", name: "Vendas Confirmadas", value: 298, valueType: "number" as const, isOverridden: false, trend: 15.2, sparklineData: [38, 44, 41, 50, 46, 54, 55] },
  leadsQualificados: { id: "11", name: "Leads Qualificados", value: 986, valueType: "number" as const, isOverridden: false, trend: 22.4, sparklineData: [120, 145, 135, 165, 155, 180, 186] },
  
  // Funil
  visitas: { id: "f1", name: "Visitas na Página", value: 32000, valueType: "number" as const, isOverridden: false, trend: 15.3, sparklineData: [2800, 3200, 3100, 4200, 4500, 4800, 4600] },
  cliquesCta: { id: "f2", name: "Cliques no CTA", value: 8420, valueType: "number" as const, isOverridden: false, trend: 12.1, sparklineData: [720, 850, 810, 1100, 1150, 1230, 1180] },
  taxaVisitaLead: { id: "f3", name: "Taxa Visita → Lead", value: 3.9, valueType: "percent" as const, isOverridden: false, trend: -0.8, sparklineData: [4.2, 4.0, 3.9, 3.8, 3.9, 3.9, 3.9] },
  taxaLeadCheckout: { id: "f4", name: "Taxa Lead → Checkout", value: 27.4, valueType: "percent" as const, isOverridden: false, trend: 5.2, sparklineData: [24, 25, 26, 28, 27, 28, 27] },
  taxaCheckoutVenda: { id: "f5", name: "Taxa Checkout → Venda", value: 87.1, valueType: "percent" as const, isOverridden: false, trend: 2.3, sparklineData: [84, 85, 86, 88, 87, 88, 87] },
  
  // Tráfego
  ctr: { id: "t1", name: "CTR Médio", value: 6.15, valueType: "percent" as const, isOverridden: false, trend: 8.7, sparklineData: [5.2, 5.6, 5.8, 6.2, 6.1, 6.3, 6.15] },
  cpc: { id: "t2", name: "CPC Médio", value: 0.49, valueType: "currency" as const, isOverridden: false, trend: -3.2, sparklineData: [0.52, 0.51, 0.50, 0.48, 0.49, 0.49, 0.49] },
  cpm: { id: "t3", name: "CPM Médio", value: 28.50, valueType: "currency" as const, isOverridden: false, trend: -5.8, sparklineData: [32, 31, 30, 28, 29, 28, 28.5] },
  cliques: { id: "t4", name: "Cliques Totais", value: 31840, valueType: "number" as const, isOverridden: false, trend: 18.2, sparklineData: [2700, 3100, 3200, 4200, 4400, 4800, 4640] },
  impressoes: { id: "t5", name: "Impressões Totais", value: 520000, valueType: "number" as const, isOverridden: false, trend: 12.5, sparklineData: [45000, 52000, 54000, 68000, 72000, 76000, 75000] },
  
  // Receita
  receitaHoje: { id: "r1", name: "Receita Hoje", value: 4700.00, valueType: "currency" as const, isOverridden: false, trend: 8.3, sparklineData: [2800, 3200, 2900, 4100, 3800, 5100, 4700] },
  receitaProjetada: { id: "r2", name: "Receita Projetada", value: 125000.00, valueType: "currency" as const, isOverridden: false, trend: 4.2, sparklineData: [95000, 102000, 108000, 115000, 118000, 122000, 125000] },
  receitaProdutoA: { id: "r3", name: "Produto Principal", value: 32500.00, valueType: "currency" as const, isOverridden: false, trend: 15.8, sparklineData: [1800, 2400, 2100, 3200, 3100, 4200, 3900] },
  receitaProdutoB: { id: "r4", name: "Produto Complementar", value: 11080.50, valueType: "currency" as const, isOverridden: false, trend: 9.2, sparklineData: [500, 700, 600, 900, 750, 1000, 1000] },
  receitaProdutoC: { id: "r5", name: "Upsell/Cross-sell", value: 4000.00, valueType: "currency" as const, isOverridden: false, trend: 22.4, sparklineData: [150, 100, 100, 0, 0, 800, 0] },
  
  // Leads & LTV
  ltv: { id: "l1", name: "LTV Médio", value: 327.00, valueType: "currency" as const, isOverridden: false, trend: 6.5, sparklineData: [298, 305, 312, 318, 322, 325, 327] },
  percLeadsQualificados: { id: "l2", name: "% Leads Qualificados", value: 79.1, valueType: "percent" as const, isOverridden: false, trend: 3.8, sparklineData: [75, 76, 77, 78, 79, 80, 79] },
  ltvTop20: { id: "l3", name: "LTV Top 20%", value: 845.00, valueType: "currency" as const, isOverridden: false, trend: 8.2, sparklineData: [780, 795, 810, 825, 835, 840, 845] },
  churn: { id: "l4", name: "Churn", value: 3.2, valueType: "percent" as const, isOverridden: false, trend: -8.3, sparklineData: [4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.2] },
  clientesAtivos: { id: "l5", name: "Clientes Ativos", value: 1420, valueType: "number" as const, isOverridden: false, trend: 11.5, sparklineData: [1100, 1180, 1240, 1300, 1360, 1400, 1420] },
};

// Mock data para gráficos - TODOS com dados demo completos
const revenueData = [
  { date: "01/12", value: 2800 },
  { date: "02/12", value: 3200 },
  { date: "03/12", value: 2900 },
  { date: "04/12", value: 4100 },
  { date: "05/12", value: 3800 },
  { date: "06/12", value: 5100 },
  { date: "07/12", value: 4700 },
];

const leadsData = [
  { date: "01/12", value: 48 },
  { date: "02/12", value: 60 },
  { date: "03/12", value: 52 },
  { date: "04/12", value: 74 },
  { date: "05/12", value: 69 },
  { date: "06/12", value: 88 },
  { date: "07/12", value: 81 },
];

const leadsVsSalesData = [
  { date: "01/12", leads: 48, sales: 38 },
  { date: "02/12", leads: 60, sales: 44 },
  { date: "03/12", leads: 52, sales: 41 },
  { date: "04/12", leads: 74, sales: 50 },
  { date: "05/12", leads: 69, sales: 46 },
  { date: "06/12", leads: 88, sales: 54 },
  { date: "07/12", leads: 81, sales: 55 },
];

const revenueBySourceData = [
  { source: "Meta Ads", revenue: 28500 },
  { source: "Google Ads", revenue: 9700 },
  { source: "Orgânico", revenue: 5200 },
  { source: "Direto", revenue: 3800 },
  { source: "Parceiros", revenue: 2300 },
];

const cplBySourceData = [
  { source: "Meta Ads", cpl: 12.50 },
  { source: "Google Ads", cpl: 9.30 },
  { source: "Orgânico", cpl: 4.10 },
];

const ProjectDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthFake();

  // Proteção de rota - redirecionar para login se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Sistema de cache para métricas
  const {
    metrics,
    isLoading: metricsLoading,
    refreshMetrics,
    updateSingleMetric,
    isCached
  } = useMetricsCache(id || "");
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isAddMetricDialogOpen, setIsAddMetricDialogOpen] = useState(false);
  const [isDashboardConfigOpen, setIsDashboardConfigOpen] = useState(false);
  const [isLayoutConfigOpen, setIsLayoutConfigOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("visao-geral");
  
  // Hook de configuração de layout
  const layoutConfig = useLayoutConfig();
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isExportImportDialogOpen, setIsExportImportDialogOpen] = useState(false);
  const [isExecutiveMode, setIsExecutiveMode] = useState(false);
  
  // Modo Replay (Time Travel Analytics)
  const {
    isReplayMode,
    replayDate,
    snapshotData,
    isLoading: replayLoading,
    availableDates,
    enterReplayMode,
    exitReplayMode,
    navigateToDate,
    loadAvailableDates,
  } = useReplayMode(id || "");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Dashboard state
  const [isActive, setIsActive] = useState(false);
  const [publicSlug] = useState(`dashboard-${id}`);
  
  // Dashboard configuration
  const [dashboardConfig, setDashboardConfig] = useState({
    visibleSections: {
      overview: true,
      funnel: true,
      traffic: true,
      revenue: true,
      leads: true,
      alerts: true,
    },
    customSections: [] as Array<{ id: string; name: string; icon: string }>,
  });

  // Mapa de métricas (ID -> nome e tipo)
  const metricsMap = useMemo(() => ({
    faturamento: { name: "Faturamento Total", valueType: "currency" },
    leads: { name: "Leads Captados", valueType: "number" },
    conversao: { name: "Taxa de Conversão", valueType: "percent" },
    ticket: { name: "Ticket Médio", valueType: "currency" },
    roi: { name: "ROI", valueType: "percent" },
    cpl: { name: "CPL (Custo por Lead)", valueType: "currency" },
    investimento: { name: "Investimento", valueType: "currency" },
    vendas: { name: "Vendas Confirmadas", valueType: "number" },
    roas: { name: "ROAS", valueType: "percent" },
    checkout: { name: "Checkouts Iniciados", valueType: "number" },
    abandono: { name: "Taxa de Abandono", valueType: "percent" },
    visitantes: { name: "Visitantes", valueType: "number" },
    visitas: { name: "Visitas à LP", valueType: "number" },
    cliquesCta: { name: "Cliques no CTA", valueType: "number" },
    ctr: { name: "CTR", valueType: "percent" },
    cpc: { name: "CPC", valueType: "currency" },
    cpm: { name: "CPM", valueType: "currency" },
    cliques: { name: "Cliques", valueType: "number" },
    impressoes: { name: "Impressões", valueType: "number" },
    leadsQualificados: { name: "Leads Qualificados", valueType: "number" },
    ltv: { name: "LTV Total", valueType: "currency" },
    ltvMedio: { name: "LTV Médio", valueType: "currency" },
    ltvPorCliente: { name: "LTV por Cliente", valueType: "currency" },
    churn: { name: "Churn Rate", valueType: "percent" },
    clientesAtivos: { name: "Clientes Ativos", valueType: "number" },
    conversaoVisitaLead: { name: "Visita → Lead", valueType: "percent" },
    conversaoLeadCheckout: { name: "Lead → Checkout", valueType: "percent" },
    conversaoCheckoutVenda: { name: "Checkout → Venda", valueType: "percent" },
    conversaoGeral: { name: "Conversão Geral", valueType: "percent" },
    previsaoReceita: { name: "Previsão de Receita", valueType: "currency" },
    metaLeads: { name: "Meta de Leads", valueType: "number" },
    metaReceita: { name: "Meta de Receita", valueType: "currency" },
    metaCPL: { name: "CPL Máximo", valueType: "currency" },
    metaROI: { name: "ROI Mínimo", valueType: "percent" },
    rpl: { name: "Receita por Lead", valueType: "currency" },
    checkouts: { name: "Checkouts Iniciados", valueType: "number" },
    taxaVisitaLead: { name: "Taxa Visita → Lead", valueType: "percent" },
    taxaLeadCheckout: { name: "Taxa Lead → Checkout", valueType: "percent" },
    taxaCheckoutVenda: { name: "Taxa Checkout → Venda", valueType: "percent" },
  }), []);

  // Mapa de gráficos (ID -> nome)
  const chartsMap = useMemo(() => ({
    faturamentoDiario: { name: "Faturamento Diário" },
    leadsPorDia: { name: "Leads por Dia" },
    leadsVsVendas: { name: "Leads x Vendas" },
    receitaPorOrigem: { name: "Receita por Origem" },
    funnelData: { name: "Funil de Conversão" },
    conversaoPorEtapa: { name: "Conversão por Etapa" },
    cplPorOrigem: { name: "CPL por Origem" },
    investimentoPorOrigem: { name: "Investimento por Origem" },
    ctrPorCampanha: { name: "CTR por Campanha" },
    cliquesPorDia: { name: "Cliques por Dia" },
    receitaAcumulada: { name: "Receita Acumulada" },
    receitaPorProduto: { name: "Receita por Produto" },
    ticketDistribuicao: { name: "Distribuição de Ticket" },
    leadsPorOrigem: { name: "Leads por Origem" },
    ltvPorOrigem: { name: "LTV por Origem" },
    retencaoData: { name: "Retenção e Churn" },
  }), []);

  // Carregar datas disponíveis ao montar
  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  // Aplicar dados do snapshot quando em modo replay
  const displayMetrics = useMemo(() => {
    if (isReplayMode && snapshotData && snapshotData.metrics_data) {
      return snapshotData.metrics_data;
    }
    return metrics.length > 0 ? metrics : Object.values(mockMetrics);
  }, [isReplayMode, snapshotData, metrics]);

  // Atualização inteligente de métricas
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      await refreshMetrics(async () => {
        // Simular fetch de métricas
        // Em produção, isso viria do Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Object.values(mockMetrics);
      });
      
      // Invalidar cache de gráficos ao atualizar métricas
      cacheManager.invalidatePattern('chart-');
      
      setLastUpdate(new Date());
      
      toast({
        title: isCached ? "Cache atualizado!" : "Métricas carregadas!",
        description: `${metrics.length} métricas ${isCached ? 're-validadas' : 'carregadas'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as métricas.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshMetrics, isCached, metrics.length, toast]);

  const handleMetricClick = useCallback((metric: any) => {
    setSelectedMetric(metric);
    setIsConfigDialogOpen(true);
  }, []);

  const handleCreateMetric = useCallback((newMetric: any) => {
    refreshMetrics(async () => [...metrics, newMetric]);
    toast({
      title: "Métrica criada",
      description: `A métrica "${newMetric.name}" foi adicionada ao dashboard.`,
    });
  }, [metrics, refreshMetrics, toast]);

  const handleActivateDashboard = () => {
    setIsActive(true);
    const publicUrl = `${window.location.origin}/d/${publicSlug}`;
    window.open(publicUrl, "_blank");
    toast({
      title: "Dashboard ativado!",
      description: "Link público gerado com sucesso.",
    });
  };

  const handleDeactivateDashboard = () => {
    setIsActive(false);
    toast({
      title: "Dashboard desativado",
      description: "O link público não está mais acessível.",
    });
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/d/${publicSlug}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copiado!",
      description: "O link do dashboard foi copiado para a área de transferência.",
    });
  };

  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return "agora mesmo";
    if (minutes === 1) return "há 1 minuto";
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "há 1 hora";
    return `há ${hours} horas`;
  };

  // Memoizar cálculo de seções disponíveis
  const availableSections = useMemo(() => {
    const defaultSections = [
      { id: "overview", name: "Visão Geral" },
      { id: "funnel", name: "Funil" },
      { id: "traffic", name: "Tráfego" },
      { id: "revenue", name: "Receita" },
      { id: "leads", name: "Leads & LTV" },
      { id: "alerts", name: "Alertas & Metas" },
    ];
    const customSectionsList = dashboardConfig.customSections.map(s => ({
      id: s.id,
      name: s.name,
    }));
    return [...defaultSections, ...customSectionsList];
  }, [dashboardConfig.customSections]);

  // Memoizar abas visíveis
  const visibleTabs = useMemo(() => {
    const tabs = [];
    if (dashboardConfig.visibleSections.overview) {
      tabs.push({ value: "overview", label: "Visão Geral", icon: BarChart3 });
    }
    if (dashboardConfig.visibleSections.funnel) {
      tabs.push({ value: "funnel", label: "Funil", icon: TrendingUp });
    }
    if (dashboardConfig.visibleSections.traffic) {
      tabs.push({ value: "traffic", label: "Tráfego", icon: Users });
    }
    if (dashboardConfig.visibleSections.revenue) {
      tabs.push({ value: "revenue", label: "Receita", icon: DollarSign });
    }
    if (dashboardConfig.visibleSections.leads) {
      tabs.push({ value: "leads", label: "Leads & LTV", icon: Target });
    }
    if (dashboardConfig.visibleSections.alerts) {
      tabs.push({ value: "alerts", label: "Alertas & Metas", icon: Bell });
    }
    tabs.push({ value: "operations", label: "Operação", icon: ClipboardCheck });
    tabs.push({ value: "notes", label: "Notas", icon: StickyNote });
    tabs.push({ value: "ai-assistant", label: "IA Assistente", icon: Sparkles });
    tabs.push({ value: "debrief", label: "Debrief", icon: FileText });
    tabs.push({ value: "audit", label: "Histórico", icon: History });
    tabs.push({ value: "visual-history", label: "Histórico Visual", icon: ImageIcon });
    
    dashboardConfig.customSections.forEach(section => {
      tabs.push({ value: section.id, label: section.name, icon: BarChart3 });
    });
    
    return tabs;
  }, [dashboardConfig]);

  // Não renderizar nada enquanto verifica autenticação
  if (!isAuthenticated) {
    return null;
  }

  // Se estiver em modo executivo, renderizar ExecutiveView
  if (isExecutiveMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/projects")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold">Lançamento Novembro 2024</h1>
                  <p className="text-sm text-muted-foreground">Modo Executivo</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExecutiveMode(false)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Voltar ao Dashboard Completo
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <ExecutiveView
            metrics={metrics}
            revenueData={revenueData}
            leadsData={leadsData}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Dashboard Header with Activation Controls */}
      <DashboardHeader 
        projectName="Lançamento Novembro 2024" 
        projectId={id || "1"}
      />

      {/* Container principal com espaçamento */}
      <div className="max-w-[1600px] mx-auto w-full px-8 py-6">
        {/* Data Source Banner */}
        <SourceStatusBanner />

        {/* Dashboard Actions Bar */}
        <DashboardActionsBar
          isExecutiveMode={isExecutiveMode}
          isReplayMode={isReplayMode}
          onToggleExecutiveMode={() => setIsExecutiveMode(!isExecutiveMode)}
          onToggleReplayMode={() => {
            if (isReplayMode) {
              exitReplayMode();
            } else {
              // enterReplayMode espera uma data como argumento
              const today = new Date();
              enterReplayMode(today);
            }
          }}
          onExportData={() => {
            // ExportDataDialog já tem seu próprio trigger, mas vamos manter para consistência
            toast({
              title: "Exportação iniciada",
              description: "Use o botão de exportação abaixo para baixar seus dados.",
            });
          }}
          onExportImport={() => setIsExportImportDialogOpen(true)}
          onRefresh={handleRefresh}
          onCompare={() => setIsCompareDialogOpen(true)}
          onConfigure={() => setIsDashboardConfigOpen(true)}
          onEditLayout={() => setIsLayoutConfigOpen(true)}
        />
      </div>

      {/* Replay Mode Controls */}
      {isReplayMode && (
        <div className="border-b border-border bg-card/50">
          <div className="max-w-[1600px] mx-auto px-8 py-3">
            <ReplayControls
              isReplayMode={isReplayMode}
              replayDate={replayDate}
              availableDates={availableDates}
              onEnterReplay={enterReplayMode}
              onExitReplay={exitReplayMode}
              onNavigateDate={navigateToDate}
              isLoading={replayLoading}
            />
          </div>
        </div>
      )}

      {/* Container principal de conteúdo */}
      <main className="flex-1 mx-auto w-full max-w-[1600px] px-8 py-8 bg-gradient-to-br from-[#F3F6FF] to-[#F9FBFF]" id="dashboard-content">
        <Tabs 
          defaultValue={visibleTabs[0]?.value || "overview"} 
          className="space-y-8"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList className="inline-flex w-auto p-1 rounded-xl" style={{ backgroundColor: '#EEF2FF' }}>
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-150"
                  style={{
                    color: '#7A7A7A'
                  }}
                  data-state-active-style={{
                    color: '#005CFF'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-12 animate-fade-in">
            {/* Cards de métricas */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Métricas Principais
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Resumo das métricas essenciais do seu lançamento
                  </p>
                </div>
                {!isReplayMode && (
                  <Button
                    size="default"
                    variant="outline"
                    className="text-primary hover:bg-primary/5 cursor-pointer border hover:border-primary/30"
                    onClick={() => setIsAddMetricDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Métrica
                  </Button>
                )}
              </div>
              
              {metricsLoading || isRefreshing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <HeroMetricCardSkeleton />
                  {[...Array(10)].map((_, i) => (
                    <MetricCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {/* Hero Card - Faturamento Total */}
                  <HeroMetricCard
                    metric={mockMetrics.faturamento as any}
                    onClick={() => !isReplayMode && handleMetricClick(mockMetrics.faturamento)}
                  />
                  
                  {/* Regular Metrics Cards */}
                  <MetricCard metric={mockMetrics.leads} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.leads)} />
                  <MetricCard metric={mockMetrics.conversao} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.conversao)} />
                  <MetricCard metric={mockMetrics.ticket} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.ticket)} />
                  <MetricCard metric={mockMetrics.roi} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.roi)} />
                  <MetricCard metric={mockMetrics.cpl} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.cpl)} />
                  <MetricCard metric={mockMetrics.rpl} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.rpl)} />
                  <MetricCard metric={mockMetrics.investimento} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.investimento)} />
                  <MetricCard metric={mockMetrics.checkouts} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.checkouts)} />
                  <MetricCard metric={mockMetrics.vendas} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.vendas)} />
                  <MetricCard metric={mockMetrics.leadsQualificados} onClick={() => !isReplayMode && handleMetricClick(mockMetrics.leadsQualificados)} />
                </div>
              )}
            </div>

            {/* Gráficos */}
            <div className="space-y-8">
              <div>
                <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                  Análise Visual
                </h2>
                <p className="text-sm text-muted-foreground">
                  Desempenho detalhado dos últimos 7 dias
                </p>
              </div>
              
              {metricsLoading || isRefreshing ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                  <ChartSkeleton title="Faturamento Diário" />
                  <ChartSkeleton title="Leads Captados" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {/* Faturamento Diário */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Faturamento Diário</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#005CFF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#005CFF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#005CFF"
                          strokeWidth={3}
                          fill="url(#colorRevenue)"
                          name="Faturamento"
                          dot={{ fill: '#005CFF', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Melhor dia: <span className="font-semibold" style={{ color: '#005CFF' }}>R$ 5.100</span>
                    </div>
                  </div>

                  {/* Leads Captados por Dia */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Leads Captados por Dia</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <AreaChart data={leadsData}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#colorLeads)"
                          name="Leads"
                          dot={{ fill: '#10B981', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Leads x Vendas */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Leads x Vendas por Dia</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={leadsVsSalesData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Legend wrapperStyle={{ paddingTop: '12px' }} iconType="circle" />
                        <Line 
                          type="monotone" 
                          dataKey="leads" 
                          stroke="#10B981"
                          strokeWidth={3}
                          name="Leads"
                          dot={{ fill: '#10B981', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales"
                          stroke="#005CFF"
                          strokeWidth={3}
                          name="Vendas"
                          dot={{ fill: '#005CFF', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Receita por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Receita por Origem</h3>
                      <p className="text-xs text-muted-foreground">Distribuição de receita</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={revenueBySourceData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="source" stroke="#7A7A7A" fontSize={11} fontWeight={500} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="revenue" fill="#005CFF" name="Receita" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              )}
            </div>
          </TabsContent>

          {dashboardConfig.visibleSections.funnel && (
            <TabsContent value="funnel" className="space-y-12 animate-fade-in">
              {/* Cards de Funil */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Métricas do Funil
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Entendendo vazamentos e taxas de conversão
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <MetricCard metric={mockMetrics.visitas} onClick={() => handleMetricClick(mockMetrics.visitas)} />
                  <MetricCard metric={mockMetrics.cliquesCta} onClick={() => handleMetricClick(mockMetrics.cliquesCta)} />
                  <MetricCard metric={mockMetrics.leads} onClick={() => handleMetricClick(mockMetrics.leads)} />
                  <MetricCard metric={mockMetrics.checkouts} onClick={() => handleMetricClick(mockMetrics.checkouts)} />
                  <MetricCard metric={mockMetrics.vendas} onClick={() => handleMetricClick(mockMetrics.vendas)} />
                  <MetricCard metric={mockMetrics.taxaVisitaLead} onClick={() => handleMetricClick(mockMetrics.taxaVisitaLead)} />
                  <MetricCard metric={mockMetrics.taxaLeadCheckout} onClick={() => handleMetricClick(mockMetrics.taxaLeadCheckout)} />
                  <MetricCard metric={mockMetrics.taxaCheckoutVenda} onClick={() => handleMetricClick(mockMetrics.taxaCheckoutVenda)} />
                </div>
              </div>

              {/* Gráficos de Funil */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Análise de Conversão
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Visualização do funil completo
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Funil Completo */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Funil Completo</h3>
                      <p className="text-xs text-muted-foreground">Impressões até vendas</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={allDemoCharts.funil.funnel} layout="vertical">
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis type="number" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis dataKey="etapa" type="category" stroke="#7A7A7A" fontSize={11} fontWeight={500} width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="valor" fill="#9B59B6" name="Volume" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Leads x Vendas */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Leads x Vendas por Dia</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <LineChart data={leadsVsSalesData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Legend wrapperStyle={{ paddingTop: '12px' }} iconType="circle" />
                        <Line 
                          type="monotone" 
                          dataKey="leads" 
                          stroke="#10B981"
                          strokeWidth={3}
                          name="Leads"
                          dot={{ fill: '#10B981', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales"
                          stroke="#005CFF"
                          strokeWidth={3}
                          name="Vendas"
                          dot={{ fill: '#005CFF', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {dashboardConfig.visibleSections.traffic && (
            <TabsContent value="traffic" className="space-y-12 animate-fade-in">
              {/* Cards de Tráfego */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Métricas de Tráfego
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Performance de aquisição e canais
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <MetricCard metric={mockMetrics.investimento} onClick={() => handleMetricClick(mockMetrics.investimento)} />
                  <MetricCard metric={mockMetrics.cpl} onClick={() => handleMetricClick(mockMetrics.cpl)} />
                  <MetricCard metric={mockMetrics.ctr} onClick={() => handleMetricClick(mockMetrics.ctr)} />
                  <MetricCard metric={mockMetrics.cpc} onClick={() => handleMetricClick(mockMetrics.cpc)} />
                  <MetricCard metric={mockMetrics.cpm} onClick={() => handleMetricClick(mockMetrics.cpm)} />
                  <MetricCard metric={mockMetrics.cliques} onClick={() => handleMetricClick(mockMetrics.cliques)} />
                  <MetricCard metric={mockMetrics.impressoes} onClick={() => handleMetricClick(mockMetrics.impressoes)} />
                </div>
              </div>

              {/* Gráficos de Tráfego */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Análise de Canais
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Performance por origem de tráfego
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CPL por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>CPL por Origem</h3>
                      <p className="text-xs text-muted-foreground">Custo por lead por canal</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={cplBySourceData} layout="vertical">
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis type="number" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis dataKey="source" type="category" stroke="#7A7A7A" fontSize={12} fontWeight={500} width={90} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="cpl" fill="#F39C12" name="CPL (R$)" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Investimento por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Investimento por Origem</h3>
                      <p className="text-xs text-muted-foreground">Distribuição de investimento</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={allDemoCharts.trafego.investimentoPorOrigem}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="origem" stroke="#7A7A7A" fontSize={11} fontWeight={500} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="valor" fill="#E53935" name="Investimento" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Cliques por Dia */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Cliques por Dia</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <AreaChart data={allDemoCharts.trafego.cliquesPorDia}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F39C12" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F39C12" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#F39C12"
                          strokeWidth={3}
                          fill="url(#colorClicks)"
                          name="Cliques"
                          dot={{ fill: '#F39C12', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {dashboardConfig.visibleSections.revenue && (
            <TabsContent value="revenue" className="space-y-12 animate-fade-in">
              {/* Cards de Receita */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Métricas de Receita
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Análise financeira completa
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <MetricCard metric={mockMetrics.faturamento} onClick={() => handleMetricClick(mockMetrics.faturamento)} />
                  <MetricCard metric={mockMetrics.receitaHoje} onClick={() => handleMetricClick(mockMetrics.receitaHoje)} />
                  <MetricCard metric={mockMetrics.ticket} onClick={() => handleMetricClick(mockMetrics.ticket)} />
                  <MetricCard metric={mockMetrics.receitaProdutoA} onClick={() => handleMetricClick(mockMetrics.receitaProdutoA)} />
                  <MetricCard metric={mockMetrics.receitaProdutoB} onClick={() => handleMetricClick(mockMetrics.receitaProdutoB)} />
                  <MetricCard metric={mockMetrics.receitaProdutoC} onClick={() => handleMetricClick(mockMetrics.receitaProdutoC)} />
                  <MetricCard metric={mockMetrics.receitaProjetada} onClick={() => handleMetricClick(mockMetrics.receitaProjetada)} />
                </div>
              </div>

              {/* Gráficos de Receita */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Análise Financeira
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Desempenho de receita por produto e canal
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Receita Acumulada */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Receita Acumulada</h3>
                      <p className="text-xs text-muted-foreground">Evolução cumulativa</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <AreaChart data={allDemoCharts.receita.receitaAcumulada}>
                        <defs>
                          <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#005CFF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#005CFF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#005CFF"
                          strokeWidth={3}
                          fill="url(#colorAccumulated)"
                          name="Receita Acumulada"
                          dot={{ fill: '#005CFF', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Receita por Produto */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Receita por Produto</h3>
                      <p className="text-xs text-muted-foreground">Distribuição por produto</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={allDemoCharts.receita.receitaPorProduto}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="produto" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="valor" fill="#10B981" name="Receita" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Receita por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Receita por Origem</h3>
                      <p className="text-xs text-muted-foreground">Distribuição de receita</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={revenueBySourceData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="source" stroke="#7A7A7A" fontSize={11} fontWeight={500} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="revenue" fill="#005CFF" name="Receita" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {dashboardConfig.visibleSections.leads && (
            <TabsContent value="leads" className="space-y-12 animate-fade-in">
              {/* Cards de Leads & LTV */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Métricas de Leads & LTV
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Qualidade e valor dos leads
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <MetricCard metric={mockMetrics.leads} onClick={() => handleMetricClick(mockMetrics.leads)} />
                  <MetricCard metric={mockMetrics.leadsQualificados} onClick={() => handleMetricClick(mockMetrics.leadsQualificados)} />
                  <MetricCard metric={mockMetrics.percLeadsQualificados} onClick={() => handleMetricClick(mockMetrics.percLeadsQualificados)} />
                  <MetricCard metric={mockMetrics.ltv} onClick={() => handleMetricClick(mockMetrics.ltv)} />
                  <MetricCard metric={mockMetrics.ltvTop20} onClick={() => handleMetricClick(mockMetrics.ltvTop20)} />
                  <MetricCard metric={mockMetrics.churn} onClick={() => handleMetricClick(mockMetrics.churn)} />
                  <MetricCard metric={mockMetrics.clientesAtivos} onClick={() => handleMetricClick(mockMetrics.clientesAtivos)} />
                </div>
              </div>

              {/* Gráficos de Leads & LTV */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-[20px] font-bold mb-1" style={{ color: '#111827' }}>
                    Análise de Valor
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Origem e qualidade dos leads
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Leads por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Leads por Origem</h3>
                      <p className="text-xs text-muted-foreground">Distribuição de leads</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={allDemoCharts.leadsLtv.leadsPorOrigem}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="origem" stroke="#7A7A7A" fontSize={11} fontWeight={500} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="leads" fill="#10B981" name="Leads" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* LTV por Origem */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>LTV por Origem</h3>
                      <p className="text-xs text-muted-foreground">Valor médio por canal</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <BarChart data={allDemoCharts.leadsLtv.ltvPorOrigem}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="origem" stroke="#7A7A7A" fontSize={11} fontWeight={500} angle={-15} textAnchor="end" height={60} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Bar dataKey="ltv" fill="#7C3AED" name="LTV (R$)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Leads Captados por Dia */}
                  <div className="border rounded-2xl p-6 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] transition-all" style={{ borderRadius: '14px', borderColor: '#E5E7EB' }}>
                    <div className="mb-6">
                      <h3 className="text-[16px] font-semibold mb-1" style={{ color: '#111827' }}>Leads Captados por Dia</h3>
                      <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                      <AreaChart data={leadsData}>
                        <defs>
                          <linearGradient id="colorLeadsLTV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" opacity={0.6} />
                        <XAxis dataKey="date" stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <YAxis stroke="#7A7A7A" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#colorLeadsLTV)"
                          name="Leads"
                          dot={{ fill: '#10B981', stroke: 'white', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {dashboardConfig.visibleSections.alerts && (
            <TabsContent value="alerts" className="space-y-10">
              {/* Forecast Section */}
              <ForecastCard
                current={{
                  leads: metrics.find(m => m.name === "Leads Captados")?.value || 0,
                  revenue: metrics.find(m => m.name === "Faturamento Total")?.value || 0,
                  roi: metrics.find(m => m.name === "ROI")?.value || 0,
                  conversionRate: metrics.find(m => m.name === "Taxa de Conversão")?.value || 0,
                }}
                goals={{
                  leadsTarget: 1500,
                  revenueTarget: 50000,
                  minROI: 200,
                }}
                daysElapsed={7}
                totalDays={30}
              />
              
              {/* Alerts & Goals Section */}
              <AlertsGoalsTab
                goals={{
                  leadsTarget: 1500,
                  revenueTarget: 50000,
                  maxCPL: 15,
                  minROI: 200,
                }}
                current={{
                  leads: metrics.find(m => m.name === "Leads Captados")?.value || 0,
                  revenue: metrics.find(m => m.name === "Faturamento Total")?.value || 0,
                  cpl: metrics.find(m => m.name === "CPL (Custo por Lead)")?.value || 0,
                  roi: metrics.find(m => m.name === "ROI")?.value || 0,
                }}
              />
            </TabsContent>
          )}

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-4">
            <AIAssistantTab
              projectContext={{
                project: {
                  name: "Lançamento Novembro 2024",
                  type: "Lançamento",
                  startDate: "2024-11-01",
                  endDate: "2024-11-30",
                },
                metrics: metrics.map(m => ({
                  name: m.name,
                  value: m.value,
                  valueType: m.valueType,
                })),
                goals: {
                  leadsTarget: 1500,
                  revenueTarget: 50000,
                  maxCPL: 15,
                  minROI: 200,
                },
                current: {
                  leads: metrics.find(m => m.name === "Leads Captados")?.value || 0,
                  revenue: metrics.find(m => m.name === "Faturamento Total")?.value || 0,
                  cpl: metrics.find(m => m.name === "CPL (Custo por Lead)")?.value || 0,
                  roi: metrics.find(m => m.name === "ROI")?.value || 0,
                },
                forecast: {
                  daysElapsed: 7,
                  projectedLeads: Math.round(((metrics.find(m => m.name === "Leads Captados")?.value || 0) / 7) * 30),
                  projectedRevenue: ((metrics.find(m => m.name === "Faturamento Total")?.value || 0) / 7) * 30,
                  projectedROI: metrics.find(m => m.name === "ROI")?.value || 0,
                },
                alerts: [
                  ...(metrics.find(m => m.name === "CPL (Custo por Lead)")?.value || 0) > 15
                    ? [{ title: "CPL acima do limite", description: "O CPL atual está acima do limite de R$ 15,00" }]
                    : [],
                  ...(metrics.find(m => m.name === "ROI")?.value || 0) < 200
                    ? [{ title: "ROI abaixo da meta", description: "O ROI atual está abaixo da meta de 200%" }]
                    : [],
                ],
                dailyData: revenueData.map(d => ({
                  date: d.date,
                  leads: leadsData.find(l => l.date === d.date)?.value || 0,
                  revenue: d.value,
                })),
              }}
            />
          </TabsContent>

          {/* Debrief Tab */}
          <TabsContent value="debrief" className="space-y-4">
            <DebriefTab
              project={{
                name: "Lançamento Novembro 2024",
                startDate: "2024-11-01",
                endDate: "2024-11-30",
                type: "Lançamento",
              }}
              metrics={{
                totalLeads: 1247,
                totalRevenue: 47580.50,
                avgTicket: 247.00,
                roi: 285,
                cpl: 12.50,
                conversionRate: 3.8,
                bestDay: { date: "2024-11-15", revenue: 5200 },
                topSource: { name: "Facebook Ads", leads: 485, revenue: 18200 },
              }}
              goals={{
                leadsTarget: 1500,
                revenueTarget: 50000,
                maxCPL: 15,
                minROI: 200,
              }}
            />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations">
            <OperationsTab />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <NotesTab projectId={id || ""} />
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit">
            <AuditTab projectId={id || ""} />
          </TabsContent>

          {/* Visual History Tab */}
          <TabsContent value="visual-history">
            <VisualHistoryTab projectId={id || ""} />
          </TabsContent>

          {/* Custom Sections */}
          {dashboardConfig.customSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-4">
              <p className="text-muted-foreground text-center py-12">
                Conteúdo da seção "{section.name}"
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <MetricConfigDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        metric={selectedMetric}
      />

      <ProjectExportImportDialog
        open={isExportImportDialogOpen}
        onOpenChange={setIsExportImportDialogOpen}
        projectData={{
          id: id || "",
          name: "Lançamento Novembro 2024",
          type: "Lançamento",
          metrics: displayMetrics,
          goals: {
            leadsTarget: 1500,
            revenueTarget: 50000,
            maxCPL: 15,
            minROI: 200,
          },
          snapshots: [],
          dashboardConfig: dashboardConfig,
        }}
      />

      <AddMetricDialog
        open={isAddMetricDialogOpen}
        onOpenChange={setIsAddMetricDialogOpen}
        availableSections={availableSections}
        onCreateMetric={handleCreateMetric}
      />

      <DashboardConfigDialog
        open={isDashboardConfigOpen}
        onOpenChange={setIsDashboardConfigOpen}
        config={dashboardConfig}
        onConfigChange={setDashboardConfig}
      />

      <CompareProjectsDialog
        open={isCompareDialogOpen}
        onOpenChange={setIsCompareDialogOpen}
        currentProject={{
          id: id || "1",
          name: "Lançamento Novembro 2024",
        }}
      />

      <LayoutConfigPanel
        open={isLayoutConfigOpen}
        onOpenChange={setIsLayoutConfigOpen}
        currentTab={currentTab}
        metricsMap={metricsMap}
        chartsMap={chartsMap}
      />
    </div>
  );
};

export default ProjectDashboard;
