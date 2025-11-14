import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Crown, Sparkles } from "lucide-react";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: "pro" | "agency" | "enterprise";
}

const planNames = {
  pro: "Pro",
  agency: "Agency",
  enterprise: "Enterprise",
};

const Paywall = ({ isOpen, onClose, feature, requiredPlan }: PaywallProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Torne-se {planNames[requiredPlan]} para desbloquear
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="font-semibold text-foreground">{feature}</span> está disponível apenas no plano{" "}
            <span className="font-semibold text-primary">{planNames[requiredPlan]}</span> ou superior.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              Desbloqueie recursos avançados como{" "}
              {requiredPlan === "pro" && "links públicos, PDF, IA Assistente, seções personalizadas e muito mais"}
              {requiredPlan === "agency" && "modo TV Wall, heatmaps, dashboards ilimitados e gestão de clientes"}
              {requiredPlan === "enterprise" && "projetos ilimitados, SLA e suporte dedicado"}
              .
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Agora não
          </Button>
          <Button onClick={() => navigate("/planos")} className="w-full sm:w-auto">
            Ver Planos
          </Button>
          <Button onClick={() => navigate("/planos?plan=" + requiredPlan)} className="w-full sm:w-auto bg-gradient-primary">
            <Crown className="w-4 h-4 mr-2" />
            Assinar Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;
