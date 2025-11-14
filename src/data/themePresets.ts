/**
 * DADOS: Presets de Temas
 * 
 * Define os temas visuais disponíveis no Atomic+.
 * 
 * TEMAS:
 * - Padrão: tema claro e moderno
 * - Modo Escuro: ideal para uso prolongado
 * - Neon: visual agressivo e contrastante
 * - Minimal: limpo e profissional
 * 
 * COMO USAR:
 * - O hook useThemeConfig gerencia o tema ativo
 * - Cada tema tem uma classe CSS correspondente
 */

export interface ThemePreset {
  id: string;
  name: string;
  className: string;
  description: string;
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "default",
    name: "Padrão Atomic+",
    className: "theme-default",
    description: "Tema claro, moderno e equilibrado para uso profissional",
    isDark: false,
    colors: {
      primary: "#005CFF",
      background: "#F3F6FF",
      card: "#FFFFFF",
      text: "#0F172A",
    },
  },
  {
    id: "dark",
    name: "Modo Escuro",
    className: "theme-dark",
    description: "Ideal para uso prolongado e ambientes com pouca luz",
    isDark: true,
    colors: {
      primary: "#4F46E5",
      background: "#020617",
      card: "#0F172A",
      text: "#E5E7EB",
    },
  },
  {
    id: "neon",
    name: "Neon Creator",
    className: "theme-neon",
    description: "Visual mais agressivo com contraste alto e cores vibrantes",
    isDark: true,
    colors: {
      primary: "#22C55E",
      background: "#020617",
      card: "#1E293B",
      text: "#E5E7EB",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    className: "theme-minimal",
    description: "Design limpo, leve e profissional para apresentações",
    isDark: false,
    colors: {
      primary: "#0F766E",
      background: "#F9FAFB",
      card: "#FFFFFF",
      text: "#020617",
    },
  },
];

// Estado do tema (fake, pode ser migrado para localStorage)
export let currentTheme = themePresets[0];

export const setCurrentTheme = (themeId: string) => {
  const theme = themePresets.find(t => t.id === themeId);
  if (theme) {
    currentTheme = theme;
  }
};

export const getCurrentTheme = () => currentTheme;
