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

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: string; // Largura máxima (padrão: 1600px)
  fullHeight?: boolean; // Se deve ocupar altura total da tela
}

export const PageLayout = ({ 
  children, 
  maxWidth = "1600px",
  fullHeight = true 
}: PageLayoutProps) => {
  return (
    <div 
      className={`${fullHeight ? 'min-h-screen flex flex-col' : ''}`}
      style={{ 
        background: 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-to))'
      }}
    >
      <div className="flex-1">
        <div 
          className="mx-auto px-8 py-8"
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
