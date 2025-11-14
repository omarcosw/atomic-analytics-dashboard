import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MyProjects from "./pages/MyProjects";
import ProjectDashboard from "./pages/ProjectDashboard";
import PublicDashboard from "./pages/PublicDashboard";
import Agency from "./pages/Agency";
import Planos from "./pages/Planos";
import DataSources from "./pages/DataSources";
import Mapping from "./pages/Mapping";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/account/Profile";
import General from "./pages/settings/General";
import Appearance from "./pages/settings/Appearance";
import Help from "./pages/help/Index";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import NotFound from "./pages/NotFound";
import "./styles/theme.css";

const queryClient = new QueryClient();

const App = () => {
  // Aplicar tema no body
  const { currentTheme } = useThemeConfig();
  
  useEffect(() => {
    // Garantir que o tema seja aplicado
    document.body.classList.add(currentTheme.className);
  }, [currentTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/project/:id" element={<ProjectDashboard />} />
            <Route path="/d/:slug" element={<PublicDashboard />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/mapping" element={<Mapping />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/account/profile" element={<Profile />} />
            <Route path="/settings/general" element={<General />} />
            <Route path="/settings/appearance" element={<Appearance />} />
            <Route path="/help" element={<Help />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/planos" element={<Planos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
