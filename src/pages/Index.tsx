import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Zap,
  FileSpreadsheet,
  TrendingUp,
  Sparkles,
  Cpu,
  ShieldCheck,
  PlayCircle,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/context/i18n";

const PREVIEW_TABS: Array<"overview" | "funnel" | "traffic"> = ["overview", "funnel", "traffic"];

const Index = () => {
  const navigate = useNavigate();
  const { dict } = useI18n();
  const [previewTab, setPreviewTab] = useState<"overview" | "funnel" | "traffic">("overview");
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [heroTheme, setHeroTheme] = useState<"neon" | "noir">("neon");
  const statConfigs = useMemo(
    () => [
      {
        label: dict.index.stats.analyzedLabel,
        trend: dict.index.stats.analyzedTrend,
        target: 12.4,
        formatter: (value: number) => `${value.toFixed(1)}M`,
      },
      {
        label: dict.index.stats.responseLabel,
        trend: dict.index.stats.responseTrend,
        target: 2.4,
        formatter: (value: number) => `${value.toFixed(1)}s`,
      },
      {
        label: dict.index.stats.playbooksLabel,
        trend: dict.index.stats.playbooksTrend,
        target: 34,
        formatter: (value: number) => `${Math.round(value)} templates`,
      },
    ],
    [dict],
  );
  const [statValues, setStatValues] = useState(() => statConfigs.map(() => 0));

  const floatingOrbs = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        size: Math.random() * 120 + 40,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.3 + 0.15,
      })),
    [],
  );

  const pulseLines = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        top: Math.random() * 80 + 10,
        delay: Math.random() * 3,
        duration: Math.random() * 6 + 6,
      })),
    [],
  );

  const twinkles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        id: index,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 6,
      })),
    [],
  );

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      setStatValues(statConfigs.map((stat) => stat.target * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [statConfigs]);

  useEffect(() => {
    const id = setInterval(() => {
      setPreviewTab((current) => {
        const index = PREVIEW_TABS.indexOf(current);
        return PREVIEW_TABS[(index + 1) % PREVIEW_TABS.length];
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const heroClasses = cn(
    "min-h-screen text-white relative overflow-hidden transition-colors duration-700",
    heroTheme === "neon" ? "bg-[#030711]" : "bg-[#040b1a]",
  );

  return (
    <div className={heroClasses}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="particle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          {[...Array(40)].map((_, index) => {
            const size = Math.random() * 8 + 4;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            return <circle key={index} cx={`${x}%`} cy={`${y}%`} r={size} fill="url(#particle)" opacity="0.4" />;
          })}
        </svg>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {floatingOrbs.map((orb) => (
          <span
            key={orb.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/40 via-blue-500/20 to-purple-500/35 shadow-[0_0_90px_rgba(14,165,233,0.55)] blur-3xl animate-orb"
            style={{
              width: orb.size,
              height: orb.size,
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              animationDuration: `${orb.duration}s`,
              animationDelay: `${orb.delay}s`,
              opacity: orb.opacity,
            }}
          />
        ))}
        {pulseLines.map((line) => (
          <span
            key={`pulse-${line.id}`}
            className="absolute h-px w-1/2 left-1/4 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent animate-pulse-line"
            style={{ top: `${line.top}%`, animationDuration: `${line.duration}s`, animationDelay: `${line.delay}s` }}
          />
        ))}
        {twinkles.map((star) => (
          <span
            key={`twinkle-${star.id}`}
            className="absolute rounded-full bg-white/70 animate-twinkle"
            style={{
              width: star.size,
              height: star.size,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="container mx-auto px-6 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_20px_45px_rgba(79,70,229,0.35)]">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Atomic+ Analytics</span>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => navigate("/dashboards")}>
              Ver demo
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="border border-white/30 bg-white/5 text-white hover:bg-white/10"
            >
              Entrar
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => setHeroTheme((prev) => (prev === "neon" ? "noir" : "neon"))}
            >
              {heroTheme === "neon" ? "Modo Noir" : "Modo Neon"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 relative z-10">
          <section className="py-16 md:py-24 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide text-white/70">
              <Sparkles className="w-4 h-4 text-blue-300" />
              Observabilidade IA para lançamentos
            </div>

            <h1 className="mt-6 text-center text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-hero-glow">
              Sua central inteligente de métricas
              <br className="hidden md:block" /> com visual futurista.
            </h1>

            <p className="text-center text-lg md:text-xl text-white/70 max-w-3xl mt-6">{dict.index.subtitle}</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full max-w-4xl">
              {dict.index.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-1" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-white font-semibold shadow-[0_15px_60px_rgba(59,130,246,0.45)] hover:brightness-110"
                onClick={() => navigate("/auth")}
              >
                {dict.index.ctaPrimary}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-white/60 bg-white/90 text-black hover:bg-white hover:text-black shadow-[0_10px_40px_rgba(8,105,255,0.35)]"
                onClick={() => setExperienceOpen(true)}
              >
                {dict.index.ctaSecondary}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="mt-8 grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-lg p-4 flex items-center gap-3 shadow-[0_20px_60px_rgba(15,23,42,0.5)]">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400/80 to-blue-500/80 flex items-center justify-center text-[#030711] font-semibold">
                  IA
                </div>
                <div>
                  <p className="text-sm text-white/60">{dict.index.promptTitle}</p>
                  <p className="text-base font-semibold">{dict.index.promptText}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 flex flex-wrap items-center gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={`avatar-${index}`}
                      className="h-8 w-8 rounded-full border border-[#030711] bg-gradient-to-br from-blue-500 to-purple-500"
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60">{dict.index.squadsLabel}</p>
                  <p className="font-semibold">{dict.index.squadsText}</p>
                </div>
                <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => navigate("/data-sources")}> 
                  {dict.index.integrateButton}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-14">
              {statConfigs.map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-sm hover:-translate-y-1 transition-all"
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                  <div className="flex items-end justify-between mt-4">
                    <span className="text-3xl font-semibold">{stat.formatter(statValues[index])}</span>
                    <span className="text-xs text-emerald-300">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full mt-14">
              <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/15 to-white/0 p-6 md:p-10 shadow-[0_50px_160px_rgba(9,12,32,0.95)]">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Activity className="w-4 h-4 text-emerald-300" />
                      {dict.index.previewDescription}
                    </div>
                    <p className="text-2xl font-semibold text-white">{dict.index.previewTitle}</p>
                    <p className="text-white/70">{dict.index.previewCopy}</p>
                    <div className="flex flex-wrap gap-3">
                      {PREVIEW_TABS.map((tab) => (
                        <Button
                          key={tab}
                          variant={previewTab === tab ? "default" : "outline"}
                          className={
                            previewTab === tab
                              ? "bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-black"
                              : "border-white/20 text-white/70 hover:text-white"
                          }
                          onClick={() => setPreviewTab(tab)}
                        >
                          {tab === "overview" ? "Visão geral" : tab === "funnel" ? "Funil" : "Tráfego"}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-[#090f24]/70 rounded-2xl border border-white/15 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/10 blur-3xl opacity-70" />
                    <div className="relative space-y-5">
                      {previewTab === "overview" && (
                        <>
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Receita projetada</span>
                            <span className="text-emerald-300 font-semibold">+18% vs última semana</span>
                          </div>
                          <div className="h-32 rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-3 flex items-end gap-2">
                            {[40, 55, 65, 80, 72, 90, 110].map((value, index) => (
                              <span
                                key={`bar-${value}-${index}`}
                                className="flex-1 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300 shadow-[0_8px_20px_rgba(14,165,233,0.25)]"
                                style={{ height: `${value}%` }}
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <p className="text-white/50">Leads do dia</p>
                              <p className="text-2xl font-semibold">418</p>
                              <p className="text-emerald-300 text-xs mt-1">+32% vs ontem</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <p className="text-white/50">Ticket médio</p>
                              <p className="text-2xl font-semibold">R$ 497</p>
                              <p className="text-white/50 text-xs mt-1">otimizado por IA</p>
                            </div>
                          </div>
                        </>
                      )}
                      {previewTab === "funnel" && (
                        <div className="space-y-4">
                          {[
                            { label: "Visitantes", value: "32.480", rate: "100%" },
                            { label: "Leads", value: "9.420", rate: "29%" },
                            { label: "Checkouts", value: "1.174", rate: "3,6%" },
                            { label: "Clientes", value: "842", rate: "2,5%" },
                          ].map((stage, index) => (
                            <div key={stage.label} className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <span>{stage.label}</span>
                                <span>{stage.rate}</span>
                              </div>
                              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                                  style={{ width: `${100 - index * 20}%` }}
                                />
                              </div>
                              <p className="text-white font-semibold">{stage.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {previewTab === "traffic" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Origem de tráfego</span>
                            <span>ROI</span>
                          </div>
                          {[
                            { label: "Meta ads", roi: "5,8x", spend: "R$ 48k" },
                            { label: "YouTube orgânico", roi: "∞", spend: "Conteúdo" },
                            { label: "Afiliados", roi: "3,2x", spend: "R$ 12k" },
                          ].map((source) => (
                            <div
                              key={source.label}
                              className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-semibold">{source.label}</p>
                                <p className="text-xs text-white/60">Investimento: {source.spend}</p>
                              </div>
                              <span className="text-emerald-300 font-semibold text-lg">{source.roi}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        <section className="py-16">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">{dict.index.timelineSubtitle}</p>
            <h2 className="text-3xl font-semibold text-white mt-2">{dict.index.timelineTitle}</h2>
          </div>
          <div className="relative w-full max-w-5xl mx-auto">
            <span className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse-line" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {dict.index.timelineSteps.map((event, index) => (
                <div key={event.title} className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <span className="w-12 h-12 rounded-2xl border border-white/30 bg-white/10 flex items-center justify-center text-lg font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">{event.title}</p>
                  <p className="text-white/60 text-sm">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="w-full max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="uppercase text-xs tracking-[0.3em] text-white/50">Confiado por equipes de lançamento</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Nuvem Labs", "Growthmind", "Orbital Stage", "Flow Media", "Trinity"].map((brand) => (
                  <span key={brand} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.65)]">
              <p className="text-sm text-white/60">Depoimento em destaque</p>
              <p className="text-2xl font-semibold mt-3">
                “Com o Atomic+, reduzimos o tempo de reporte em 82% e elevamos o ROI do último lançamento para 6,1x. É
                literalmente ter um co-piloto de growth.”
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                <div>
                  <p className="font-semibold">Lia Monteiro</p>
                  <p className="text-white/60 text-sm">Head de Growth · Dobra Labs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">{dict.index.resultsSubtitle}</p>
            <h2 className="text-3xl font-semibold text-white mt-2">{dict.index.resultsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            {dict.index.resultsCards.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                <div className="text-sm uppercase tracking-[0.3em] text-white/50">{item.title}</div>
                <p className="text-white/70 text-sm">{item.pain}</p>
                <p className="text-white font-semibold">{item.solution}</p>
                <p className="text-emerald-300 text-sm">{item.metric}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Pronto para pilotar?</p>
              <h3 className="text-3xl font-semibold text-white">Transforme seus lançamentos em 24h</h3>
              <p className="text-white/70">
                Receba onboarding assistido, importação dos dashboards atuais e squad de suporte disponível durante toda a primeira semana.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={() => navigate("/planos")}>
                Ver planos
              </Button>
              <Button className="bg-white text-[#030711] hover:bg-white/90" onClick={() => navigate("/auth")}>
                Começar agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <section className="border-t border-white/10 bg-white/5/50">
        <main className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FileSpreadsheet,
              title: "Integração Sheets",
              description: "Mapeamento guiado, atualização incremental e validação automática.",
            },
            {
              icon: TrendingUp,
              title: "Insights IA",
              description: "Comentários automáticos apontando gargalos e oportunidades de escalar.",
            },
            {
              icon: Zap,
              title: "Alertas proativos",
              description: "Receba e-mails/Slack quando uma meta ameaça ser comprometida.",
            },
            {
              icon: Cpu,
              title: "Automação conectada",
              description: "Dispare automações no Make/Zapier a partir das métricas do dashboard.",
            },
            {
              icon: ShieldCheck,
              title: "Camada de governança",
              description: "Histórico visual, auditoria e aprovação de cada alteração de métrica.",
            },
            {
              icon: PlayCircle,
              title: "Replay apresentável",
              description: "Compartilhe um dashboard público em modo apresentação ou embed.",
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-[0_15px_45px_rgba(79,70,229,0.4)]">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-xl font-semibold">{feature.title}</p>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </main>
      </section>

      {experienceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-6">
          <div className="max-w-2xl w-full rounded-3xl border border-white/10 bg-[#051024] p-8 space-y-6 shadow-[0_35px_90px_rgba(2,6,23,0.65)]">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Preview da experiência</p>
              <Button variant="ghost" className="text-white/70" onClick={() => setExperienceOpen(false)}>
                Fechar
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {EXPERIENCE_FEATURES.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-white/60 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" className="border-white/20 text-white motion-safe:cta-bounce" onClick={() => setExperienceOpen(false)}>
                Continuar explorando
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-[#030711] motion-safe:cta-bounce"
                onClick={() => navigate("/dashboards")}
              >
                Abrir demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
