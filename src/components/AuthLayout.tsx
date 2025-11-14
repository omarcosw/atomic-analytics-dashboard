import { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { LoginHeroShowcase } from "./LoginHeroShowcase";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Lado esquerdo - Hero com gradiente e showcase */}
      <div className="hidden lg:flex flex-1 min-h-screen bg-gradient-to-br from-[#005CFF] to-[#1D4ED8] text-white">
        <div className="flex flex-col justify-center h-full px-12">
          {/* Header: Logo + Título */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-white">
                Atomic+ Analytics
              </h1>
            </div>
            <p className="text-white/70 leading-relaxed text-sm max-w-xs">
              Dashboards inteligentes para infoprodutores.
              Acompanhe suas métricas e tome decisões baseadas em dados reais.
            </p>
          </header>

          {/* Dashboard Interativo */}
          <div className="flex justify-start">
            <LoginHeroShowcase />
          </div>

          {/* Footer discreto */}
          <footer className="mt-8 text-xs text-white/40">
            <p>© 2024 Atomic+ Analytics. Todos os direitos reservados.</p>
          </footer>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-glow">
              <BarChart3 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Atomic+ Analytics
            </h1>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};
