import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 Atomic+ Analytics. Todos os direitos reservados.
          </div>
          <div className="flex gap-6 text-sm">
            <Link 
              to="/legal/terms" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              to="/legal/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link 
              to="/help" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
