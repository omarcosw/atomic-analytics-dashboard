import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuthFake } from "@/hooks/useAuthFake";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { themePresets } from "@/data/themePresets";
import { Building2, Link as LinkIcon, Palette, Database, Info } from "lucide-react";

const General = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthFake();
  const { currentTheme, setTheme, availableThemes } = useThemeConfig();
  
  // Proteção de rota
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);
  
  const [workspaceName, setWorkspaceName] = useState("Atomic+ do Marcos");
  const [workspaceLogo, setWorkspaceLogo] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("marcos-agencia");
  
  const [showCurrency, setShowCurrency] = useState(true);
  const [roundDecimals, setRoundDecimals] = useState(true);
  const [showTrend, setShowTrend] = useState(true);

  const handleSaveIdentity = () => {
    toast({
      title: "Identidade atualizada",
      description: "As informações do workspace foram salvas.",
    });
  };

  // Não renderizar nada enquanto verifica autenticação
  if (!isAuthenticated) {
    return null;
  }

  const handleSaveSlug = () => {
    toast({
      title: "Slug atualizado",
      description: `Seu slug público agora é: ${workspaceSlug}`,
    });
  };

  const handleSaveDataPreferences = () => {
    toast({
      title: "Preferências de dados salvas",
      description: "Suas configurações foram atualizadas.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Configurações Gerais
            </h1>
            <p className="text-muted-foreground mt-2">
              Personalize o comportamento global do seu Atomic+
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Identidade do Workspace */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>Identidade do workspace</CardTitle>
              </div>
              <CardDescription>
                Configure o nome e a identidade visual do seu workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Nome do workspace</Label>
                <Input
                  id="workspace-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Ex: Atomic+ do Marcos, Agência XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-logo">Logo (URL da imagem)</Label>
                <Input
                  id="workspace-logo"
                  value={workspaceLogo}
                  onChange={(e) => setWorkspaceLogo(e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-xs text-muted-foreground">
                  Opcional: Cole a URL de uma imagem para usar como logo
                </p>
              </div>
              <Button onClick={handleSaveIdentity} className="bg-gradient-primary">
                Salvar identidade
              </Button>
            </CardContent>
          </Card>

          {/* Domínio Público / Slug */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                <CardTitle>Slug público do workspace</CardTitle>
              </div>
              <CardDescription>
                Define o identificador único para links públicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-slug">Slug</Label>
                <Input
                  id="workspace-slug"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="marcos-agencia"
                />
                <p className="text-sm text-muted-foreground">
                  Usado para montar links públicos de dashboards:
                  <br />
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    https://app.atomicplus.app/public/{workspaceSlug}/&lt;dashboard&gt;
                  </code>
                </p>
              </div>
              <Button onClick={handleSaveSlug} className="bg-gradient-primary">
                Salvar slug
              </Button>
            </CardContent>
          </Card>

          {/* Padrão de Tema */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Tema padrão</CardTitle>
              </div>
              <CardDescription>
                Escolha o tema visual padrão para o workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select 
                  value={currentTheme.id} 
                  onValueChange={(value) => {
                    setTheme(value);
                    toast({
                      title: "Tema atualizado",
                      description: `Tema ${availableThemes.find(t => t.id === value)?.name} aplicado.`,
                    });
                  }}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {currentTheme.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Dados */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <CardTitle>Preferências de dados</CardTitle>
              </div>
              <CardDescription>
                Configure como os dados são exibidos nos dashboards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-currency" 
                  checked={showCurrency}
                  onCheckedChange={(checked) => setShowCurrency(checked as boolean)}
                />
                <label
                  htmlFor="show-currency"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mostrar valores em R$ (BRL)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="round-decimals" 
                  checked={roundDecimals}
                  onCheckedChange={(checked) => setRoundDecimals(checked as boolean)}
                />
                <label
                  htmlFor="round-decimals"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Arredondar para duas casas decimais
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-trend" 
                  checked={showTrend}
                  onCheckedChange={(checked) => setShowTrend(checked as boolean)}
                />
                <label
                  htmlFor="show-trend"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Exibir tendência (+X% últimos 7 dias) nas métricas principais
                </label>
              </div>
              <Button onClick={handleSaveDataPreferences} className="bg-gradient-primary">
                Salvar preferências
              </Button>
            </CardContent>
          </Card>

          {/* Informações do Workspace (Preparação Multi-Workspace) */}
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-muted-foreground">Informações do workspace</CardTitle>
              </div>
              <CardDescription>
                Dados técnicos do workspace atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-id" className="text-muted-foreground">ID do workspace</Label>
                <Input
                  id="workspace-id"
                  value="workspace-demo-1"
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  No futuro, cada workspace poderá ter seus próprios usuários, dashboards e fontes de dados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default General;
