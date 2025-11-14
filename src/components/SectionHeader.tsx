/**
 * COMPONENTE: Cabeçalho de Seção
 * 
 * Este componente exibe um título e subtítulo para cada seção do dashboard.
 * 
 * ONDE É USADO:
 * - Acima de cada grid de métricas
 * - Acima de cada área de gráficos
 * 
 * COMO USAR:
 * <SectionHeader 
 *   title="Métricas Principais"
 *   subtitle="Indicadores de desempenho do lançamento"
 * />
 */

// ============================================
// COMPONENTE: SectionHeader
// ============================================
//
// Este componente cria um cabeçalho de seção no dashboard.
//
// PROPS (configurações):
// - title: Título da seção (ex: "Análise Visual")
// - subtitle: Descrição da seção (ex: "Evolução diária das métricas")
//
// ✏️ ONDE USAR:
// No início de cada bloco de conteúdo dentro das abas
// (antes do grid de métricas ou gráficos)
//
// EXEMPLO DE USO:
// <SectionHeader
//   title="Métricas Principais"
//   subtitle="Resumo das principais métricas do seu lançamento."
// />
//
// ============================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
};
