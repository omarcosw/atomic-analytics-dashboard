/**
 * HOOK: useThemeConfig
 * 
 * Gerencia a configuração de tema visual do Atomic+.
 * 
 * FUNCIONALIDADES:
 * - Selecionar tema ativo
 * - Aplicar tema no DOM
 * - Persistir escolha (localStorage)
 * - Ajuste fino de cor primária
 * 
 * COMO USAR:
 * const { currentTheme, setTheme, availableThemes } = useThemeConfig();
 */

import { useState, useEffect } from "react";
import { themePresets, ThemePreset } from "@/data/themePresets";

const THEME_STORAGE_KEY = "atomic-theme";
const CUSTOM_PRIMARY_KEY = "atomic-custom-primary";

export const useThemeConfig = () => {
  // Carregar tema salvo ou usar padrão
  const getSavedTheme = (): ThemePreset => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const themeId = JSON.parse(saved);
        const theme = themePresets.find(t => t.id === themeId);
        if (theme) return theme;
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
    return themePresets[0]; // Padrão
  };

  const [currentTheme, setCurrentThemeState] = useState<ThemePreset>(getSavedTheme());
  const [customPrimaryColor, setCustomPrimaryColorState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_PRIMARY_KEY);
    } catch {
      return null;
    }
  });

  // Aplicar tema no DOM
  useEffect(() => {
    // Remover todas as classes de tema anteriores
    document.body.classList.remove(...themePresets.map(t => t.className));
    
    // Adicionar classe do tema atual
    document.body.classList.add(currentTheme.className);

    // Aplicar cor primária customizada se existir
    if (customPrimaryColor) {
      document.documentElement.style.setProperty("--color-primary", customPrimaryColor);
    } else {
      // Remover override se não houver customização
      document.documentElement.style.removeProperty("--color-primary");
    }
  }, [currentTheme, customPrimaryColor]);

  // Mudar tema
  const setTheme = (themeId: string) => {
    const theme = themePresets.find(t => t.id === themeId);
    if (theme) {
      setCurrentThemeState(theme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme.id));
      } catch (error) {
        console.error("Erro ao salvar tema:", error);
      }
    }
  };

  // Definir cor primária customizada
  const setCustomPrimaryColor = (color: string | null) => {
    setCustomPrimaryColorState(color);
    try {
      if (color) {
        localStorage.setItem(CUSTOM_PRIMARY_KEY, color);
      } else {
        localStorage.removeItem(CUSTOM_PRIMARY_KEY);
      }
    } catch (error) {
      console.error("Erro ao salvar cor customizada:", error);
    }
  };

  // Atalho para tema claro/escuro
  const setLightMode = () => {
    setTheme("default");
  };

  const setDarkMode = () => {
    setTheme("dark");
  };

  // Resetar personalizações
  const resetCustomizations = () => {
    setCustomPrimaryColor(null);
  };

  return {
    currentTheme,
    setTheme,
    availableThemes: themePresets,
    customPrimaryColor,
    setCustomPrimaryColor,
    setLightMode,
    setDarkMode,
    resetCustomizations,
  };
};
