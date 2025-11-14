import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthFake } from "@/hooks/useAuthFake";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3 } from "lucide-react";

type HeroMetric = {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
};

type AuthInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type LoginFormProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type SignupFormProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const heroMetrics: HeroMetric[] = [
  {
    label: "Faturamento total",
    value: "R$ 847.392",
    trend: "+24%",
    trendColor: "text-emerald-300",
  },
  {
    label: "Leads",
    value: "3.247",
    trend: "+18%",
    trendColor: "text-emerald-300",
  },
  {
    label: "ROI",
    value: "4,2x",
    trend: "+12%",
    trendColor: "text-emerald-300",
  },
  {
    label: "CPL",
    value: "R$ 12,50",
    trend: "-8%",
    trendColor: "text-rose-300",
  },
];

const heroChartData = [30, 45, 35, 60, 80, 70, 50];

const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  autoComplete,
  onChange,
}: AuthInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="bg-white/80 border-slate-200 shadow-sm focus-visible:ring-slate-900/30"
      required
    />
  </div>
);

const HeroMetricCard = ({ label, value, trend, trendColor }: HeroMetric) => (
  <div className="bg-white/6 rounded-2xl px-4 py-3 flex flex-col gap-1 border border-white/10 transition-all duration-200 hover:bg-white/16 hover:border-white/30 hover:-translate-y-1">
    <span className="text-[11px] uppercase tracking-wide text-white/60">{label}</span>
    <div className="flex items-baseline justify-between">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className={`text-xs ${trendColor}`}>{trend}</span>
    </div>
  </div>
);

const HeroChart = ({ data }: { data: number[] }) => (
  <div className="mt-5 opacity-80 transition-opacity duration-200 group-hover:opacity-100">
    <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
      <span>Faturamento diário</span>
      <span>Últimos 7 dias</span>
    </div>
    <div className="flex items-end gap-2 h-20">
      {data.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className="flex-1 rounded-full bg-white/25 transition-all duration-300 group-hover:bg-white/40"
          style={{ height: `${height}%`, transitionDelay: `${index * 40}ms` }}
        />
      ))}
    </div>
  </div>
);

const HeroShowcase = () => (
  <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#1856ff] via-[#1f4fff] to-[#0f2fd1] text-white items-center justify-center px-16 py-10">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[-200px] left-[-200px] w-[480px] h-[480px] bg-white/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[380px] h-[380px] bg-blue-300/20 rounded-full blur-[130px]" />
    </div>

    <div className="w-full max-w-xl space-y-10 relative z-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm font-medium tracking-wide text-white/70">
            Dashboard para lançamentos
          </span>
        </div>

        <h1 className="text-3xl font-semibold text-white">
          Atomic+ Analytics
        </h1>

        <p className="text-sm text-white/75 max-w-sm leading-relaxed">
          Dashboards inteligentes para infoprodutores. Acompanhe suas métricas,
          gerencie seus lançamentos e tome decisões baseadas em dados reais.
        </p>
      </header>

      <div className="group bg-white/10 border border-white/15 rounded-3xl backdrop-blur-xl p-6 w-full shadow-[0_18px_60px_rgba(15,23,42,0.55)] transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_26px_90px_rgba(15,23,42,0.85)] hover:bg-white/14 cursor-pointer">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wide">Resumo em tempo real</p>
            <p className="text-base font-semibold text-white mt-1">Lançamento Novembro 2024</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-200 text-[11px] font-medium">
            Demo interativo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {heroMetrics.map((metric) => (
            <HeroMetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <HeroChart data={heroChartData} />
      </div>

      <footer className="pt-4 text-[11px] text-white/40">
        © 2024 Atomic+ Analytics. Todos os direitos reservados.
      </footer>
    </div>
  </div>
);

const MobileLogo = () => (
  <div className="lg:hidden text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1553ff] to-[#1d4ed8] mb-4 shadow-lg">
      <BarChart3 className="w-8 h-8 text-white" />
    </div>
    <h1 className="text-2xl font-bold text-slate-900">
      Atomic+ Analytics
    </h1>
    <p className="text-sm text-slate-500 mt-2">
      Monitoramento premium para métricas de lançamento.
    </p>
  </div>
);

const LoginForm = ({
  email,
  password,
  rememberMe,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: LoginFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <AuthInput
      id="login-email"
      label="Email"
      type="email"
      placeholder="seu@email.com"
      value={email}
      autoComplete="email"
      onChange={(event) => onEmailChange(event.target.value)}
    />
    <AuthInput
      id="login-password"
      label="Senha"
      type="password"
      placeholder="••••••••"
      value={password}
      autoComplete="current-password"
      onChange={(event) => onPasswordChange(event.target.value)}
    />
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={rememberMe}
        onCheckedChange={(checked) => onRememberMeChange(checked === true)}
        className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
      />
      <label
        htmlFor="remember"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Lembrar de mim
      </label>
    </div>
    <Button
      type="submit"
      className="w-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition hover:-translate-y-0.5"
      disabled={isLoading}
    >
      {isLoading ? "Entrando..." : "Entrar"}
    </Button>
  </form>
);

const SignupForm = ({
  name,
  email,
  password,
  confirmPassword,
  isLoading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: SignupFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <AuthInput
      id="signup-name"
      label="Nome completo"
      placeholder="Seu nome"
      value={name}
      autoComplete="name"
      onChange={(event) => onNameChange(event.target.value)}
    />
    <AuthInput
      id="signup-email"
      label="Email"
      type="email"
      placeholder="seu@email.com"
      value={email}
      autoComplete="email"
      onChange={(event) => onEmailChange(event.target.value)}
    />
    <AuthInput
      id="signup-password"
      label="Senha"
      type="password"
      placeholder="••••••••"
      value={password}
      autoComplete="new-password"
      onChange={(event) => onPasswordChange(event.target.value)}
    />
    <AuthInput
      id="signup-confirm-password"
      label="Confirme a senha"
      type="password"
      placeholder="••••••••"
      value={confirmPassword}
      autoComplete="new-password"
      onChange={(event) => onConfirmPasswordChange(event.target.value)}
    />
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/15 hover:shadow-slate-900/25 transition hover:-translate-y-0.5"
      disabled={isLoading}
    >
      {isLoading ? "Criando conta..." : "Criar conta"}
    </Button>
  </form>
);

const AuthCard = ({
  error,
  loginFormProps,
  signupFormProps,
}: {
  error: string | null;
  loginFormProps: LoginFormProps;
  signupFormProps: SignupFormProps;
}) => (
  <Card className="border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_70px_rgba(15,23,42,0.12)] rounded-3xl transition-all duration-500 hover:-translate-y-0.5">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl text-slate-900">Bem-vindo</CardTitle>
      <CardDescription className="text-base text-slate-500">
        Entre na sua conta ou crie uma nova
      </CardDescription>
    </CardHeader>
    <CardContent>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="login" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-2xl p-1">
          <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            Entrar
          </TabsTrigger>
          <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            Criar conta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm {...loginFormProps} />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm {...signupFormProps} />
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuthFake();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(loginEmail, loginPassword);

      if (result.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate("/projects");
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch {
      setError("Erro inesperado ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await register(
        registerName,
        registerEmail,
        registerPassword,
        registerConfirmPassword
      );

      if (result.success) {
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao Atomic+!",
        });
        navigate("/onboarding");
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch {
      setError("Erro inesperado ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.1),_transparent_50%)]" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(135deg,rgba(15,23,42,0.2),transparent)]" />
      <HeroShowcase />

      <div className="flex-1 flex items-center justify-center bg-slate-50/90 px-6 relative">
        <div className="absolute top-10 right-16 hidden lg:block w-36 h-36 bg-gradient-to-br from-slate-200 to-white rounded-3xl blur-3xl opacity-70" />
        <div className="w-full max-w-md relative z-10 space-y-8">
          <MobileLogo />

          <AuthCard
            error={error}
            loginFormProps={{
              email: loginEmail,
              password: loginPassword,
              rememberMe,
              isLoading,
              onEmailChange: setLoginEmail,
              onPasswordChange: setLoginPassword,
              onRememberMeChange: setRememberMe,
              onSubmit: handleLogin,
            }}
            signupFormProps={{
              name: registerName,
              email: registerEmail,
              password: registerPassword,
              confirmPassword: registerConfirmPassword,
              isLoading,
              onNameChange: setRegisterName,
              onEmailChange: setRegisterEmail,
              onPasswordChange: setRegisterPassword,
              onConfirmPasswordChange: setRegisterConfirmPassword,
              onSubmit: handleSignup,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
