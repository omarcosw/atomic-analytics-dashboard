import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap, Building2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TechBackground } from "@/components/layout/TechBackground";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para testar e experimentar",
    icon: Sparkles,
    features: [
      "1 projeto",
      "Métricas básicas",
      "Dashboards privados",
      "Atualização manual",
    ],
    limitations: [
      "Sem link público",
      "Sem Debrief PDF",
      "Sem IA Assistente",
      "Sem seções personalizadas",
    ],
    color: "text-muted-foreground",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    description: "Para infoprodutores profissionais",
    icon: Crown,
    popular: true,
    features: [
      "Até 10 projetos",
      "Link público habilitado",
      "Debrief PDF premium",
      "IA Assistente completa",
      "Seções personalizadas",
      "Comparação de projetos",
      "Templates avançados",
      "Suporte prioritário",
    ],
    color: "text-primary",
    buttonVariant: "default" as const,
  },
  {
    id: "agency",
    name: "Agency",
    price: "R$ 297",
    period: "/mês",
    description: "Para agências e gestores de múltiplos clientes",
    icon: Building2,
    features: [
      "50 projetos",
      "Tudo do Pro +",
      "Modo TV Wall",
      "Heatmap de conversão",
      "Dashboard comparativo ilimitado",
      "White-label completo",
      "Gestão de clientes",
      "Subcontas ilimitadas",
      "Suporte VIP",
    ],
    color: "text-chart-1",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para grandes operações",
    icon: Zap,
    features: [
      "Projetos ilimitados",
      "Tudo do Agency +",
      "SLA garantido",
      "Suporte dedicado",
      "Onboarding personalizado",
      "API customizada",
      "Treinamento exclusivo",
      "Consultoria estratégica",
    ],
    color: "text-chart-2",
    buttonVariant: "outline" as const,
  },
];

const Planos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const highlightedPlan = searchParams.get("plan");

  const handleSelectPlan = (planId: string) => {
    if (planId === "enterprise") {
      toast({
        title: "Entre em contato",
        description: "Nossa equipe entrará em contato para uma proposta personalizada",
      });
      return;
    }

    if (planId === "free") {
      navigate("/auth");
      return;
    }

    toast({
      title: "Em breve",
      description: "Sistema de pagamento em desenvolvimento",
    });
  };

  return (
    <TechBackground>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-sm text-white/50">Planos Atomic+</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Comece grátis e evolua conforme seu negócio cresce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isHighlighted = highlightedPlan === plan.id;
            const buttonClass =
              plan.buttonVariant === "default"
                ? "w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] font-semibold hover:brightness-110"
                : "w-full border-white/30 text-white hover:bg-white/10";
            
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:-translate-y-1 ${
                  plan.popular || isHighlighted
                    ? "border-white/50 shadow-[0_30px_90px_rgba(59,130,246,0.4)]"
                    : "border-white/10"
                }`}
              >
                {(plan.popular || isHighlighted) && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {isHighlighted ? "Recomendado" : "Mais Popular"}
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-white/70">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.color}`}>{plan.price}</span>
                      {plan.period && <span className="text-white/60 text-sm">{plan.period}</span>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="pt-4 border-t border-white/10">
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-white/50 text-sm">✕ {limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <Button className={buttonClass} variant={plan.buttonVariant} onClick={() => handleSelectPlan(plan.id)}>
                    {plan.id === "free" && "Começar Grátis"}
                    {plan.id === "pro" && "Assinar Pro"}
                    {plan.id === "agency" && "Assinar Agency"}
                    {plan.id === "enterprise" && "Falar com Vendas"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/70 mb-4">
            Tem dúvidas sobre qual plano escolher?
          </p>
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </TechBackground>
  );
};

export default Planos;
