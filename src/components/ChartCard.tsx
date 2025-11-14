/**
 * COMPONENTE: Card de Gráfico
 * 
 * Este componente exibe um gráfico dentro de um card com visual premium.
 * 
 * PROPRIEDADES:
 * - title: título do gráfico
 * - subtitle: subtítulo opcional (ex: "Últimos 7 dias")
 * - highlight: métrica de destaque opcional (ex: "Melhor dia: R$ 5.100")
 * - children: o gráfico em si (LineChart, BarChart, etc.)
 * 
 * VISUAL:
 * - Card premium com sombra e gradiente sutil
 * - Título grande e legível
 * - Subtítulo e highlight em cinza discreto
 * 
 * ONDE É USADO:
 * - Todas as abas para exibir gráficos
 * 
 * COMO USAR:
 * <ChartCard 
 *   title="Faturamento Diário"
 *   subtitle="Últimos 7 dias"
 *   highlight="Melhor dia: R$ 5.100"
 * >
 *   <ResponsiveContainer width="100%" height={340}>
 *     <AreaChart data={dados}>
 *       ...
 *     </AreaChart>
 *   </ResponsiveContainer>
 * </ChartCard>
 */

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/styles/theme.css";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  children: ReactNode;
}

export const ChartCard = ({ title, subtitle, highlight, children }: ChartCardProps) => {
  return (
    <Card className="premium-card h-full">
      <CardHeader className="pb-4 pt-5 px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-[16px] font-semibold text-foreground mb-1">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {highlight && (
            <div className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
              {highlight}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {children}
      </CardContent>
    </Card>
  );
};
