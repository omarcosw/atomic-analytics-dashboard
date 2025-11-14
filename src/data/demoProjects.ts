/**
 * ARQUIVO: Projetos Demo (Fake Data)
 * 
 * Este arquivo contém a lista de projetos/dashboards fictícios
 * usados para simular a tela "Meus Dashboards".
 * 
 * COMO EDITAR:
 * - Para adicionar um novo projeto, copie um objeto do array e cole abaixo
 * - Para editar os valores, mude os números diretamente
 * - isActive: true = dashboard ativo, false = inativo
 * - publicSlug: usado para gerar o link público
 * 
 * (FUTURO) Esses dados virão do backend real (banco de dados)
 */

export interface DemoProject {
  id: string;
  name: string;
  type: "launch" | "recurring" | "other";
  status: "running" | "preparing" | "finished";
  isActive: boolean;
  publicSlug: string | null;
  metrics: {
    leads: number;
    revenue: number;
    roi: number;
  };
  goals: {
    leadsTarget: number;
    revenueTarget: number;
  };
  lastUpdated: Date;
}

export const demoProjects: DemoProject[] = [
  {
    id: "1",
    name: "Lançamento Novembro 2024",
    type: "launch",
    status: "running",
    isActive: true,
    publicSlug: "dash-1-a3f9d2",
    metrics: { 
      leads: 1247, 
      revenue: 47580.50, 
      roi: 285 
    },
    goals: { 
      leadsTarget: 1500, 
      revenueTarget: 50000 
    },
    lastUpdated: new Date("2024-11-13T10:30:00"),
  },
  {
    id: "2",
    name: "Perpétuo - Comunidade Elite",
    type: "recurring",
    status: "running",
    isActive: false,
    publicSlug: null,
    metrics: { 
      leads: 842, 
      revenue: 28450.00, 
      roi: 320 
    },
    goals: { 
      leadsTarget: 1000, 
      revenueTarget: 30000 
    },
    lastUpdated: new Date("2024-11-12T15:20:00"),
  },
  {
    id: "3",
    name: "Desafio 7 Dias",
    type: "launch",
    status: "preparing",
    isActive: false,
    publicSlug: null,
    metrics: { 
      leads: 552, 
      revenue: 12800, 
      roi: 189 
    },
    goals: { 
      leadsTarget: 800, 
      revenueTarget: 20000 
    },
    lastUpdated: new Date("2024-11-10T09:15:00"),
  },
  {
    id: "4",
    name: "Funil Perpétuo",
    type: "recurring",
    status: "running",
    isActive: true,
    publicSlug: "dash-4-x7k2m9",
    metrics: { 
      leads: 982, 
      revenue: 22900, 
      roi: 412 
    },
    goals: { 
      leadsTarget: 1200, 
      revenueTarget: 30000 
    },
    lastUpdated: new Date("2024-11-13T08:45:00"),
  },
];
