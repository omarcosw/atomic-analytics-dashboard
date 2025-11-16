import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Users, Building2, Palette, UserPlus, Eye, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TechBackground } from "@/components/layout/TechBackground";

interface Client {
  id: string;
  name: string;
  email: string;
  projectCount: number;
  totalRevenue: number;
  permission: "viewer" | "editor" | "admin";
}

interface AgencyBrand {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  brandName: string;
}

const Agency = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", permission: "viewer" });
  
  // Mock data - substituir com dados reais do Supabase
  const [agencyBrand, setAgencyBrand] = useState<AgencyBrand>({
    logoUrl: "",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    brandName: "Minha Agência",
  });

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Cliente A",
      email: "clientea@email.com",
      projectCount: 3,
      totalRevenue: 45000,
      permission: "viewer",
    },
    {
      id: "2",
      name: "Cliente B",
      email: "clienteb@email.com",
      projectCount: 5,
      totalRevenue: 78000,
      permission: "editor",
    },
  ]);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      email: newClient.email,
      projectCount: 0,
      totalRevenue: 0,
      permission: newClient.permission as "viewer" | "editor" | "admin",
    };

    setClients([...clients, client]);
    setNewClient({ name: "", email: "", permission: "viewer" });
    setIsAddClientOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${client.name} foi adicionado com sucesso`,
    });
  };

  const handleImpersonate = (client: Client) => {
    toast({
      title: "Acessando como cliente",
      description: `Você está visualizando como ${client.name}`,
    });
    // TODO: Implementar lógica de impersonation
  };

  const handleUpdateBrand = () => {
    toast({
      title: "Branding atualizado",
      description: "As configurações de marca foram salvas",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload para Supabase Storage
      const url = URL.createObjectURL(file);
      setAgencyBrand({ ...agencyBrand, logoUrl: url });
    }
  };

  return (
    <TechBackground>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/projects")} className="text-white/70 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Atomic+ Agency</p>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                Painel de Agência
              </h1>
              <p className="text-white/70 mt-1">
                Gerencie clientes e personalize sua marca
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="clients" className="space-y-6 text-white">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-2xl">
            <TabsTrigger value="clients" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#030711]">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#030711]">
              <Palette className="h-4 w-4 mr-2" />
              Whitelabel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meus Clientes</h2>
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription>
                      Crie uma subconta para gerenciar projetos do cliente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Nome do Cliente</Label>
                      <Input
                        id="client-name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        placeholder="Nome da empresa ou pessoa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-email">Email</Label>
                      <Input
                        id="client-email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="email@cliente.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permission">Permissão</Label>
                      <Select
                        value={newClient.permission}
                        onValueChange={(value) => setNewClient({ ...newClient, permission: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddClient}>Adicionar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Projetos</p>
                        <p className="text-2xl font-bold">{client.projectCount}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Receita Total</p>
                        <p className="text-2xl font-bold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(client.totalRevenue)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {client.permission}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleImpersonate(client)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Acessar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Marca</CardTitle>
                <CardDescription>
                  Personalize a aparência dos dashboards públicos dos seus clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Nome da Agência</Label>
                  <Input
                    id="brand-name"
                    value={agencyBrand.brandName}
                    onChange={(e) =>
                      setAgencyBrand({ ...agencyBrand, brandName: e.target.value })
                    }
                    placeholder="Nome que aparecerá nos dashboards"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo da Agência</Label>
                  <div className="flex items-center gap-4">
                    {agencyBrand.logoUrl && (
                      <img
                        src={agencyBrand.logoUrl}
                        alt="Logo"
                        className="h-16 w-16 object-contain rounded border"
                      />
                    )}
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={agencyBrand.primaryColor}
                        onChange={(e) =>
                          setAgencyBrand({ ...agencyBrand, primaryColor: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={agencyBrand.primaryColor}
                        onChange={(e) =>
                          setAgencyBrand({ ...agencyBrand, primaryColor: e.target.value })
                        }
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={agencyBrand.secondaryColor}
                        onChange={(e) =>
                          setAgencyBrand({ ...agencyBrand, secondaryColor: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        value={agencyBrand.secondaryColor}
                        onChange={(e) =>
                          setAgencyBrand({ ...agencyBrand, secondaryColor: e.target.value })
                        }
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Pré-visualização</h3>
                  <div
                    className="p-6 rounded-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${agencyBrand.primaryColor}15, ${agencyBrand.secondaryColor}15)`,
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {agencyBrand.logoUrl && (
                        <img
                          src={agencyBrand.logoUrl}
                          alt="Logo Preview"
                          className="h-12 w-12 object-contain"
                        />
                      )}
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: agencyBrand.primaryColor }}
                      >
                        {agencyBrand.brandName}
                      </h2>
                    </div>
                    <p className="text-sm text-white/60">
                      Assim seus dashboards públicos aparecerão para os clientes
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleUpdateBrand}
                  className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 font-semibold hover:brightness-110"
                >
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TechBackground>
  );
};

export default Agency;
