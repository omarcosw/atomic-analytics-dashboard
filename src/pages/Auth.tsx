import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, BarChart3 } from "lucide-react";
import { TechBackground } from "@/components/layout/TechBackground";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  onBlur?: () => void;
  error?: string | null;
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
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  emailError: string | null;
  passwordError: string | null;
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

const heroSnapshots = {
  live: {
    badge: "Ao vivo",
    title: "Lançamento Atomic Summit",
    metrics: [
      { label: "Faturamento", value: "R$ 847.392", trend: "+24%", trendColor: "text-emerald-300" },
      { label: "Leads", value: "3.247", trend: "+18%", trendColor: "text-emerald-300" },
      { label: "ROI", value: "4,2x", trend: "+12%", trendColor: "text-emerald-300" },
      { label: "CPL", value: "R$ 12,50", trend: "-8%", trendColor: "text-rose-300" },
    ] satisfies HeroMetric[],
    chart: [30, 45, 35, 60, 80, 70, 50],
  },
  forecast: {
    badge: "Projeção IA",
    title: "Próxima turma · Fevereiro",
    metrics: [
      { label: "Receita projetada", value: "R$ 1,02M", trend: "+12%", trendColor: "text-emerald-300" },
      { label: "Leads estimados", value: "4.680", trend: "+22%", trendColor: "text-emerald-300" },
      { label: "ROI previsto", value: "4,8x", trend: "+9%", trendColor: "text-emerald-300" },
      { label: "CPL meta", value: "R$ 11,30", trend: "-6%", trendColor: "text-emerald-300" },
    ] satisfies HeroMetric[],
    chart: [25, 40, 58, 72, 95, 110, 130],
  },
};

const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  autoComplete,
  onChange,
  onBlur,
  error,
}: AuthInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-[11px] uppercase tracking-[0.25em] text-white/60">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      onBlur={onBlur}
      className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-white/40 focus-visible:ring-offset-0"
      required
    />
    {error && <p className="text-xs text-rose-300">{error}</p>}
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

const HeroShowcase = () => {
  const [snapshotKey, setSnapshotKey] = useState<keyof typeof heroSnapshots>("live");
  const snapshot = heroSnapshots[snapshotKey];

  return (
    <div className="hidden lg:flex flex-1 relative items-center justify-center px-12 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-80px] w-[360px] h-[360px] bg-blue-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-80px] right-[20px] w-[420px] h-[420px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl space-y-10 relative z-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold text-white leading-tight">
            Seu dashboard configurado e pronto em minutos
          </h1>

          <p className="text-base text-white/70 max-w-md leading-relaxed">
            Conecte Sheets e tráfego pago, visualize o pulso do lançamento e veja a IA sinalizar o que precisa da sua atenção agora.
          </p>
        </header>

        <div className="group bg-white/5 border border-white/15 rounded-[28px] backdrop-blur-3xl p-6 w-full shadow-[0_25px_90px_rgba(2,6,23,0.75)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_45px_120px_rgba(2,6,23,0.85)]">
          <div className="flex items-center justify-between mb-5 gap-4">
            <div>
              <p className="text-[11px] text-white/50 uppercase tracking-[0.35em]">Resumo em tempo real</p>
              <p className="text-base font-semibold text-white mt-1">{snapshot.title}</p>
            </div>
            <div className="flex bg-white/10 rounded-full p-1 border border-white/10">
              {(["live", "forecast"] as Array<keyof typeof heroSnapshots>).map((key) => (
                <button
                  key={key}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition",
                    snapshotKey === key ? "bg-white text-[#030711]" : "text-white/70 hover:text-white",
                  )}
                  onClick={() => setSnapshotKey(key)}
                >
                  {heroSnapshots[key].badge}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {snapshot.metrics.map((metric) => (
              <HeroMetricCard key={`${snapshotKey}-${metric.label}`} {...metric} />
            ))}
          </div>

          <HeroChart data={snapshot.chart} />
        </div>
        <footer className="pt-6 text-[11px] text-white/40">
          © 2024 Atomic+ Analytics. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

const MobileLogo = () => (
  <div className="lg:hidden text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 mb-4 shadow-[0_15px_45px_rgba(59,130,246,0.45)]">
      <BarChart3 className="w-8 h-8 text-white" />
    </div>
    <h1 className="text-2xl font-bold text-white">Atomic+ Analytics</h1>
    <p className="text-sm text-white/60 mt-2">Monitoramento premium para métricas de lançamento.</p>
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
  onEmailBlur,
  onPasswordBlur,
  emailError,
  passwordError,
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
      onBlur={onEmailBlur}
      error={emailError}
    />
    <AuthInput
      id="login-password"
      label="Senha"
      type="password"
      placeholder="••••••••"
      value={password}
      autoComplete="current-password"
      onChange={(event) => onPasswordChange(event.target.value)}
      onBlur={onPasswordBlur}
      error={passwordError}
    />
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={rememberMe}
        onCheckedChange={(checked) => onRememberMeChange(checked === true)}
        className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:border-white"
      />
      <label
        htmlFor="remember"
        className="text-sm font-medium leading-none text-white/80"
      >
        Lembrar de mim
      </label>
    </div>
    <Button
      type="submit"
      className={cn(
        "w-full font-semibold transition hover:-translate-y-0.5",
        email && password && !emailError && !passwordError
          ? "bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-slate-950 shadow-[0_18px_45px_rgba(59,130,246,0.45)] hover:brightness-110"
          : "bg-white/10 text-white/50 border border-white/10 cursor-not-allowed",
      )}
      disabled={isLoading || !email || !password || !!emailError || !!passwordError}
    >
      {isLoading ? "Conectando..." : "Acessar meu painel"}
    </Button>
    <div className="flex items-center justify-between text-xs text-white/60">
      <span>Precisa de ajuda?</span>
      <button type="button" className="text-white underline underline-offset-4">
        Esqueceu sua senha?
      </button>
    </div>
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
      className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-[0_18px_45px_rgba(76,29,149,0.45)] hover:brightness-110 transition hover:-translate-y-0.5"
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
  <Card className="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_35px_120px_rgba(2,6,23,0.65)] rounded-[32px] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_45px_150px_rgba(2,6,23,0.75)]">
    <CardHeader className="space-y-1">
      <CardTitle className="text-3xl text-white">Bem-vindo</CardTitle>
      <CardDescription className="text-base text-white/60">
        Entre na sua conta ou crie uma nova
      </CardDescription>
    </CardHeader>
    <CardContent>
      {error && (
        <Alert className="mb-4 border-red-500/40 bg-red-500/10 text-red-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="login" className="w-full mt-2 text-white">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-2xl p-1 text-sm">
          <TabsTrigger
            value="login"
            className="rounded-xl text-white/60 data-[state=active]:bg-white/90 data-[state=active]:text-[#030711] data-[state=active]:shadow-lg transition"
          >
            Entrar
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-xl text-white/60 data-[state=active]:bg-white/90 data-[state=active]:text-[#030711] data-[state=active]:shadow-lg transition"
          >
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
  const { signIn, signUp } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginEmailTouched, setLoginEmailTouched] = useState(false);
  const [loginPasswordTouched, setLoginPasswordTouched] = useState(false);
  
  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginEmailTouched(true);
    setLoginPasswordTouched(true);
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(loginEmail, loginPassword);

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
      if (!registerName || !registerEmail || !registerPassword) {
        setError("Todos os campos são obrigatórios");
        setIsLoading(false);
        return;
      }

      if (registerPassword !== registerConfirmPassword) {
        setError("As senhas não coincidem");
        setIsLoading(false);
        return;
      }

      if (registerPassword.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres");
        setIsLoading(false);
        return;
      }

      const result = await signUp(registerName, registerEmail, registerPassword);

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

  const loginEmailError = loginEmailTouched && !loginEmail ? "Digite o email cadastrado." : null;
  const loginPasswordError =
    loginPasswordTouched && loginPassword.length < 6 ? "A senha deve ter pelo menos 6 caracteres." : null;
  return (
    <TechBackground>
      <div className="flex flex-col min-h-screen">
        <header className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_15px_45px_rgba(59,130,246,0.5)]">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold">Atomic+ Analytics</p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Futuristic dashboards</p>
              </div>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
                onClick={() => navigate("/help")}
              >
                Precisa de suporte?
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-col lg:flex-row flex-1 gap-10 px-6 pb-12">
          <HeroShowcase />

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
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
                  onEmailBlur: () => setLoginEmailTouched(true),
                  onPasswordBlur: () => setLoginPasswordTouched(true),
                  emailError: loginEmailError,
                  passwordError: loginPasswordError,
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
        </main>
      </div>
    </TechBackground>
  );
};

export default Auth;
