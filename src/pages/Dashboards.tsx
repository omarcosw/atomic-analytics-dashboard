import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TechBackground } from "@/components/layout/TechBackground";

// Mock data - will be replaced with real data from Lovable Cloud
const mockDashboards = [
  {
    id: "1",
    name: "Lançamento Novembro 2024",
    metricsCount: 8,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Perpétuo Funil Principal",
    metricsCount: 12,
    lastUpdated: "2024-01-15T09:15:00Z",
  },
];

const Dashboards = () => {
  const navigate = useNavigate();
  const [dashboards] = useState(mockDashboards);

  const handleCreateDashboard = () => {
    // TODO: Implement create dashboard logic
    console.log("Create dashboard");
  };

  const handleDeleteDashboard = (id: string) => {
    // TODO: Implement delete dashboard logic
    console.log("Delete dashboard", id);
  };

  return (
    <TechBackground>
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_20px_45px_rgba(79,70,229,0.4)]">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Atomic+</p>
              <h1 className="text-2xl font-bold text-white">Meus Dashboards</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button
              onClick={handleCreateDashboard}
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {dashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nenhum dashboard ainda</h2>
            <p className="text-white/70 mb-6 text-center max-w-md">
              Crie seu primeiro dashboard para começar a acompanhar suas métricas
            </p>
            <Button
              onClick={handleCreateDashboard}
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar primeiro dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard.id}
                className="cursor-pointer border border-white/10 hover:border-white/40 transition-all duration-200"
                onClick={() => navigate(`/dashboard/${dashboard.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-1">{dashboard.name}</CardTitle>
                      <CardDescription className="text-white/60">
                        {dashboard.metricsCount} métricas configuradas
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span>Atualizado {new Date(dashboard.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </TechBackground>
  );
};

export default Dashboards;
