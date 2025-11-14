import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthFake } from "@/hooks/useAuthFake";
import { HelpCircle, BookOpen, Mail, MessageCircle, ExternalLink } from "lucide-react";

const Help = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthFake();
  
  // Proteção de rota
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Não renderizar nada enquanto verifica autenticação
  if (!isAuthenticated) {
    return null;
  }
  
  const quickGuides = [
    {
      title: "Como conectar sua planilha do Google Sheets",
      description: "Aprenda a vincular suas planilhas em poucos passos",
      link: "#"
    },
    {
      title: "Como configurar suas métricas",
      description: "Configure métricas customizadas para acompanhar seus KPIs",
      link: "#"
    },
    {
      title: "Como ativar o link público do dashboard",
      description: "Compartilhe seus dashboards com clientes e stakeholders",
      link: "#"
    },
    {
      title: "Como personalizar o layout do dashboard",
      description: "Organize as métricas e gráficos do seu jeito",
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "Como faço para adicionar um novo projeto?",
      answer: "Na página 'Meus Projetos', clique no botão '+ Novo Projeto' no canto superior direito. Siga o wizard de criação que irá guiá-lo pelos passos necessários: nome do projeto, tipo, datas, metas e conexão com fontes de dados."
    },
    {
      question: "Posso conectar múltiplas planilhas ao mesmo dashboard?",
      answer: "Atualmente, cada projeto pode ter uma planilha principal conectada. Em breve, você poderá conectar múltiplas fontes de dados e combinar informações de diferentes planilhas em um único dashboard."
    },
    {
      question: "Como funcionam os links públicos?",
      answer: "Ao ativar seu dashboard, um link público único é gerado. Esse link permite que qualquer pessoa visualize suas métricas sem precisar fazer login. O link pode ser copiado e compartilhado via email, WhatsApp ou outras plataformas."
    },
    {
      question: "Os dados são atualizados em tempo real?",
      answer: "As métricas são atualizadas quando você clica no botão 'Atualizar' no dashboard. A frequência de atualização automática depende do seu plano. Planos pagos oferecem sincronização automática em intervalos configuráveis."
    },
    {
      question: "Como posso personalizar as cores e o tema?",
      answer: "Acesse 'Configurações > Aparência' no menu para escolher entre diferentes temas pré-configurados (Padrão, Modo Escuro, Neon, Minimal). Você também pode ajustar a cor primária para combinar com a identidade visual da sua marca."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Ajuda & Suporte
            </h1>
            <p className="text-muted-foreground mt-2">
              Encontre respostas rápidas sobre o Atomic+
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Guia Rápido */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle>Guias rápidos</CardTitle>
              </div>
              <CardDescription>
                Tutoriais passo a passo para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickGuides.map((guide, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between h-auto py-4"
                    asChild
                  >
                    <a href={guide.link}>
                      <div className="text-left">
                        <div className="font-semibold">{guide.title}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {guide.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <CardTitle>Perguntas frequentes</CardTitle>
              </div>
              <CardDescription>
                Respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <CardTitle>Precisa de mais ajuda?</CardTitle>
              </div>
              <CardDescription>
                Entre em contato com nosso time de suporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    Envie um email para{" "}
                    <a href="mailto:suporte@atomicplus.app" className="text-primary hover:underline">
                      suporte@atomicplus.app
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resposta em até 24 horas úteis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Chat ao vivo</p>
                  <p className="text-sm text-muted-foreground">
                    Chat integrado em breve para suporte em tempo real
                  </p>
                  <Button variant="outline" size="sm" disabled className="mt-2">
                    Em breve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
