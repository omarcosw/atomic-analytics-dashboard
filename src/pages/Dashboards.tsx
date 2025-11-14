import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Atomic+ Analytics</h1>
                <p className="text-sm text-muted-foreground">Meus Dashboards</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button
                onClick={handleCreateDashboard}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {dashboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nenhum dashboard ainda</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Crie seu primeiro dashboard para começar a acompanhar suas métricas
            </p>
            <Button
              onClick={handleCreateDashboard}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
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
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50"
                onClick={() => navigate(`/dashboard/${dashboard.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{dashboard.name}</CardTitle>
                      <CardDescription>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Atualizado {new Date(dashboard.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboards;
