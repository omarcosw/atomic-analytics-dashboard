import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { TechBackground } from "@/components/layout/TechBackground";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Proteção de rota
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);
  
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.email || "");
  const [email, setEmail] = useState(user?.email || "");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [language, setLanguage] = useState("pt-BR");
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName(user?.user_metadata?.full_name || user?.email || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado com sucesso",
      description: "Suas informações foram salvas.",
    });
  };

  // Não renderizar nada enquanto verifica autenticação
  if (authLoading || !isAuthenticated) {
    return null;
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferências salvas",
      description: "Suas configurações foram atualizadas.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Senha alterada (simulado)",
      description: "Sua senha foi atualizada com sucesso.",
    });
  };

  const handleLogoutAllDevices = () => {
    toast({
      title: "Sessões encerradas",
      description: "Você foi desconectado de todos os dispositivos.",
    });
  };

  return (
    <TechBackground>
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">Perfil</p>
            <h1 className="text-3xl font-bold text-white">
              Minha Conta
            </h1>
            <p className="text-white/70 mt-2">
              Gerencie seus dados pessoais
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Dados básicos</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Informações pessoais da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
              >
                Salvar alterações
              </Button>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                <CardTitle>Preferências</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Personalize sua experiência no Atomic+
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso horário</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone" className="border-white/20 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050b18] border border-white/10 text-white">
                    <SelectItem value="America/Sao_Paulo" className="text-white/80 focus:bg-white/10 focus:text-white">
                      América/São Paulo (BRT)
                    </SelectItem>
                    <SelectItem value="America/New_York" className="text-white/80 focus:bg-white/10 focus:text-white">
                      América/Nova York (EST)
                    </SelectItem>
                    <SelectItem value="Europe/London" className="text-white/80 focus:bg-white/10 focus:text-white">
                      Europa/Londres (GMT)
                    </SelectItem>
                    <SelectItem value="Asia/Tokyo" className="text-white/80 focus:bg-white/10 focus:text-white">
                      Ásia/Tóquio (JST)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="border-white/20 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050b18] border border-white/10 text-white">
                    <SelectItem value="pt-BR" className="text-white/80 focus:bg-white/10 focus:text-white">
                      Português (Brasil)
                    </SelectItem>
                    <SelectItem value="en-US" disabled className="text-white/30">
                      English (US) - Em breve
                    </SelectItem>
                    <SelectItem value="es-ES" disabled className="text-white/30">
                      Español - Em breve
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSavePreferences}
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
              >
                Salvar preferências
              </Button>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Segurança</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Alterar senha
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                onClick={handleLogoutAllDevices}
              >
                Encerrar sessão em todos os dispositivos
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Alterar Senha */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>
              Digite sua senha atual e escolha uma nova senha
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha atual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="border-white/30 text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TechBackground>
  );
};

export default Profile;
