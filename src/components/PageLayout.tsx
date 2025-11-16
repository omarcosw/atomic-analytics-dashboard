/**
 * COMPONENTE: Layout da Página
 * 
 * Este componente define o layout principal de todas as páginas do dashboard.
 * Ele controla a largura máxima, padding e espaçamento.
 * 
 * ONDE É USADO:
 * - ProjectDashboard.tsx
 * - PublicDashboard.tsx
 * 
 * COMO USAR:
 * <PageLayout>
 *   <div>Seu conteúdo aqui</div>
 * </PageLayout>
 */

import { ReactNode } from "react";
import { TechBackground } from "@/components/layout/TechBackground";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: string; // Largura máxima (padrão: 1600px)
  fullHeight?: boolean; // Se deve ocupar altura total da tela
}

export const PageLayout = ({
  children,
  maxWidth = "1600px",
  fullHeight = true,
}: PageLayoutProps) => {
  return (
    <TechBackground>
      <div className={cn(fullHeight && "min-h-screen flex flex-col")}>
        <div className="flex-1">
          <div className="mx-auto px-6 py-10 w-full" style={{ maxWidth }}>
            {children}
          </div>
        </div>
      </div>
    </TechBackground>
  );
};
