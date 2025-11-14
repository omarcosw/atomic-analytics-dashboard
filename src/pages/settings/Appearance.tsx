/**
 * PÁGINA: Configurações de Aparência
 * 
 * Permite personalizar o visual do Atomic+:
 * - Selecionar tema (padrão, escuro, neon, minimal)
 * - Toggle rápido claro/escuro
 * - Ajuste fino da cor primária
 * 
 * DADOS:
 * - Usa hook useThemeConfig
 * - Usa themePresets
 */

import { PageLayout } from "@/components/PageLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { CheckCircle2, Sun, Moon, Palette, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Appearance = () => {
  const {
    currentTheme,
    setTheme,
    availableThemes,
    customPrimaryColor,
    setCustomPrimaryColor,
    setLightMode,
    setDarkMode,
    resetCustomizations,
  } = useThemeConfig();

  const [colorInput, setColorInput] = useState(customPrimaryColor || currentTheme.colors.primary);

  const handleThemeChange = (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setTheme(themeId);
      toast({
        title: "Tema alterado",
        description: `Tema ${theme.name} aplicado com sucesso.`,
      });
    }
  };

  const handleQuickToggle = (mode: "light" | "dark") => {
    if (mode === "light") {
      setLightMode();
      toast({
        title: "Modo claro ativado",
        description: "Tema padrão aplicado.",
      });
    } else {
      setDarkMode();
      toast({
        title: "Modo escuro ativado",
        description: "Tema escuro aplicado.",
      });
    }
  };

  const handleCustomColorChange = (color: string) => {
    setColorInput(color);
  };

  const handleApplyCustomColor = () => {
    setCustomPrimaryColor(colorInput);
    toast({
      title: "Cor primária atualizada",
      description: "Sua personalização foi aplicada (experimento visual).",
    });
  };

  const handleResetColor = () => {
    setCustomPrimaryColor(null);
    setColorInput(currentTheme.colors.primary);
    toast({
      title: "Cor resetada",
      description: "Voltou à cor padrão do tema.",
    });
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <SectionHeader
          title="Aparência"
          subtitle="Personalize as cores e o estilo visual do Atomic+"
        />

        {/* Toggle rápido claro/escuro */}
        <Card>
          <CardHeader>
            <CardTitle>Preferência rápida</CardTitle>
            <CardDescription>
              Alterne rapidamente entre modo claro e escuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant={!currentTheme.isDark ? "default" : "outline"}
                onClick={() => handleQuickToggle("light")}
                className="flex-1"
              >
                <Sun className="w-4 h-4 mr-2" />
                Tema Claro
              </Button>
              <Button
                variant={currentTheme.isDark ? "default" : "outline"}
                onClick={() => handleQuickToggle("dark")}
                className="flex-1"
              >
                <Moon className="w-4 h-4 mr-2" />
                Tema Escuro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seleção de tema */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Temas disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableThemes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              
              return (
                <Card
                  key={theme.id}
                  className={`relative cursor-pointer transition-all hover:border-primary/40 ${
                    isActive ? "border-primary border-2" : ""
                  }`}
                  onClick={() => handleThemeChange(theme.id)}
                >
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-base">{theme.name}</CardTitle>
                      <Badge variant={theme.isDark ? "secondary" : "outline"}>
                        {theme.isDark ? "Escuro" : "Claro"}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Preview das cores */}
                    <div className="flex gap-2">
                      <div
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primária"
                      />
                      <div
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: theme.colors.card }}
                        title="Card"
                      />
                      <div
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Fundo"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Ajuste fino de cor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Ajuste fino da cor primária
            </CardTitle>
            <CardDescription>
              Personalize a cor principal do tema atual (experimento visual)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Escolha uma cor</Label>
                <Input
                  type="color"
                  value={colorInput}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="h-12 cursor-pointer"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Código hex</Label>
                <Input
                  type="text"
                  value={colorInput}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#005CFF"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApplyCustomColor} className="flex-1">
                Aplicar cor
              </Button>
              <Button
                variant="outline"
                onClick={handleResetColor}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </Button>
            </div>

            {customPrimaryColor && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-blue-900">Cor customizada ativa</p>
                <p className="text-blue-700 text-xs">
                  Você pode resetar para voltar à cor padrão do tema
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Appearance;
