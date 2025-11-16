import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TechBackground } from "@/components/layout/TechBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <TechBackground>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">Erro</p>
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-xl text-white/70">Oops! Page not found</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-[#030711] font-semibold hover:bg-white/90">
            Return to Home
          </a>
        </div>
      </div>
    </TechBackground>
  );
};

export default NotFound;
