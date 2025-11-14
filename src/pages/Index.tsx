import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Zap, FileSpreadsheet, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Atomic+ Analytics</span>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Entrar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center py-20 md:py-32">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-glow">
            <BarChart3 className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Dashboard Analytics<br />para Infoprodutores
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Conecte suas planilhas do Google Sheets e visualize suas métricas em tempo real.
            Sem configuração complicada, sem código.
          </p>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg"
            >
              Começar agora
            </Button>
            <Button
              onClick={() => navigate("/dashboards")}
              size="lg"
              variant="outline"
            >
              Ver demonstração
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Google Sheets Nativo</h3>
            <p className="text-muted-foreground">
              Conecte suas planilhas existentes em segundos
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Configuração Rápida</h3>
            <p className="text-muted-foreground">
              Mapeie suas métricas sem conhecimento técnico
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Métricas em Tempo Real</h3>
            <p className="text-muted-foreground">
              Acompanhe seus números atualizados automaticamente
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Atomic+ Analytics. Todos os direitos reservados.
            </div>
            <div className="flex gap-6 text-sm">
              <button 
                onClick={() => navigate("/legal/terms")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Termos de Uso
              </button>
              <button 
                onClick={() => navigate("/legal/privacy")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Política de Privacidade
              </button>
              <button 
                onClick={() => navigate("/help")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Ajuda
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
