import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type Language = "pt-BR" | "en-US" | "es-ES";

type Dictionary = (typeof translations)[Language];

type I18nContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  dict: Dictionary;
};

const translations = {
  "pt-BR": {
    languageLabel: "Português (BR)",
    common: {
      brandTagline: "Dashboards inteligentes",
      brandDescription: "Monitoramento premium para métricas de lançamento.",
      support: "Precisa de suporte?",
      demo: "Ver demo",
      auth: {
        welcome: "Bem-vindo",
        subtitle: "Entre na sua conta ou crie uma nova",
        status: "Status operacional",
        statusHighlight: "Suporte em 24h",
        email: "Email",
        password: "Senha",
        remember: "Lembrar de mim",
        needHelp: "Precisa de ajuda?",
        forgot: "Esqueceu sua senha?",
        loginCta: "Acessar meu painel",
        loginLoading: "Conectando...",
        signupName: "Nome completo",
        signupConfirm: "Confirme a senha",
        errors: {
          emailRequired: "Digite o email cadastrado.",
          passwordShort: "A senha deve ter pelo menos 6 caracteres.",
        },
      },
    },
    index: {
      tagline: "Observabilidade IA para lançamentos",
      title: "Seu dashboard configurado e pronto em minutos",
      subtitle:
        "Conecte planilhas, automações e campanhas em um único dashboard. IA explica contextos, sinaliza alertas e gera apresentações automáticas.",
      benefits: [
        "Zero planilhas quebradas: mapeamento assistido pela IA.",
        "Alertas com contexto — nada de números soltos.",
        "Modo replay compartilhável em 1 clique.",
      ],
      ctaPrimary: "Começar agora",
      ctaSecondary: "Ver experiência",
      promptTitle: "Prompt IA em andamento",
      promptText: "“Explique o ROI do funil Neon nas últimas 48h”",
      squadsLabel: "Times conectados agora",
      squadsText: "43 squads analisando lançamentos",
      integrateButton: "Integrar fontes",
      stats: {
        analyzedLabel: "Dados analisados",
        analyzedTrend: "+38% este mês",
        responseLabel: "Tempo médio de resposta",
        responseTrend: "infra otimizada",
        playbooksLabel: "Playbooks prontos",
        playbooksTrend: "para funis e lançamentos",
      },
      previewDescription: "Alterne entre visão geral, funil ou tráfego para sentir o dashboard",
      previewTitle: "Simule o dashboard nas três visões",
      previewCopy: "Cada aba reproduz o ambiente real, com IA destacando insights e metas a cada mudança.",
      previewTabs: {
        overview: "Visão geral",
        funnel: "Funil",
        traffic: "Tráfego",
      },
      timelineTitle: "Como a IA conduz seu lançamento",
      timelineSubtitle: "Linha do tempo",
      timelineSteps: [
        { title: "Conecte fontes", description: "Sheets, tráfego, CRM e comunidade." },
        { title: "Mapeie em 1 clique", description: "IA sugere métricas, colunas e metas." },
        { title: "Receba alertas", description: "Insights automáticos a cada variação relevante." },
        { title: "Apresente instantaneamente", description: "Modo replay público ou privado." },
      ],
      resultsTitle: "O que resolvemos para seu time",
      resultsSubtitle: "Resultados reais",
      resultsCards: [
        {
          title: "Planilhas caóticas",
          pain: "Demora dias para consolidar dados de tráfego e CRM.",
          solution: "Conexões guiadas e IA sugerindo colunas. Configuração média em 27 min.",
          metric: "+82% agilidade",
        },
        {
          title: "Falta de contexto",
          pain: "Números sozinhos não explicam quedas de CPL ou ROI.",
          solution: "Alertas narrados em português claro, com recomendações.",
          metric: "-63% dúvidas de clientes",
        },
        {
          title: "Entregas manuais",
          pain: "Cada fechamento exige slides e prints.",
          solution: "Modo replay e link público criam apresentações em segundos.",
          metric: "+4,7 nota média",
        },
      ],
      closingTitle: "Pronto para pilotar?",
      closingDescription:
        "Receba onboarding assistido, importação dos dashboards atuais e squad de suporte na primeira semana.",
      closingPrimary: "Começar agora",
      closingSecondary: "Ver planos",
      modalTitle: "Preview da experiência",
      modalClose: "Continuar explorando",
      modalAction: "Abrir demo",
      modalFeatures: [
        { title: "Tempo real", description: "Cards reagem a cada atualização do Sheets." },
        { title: "Alertas IA", description: "Explicações automáticas sempre que algo muda." },
        { title: "Modo apresentação", description: "Compartilhe um replay pronto para o cliente." },
      ],
      features: [
        { title: "Integração Sheets", description: "Mapeamento guiado, atualização incremental e validação automática." },
        { title: "Insights IA", description: "Comentários automáticos apontando gargalos e oportunidades de escalar." },
        { title: "Alertas proativos", description: "Receba e-mails/Slack quando uma meta ameaça ser comprometida." },
        { title: "Automação conectada", description: "Dispare automações no Make/Zapier a partir das métricas do dashboard." },
        { title: "Camada de governança", description: "Histórico visual, auditoria e aprovação de cada alteração de métrica." },
        { title: "Replay apresentável", description: "Compartilhe um dashboard público em modo apresentação ou embed." },
      ],
    },
  },
  "en-US": {
    languageLabel: "English",
    common: {
      brandTagline: "Intelligent dashboards",
      brandDescription: "Premium monitoring for launch metrics.",
      support: "Need help?",
      demo: "View demo",
      auth: {
        welcome: "Welcome",
        subtitle: "Sign in or create a new account",
        status: "Operational status",
        statusHighlight: "Support within 24h",
        email: "Email",
        password: "Password",
        remember: "Remember me",
        needHelp: "Need assistance?",
        forgot: "Forgot your password?",
        loginCta: "Access my dashboard",
        loginLoading: "Connecting...",
        signupName: "Full name",
        signupConfirm: "Confirm password",
        errors: {
          emailRequired: "Enter your registered email.",
          passwordShort: "Password must be at least 6 characters.",
        },
      },
    },
    index: {
      tagline: "AI observability for launches",
      title: "Your dashboard configured and ready in minutes",
      subtitle:
        "Connect spreadsheets, automations and campaigns in one dashboard. AI explains context, flags risks and generates presentations automatically.",
      benefits: [
        "No more broken sheets: AI guides the mapping.",
        "Alerts with full context — no raw numbers.",
        "Share a replay-ready dashboard in one click.",
      ],
      ctaPrimary: "Start now",
      ctaSecondary: "See experience",
      promptTitle: "AI prompt running",
      promptText: '"Explain the ROI of the Neon funnel over the last 48h"',
      squadsLabel: "Teams connected right now",
      squadsText: "43 squads analyzing launches",
      integrateButton: "Connect sources",
      stats: {
        analyzedLabel: "Data analyzed",
        analyzedTrend: "+38% this month",
        responseLabel: "Avg. response time",
        responseTrend: "optimized stack",
        playbooksLabel: "Ready playbooks",
        playbooksTrend: "for funnels and launches",
      },
      previewDescription: "Switch between overview, funnel or traffic to feel the dashboard",
      previewTitle: "Simulate the dashboard across three views",
      previewCopy: "Each tab reflects the real environment, with AI highlighting insights as data changes.",
      previewTabs: {
        overview: "Overview",
        funnel: "Funnel",
        traffic: "Traffic",
      },
      timelineTitle: "How AI drives your launch",
      timelineSubtitle: "Timeline",
      timelineSteps: [
        { title: "Connect sources", description: "Sheets, paid media, CRM and community." },
        { title: "Map in one click", description: "AI suggests metrics, columns and goals." },
        { title: "Receive alerts", description: "Automatic insights whenever something changes." },
        { title: "Present instantly", description: "Replay mode, private or public." },
      ],
      resultsTitle: "What we solve for your team",
      resultsSubtitle: "Real results",
      resultsCards: [
        {
          title: "Chaotic spreadsheets",
          pain: "It takes days to consolidate media and CRM data.",
          solution: "Guided connections and AI mapping. Average setup in 27 min.",
          metric: "+82% faster",
        },
        {
          title: "No context",
          pain: "Numbers alone don’t explain CPL or ROI drops.",
          solution: "Alerts narrated with recommendations.",
          metric: "-63% client questions",
        },
        {
          title: "Manual reporting",
          pain: "Every update needs slides and screenshots.",
          solution: "Replay mode delivers presentations in seconds.",
          metric: "+4.7 satisfaction",
        },
      ],
      closingTitle: "Ready to pilot?",
      closingDescription:
        "Get assisted onboarding, import your current dashboards and count on our support squad during week one.",
      closingPrimary: "Start now",
      closingSecondary: "View plans",
      modalTitle: "Experience preview",
      modalClose: "Keep exploring",
      modalAction: "Open demo",
      modalFeatures: [
        { title: "Real time", description: "Cards react to every Sheets update." },
        { title: "AI alerts", description: "Automatic explanations for each variation." },
        { title: "Presentation mode", description: "Share a replay-ready deck in one click." },
      ],
      features: [
        { title: "Sheets integration", description: "Guided mapping, incremental updates and validation." },
        { title: "AI insights", description: "Automatic comments flag bottlenecks and opportunities." },
        { title: "Proactive alerts", description: "Get email/Slack when a goal is at risk." },
        { title: "Connected automation", description: "Trigger Make/Zapier actions straight from the dashboard." },
        { title: "Governance layer", description: "Visual history, audit trail and approvals for every edit." },
        { title: "Presentation replay", description: "Share a public dashboard in presentation or embed mode." },
      ],
    },
  },
  "es-ES": {
    languageLabel: "Español",
    common: {
      brandTagline: "Dashboards inteligentes",
      brandDescription: "Monitoreo premium para métricas de lanzamiento.",
      support: "¿Necesitas ayuda?",
      demo: "Ver demo",
      auth: {
        welcome: "Bienvenido",
        subtitle: "Ingresa o crea una nueva cuenta",
        status: "Estado operativo",
        statusHighlight: "Soporte en 24h",
        email: "Correo",
        password: "Contraseña",
        remember: "Recordarme",
        needHelp: "¿Necesitas ayuda?",
        forgot: "¿Olvidaste tu contraseña?",
        loginCta: "Acceder a mi panel",
        loginLoading: "Conectando...",
        signupName: "Nombre completo",
        signupConfirm: "Confirma la contraseña",
        errors: {
          emailRequired: "Ingresa el correo registrado.",
          passwordShort: "La contraseña debe tener al menos 6 caracteres.",
        },
      },
    },
    index: {
      tagline: "Observabilidad IA para lanzamientos",
      title: "Tu dashboard listo y configurado en minutos",
      subtitle:
        "Conecta hojas, automatizaciones y campañas en un solo dashboard. La IA explica el contexto, marca riesgos y genera presentaciones automáticas.",
      benefits: [
        "Nada de hojas rotas: la IA guía el mapeo.",
        "Alertas con contexto: no más números fríos.",
        "Modo replay compartible en un clic.",
      ],
      ctaPrimary: "Comenzar ahora",
      ctaSecondary: "Ver experiencia",
      promptTitle: "Prompt IA en ejecución",
      promptText: '"Explica el ROI del funnel Neon en las últimas 48h"',
      squadsLabel: "Equipos conectados ahora",
      squadsText: "43 squads analizando lanzamientos",
      integrateButton: "Integrar fuentes",
      stats: {
        analyzedLabel: "Datos analizados",
        analyzedTrend: "+38% este mes",
        responseLabel: "Tiempo medio de respuesta",
        responseTrend: "infra optimizada",
        playbooksLabel: "Playbooks listos",
        playbooksTrend: "para embudos y lanzamientos",
      },
      previewDescription: "Alterna entre visión general, embudo o tráfico para sentir el dashboard",
      previewTitle: "Simula el dashboard en tres vistas",
      previewCopy: "Cada pestaña refleja el entorno real, con IA señalando insights al instante.",
      previewTabs: {
        overview: "Visión general",
        funnel: "Embudo",
        traffic: "Tráfico",
      },
      timelineTitle: "Cómo la IA impulsa tu lanzamiento",
      timelineSubtitle: "Línea de tiempo",
      timelineSteps: [
        { title: "Conecta fuentes", description: "Sheets, tráfico, CRM y comunidad." },
        { title: "Mapea en un clic", description: "La IA sugiere métricas, columnas y metas." },
        { title: "Recibe alertas", description: "Insights automáticos ante cada variación." },
        { title: "Presenta al instante", description: "Modo replay público o privado." },
      ],
      resultsTitle: "Lo que resolvemos para tu equipo",
      resultsSubtitle: "Resultados reales",
      resultsCards: [
        {
          title: "Hojas caóticas",
          pain: "Toma días consolidar datos de tráfico y CRM.",
          solution: "Conexiones guiadas y mapeo asistido. Configuración media en 27 min.",
          metric: "+82% agilidad",
        },
        {
          title: "Falta de contexto",
          pain: "Los números solos no explican la caída del CPL o ROI.",
          solution: "Alertas narradas con recomendaciones accionables.",
          metric: "-63% dudas de clientes",
        },
        {
          title: "Reportes manuales",
          pain: "Cada entrega necesita slides y capturas.",
          solution: "Modo replay genera presentaciones en segundos.",
          metric: "+4,7 satisfacción",
        },
      ],
      closingTitle: "¿Listo para pilotar?",
      closingDescription:
        "Recibe onboarding asistido, importamos tus dashboards actuales y tendrás un squad de soporte la primera semana.",
      closingPrimary: "Comenzar ahora",
      closingSecondary: "Ver planes",
      modalTitle: "Vista previa",
      modalClose: "Seguir explorando",
      modalAction: "Abrir demo",
      modalFeatures: [
        { title: "Tiempo real", description: "Las tarjetas reaccionan a cada actualización." },
        { title: "Alertas IA", description: "Explicaciones automáticas de cada variación." },
        { title: "Modo presentación", description: "Comparte un replay en un clic." },
      ],
      features: [
        { title: "Integración Sheets", description: "Mapeo guiado, actualización incremental y validación automática." },
        { title: "Insights IA", description: "Comentarios automáticos señalan cuellos de botella y oportunidades." },
        { title: "Alertas proactivas", description: "Recibe correo/Slack cuando una meta está en riesgo." },
        { title: "Automatización conectada", description: "Dispara automatizaciones en Make/Zapier desde el dashboard." },
        { title: "Capa de gobernanza", description: "Historial visual, auditoría y aprobación de cada cambio." },
        { title: "Replay presentable", description: "Comparte un dashboard público en modo presentación o embed." },
      ],
    },
  },
} as const;

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>((localStorage.getItem("atomic-language") as Language) || "pt-BR");

  const value = useMemo(
    () => ({
      language,
      setLanguage: (lang: Language) => {
        localStorage.setItem("atomic-language", lang);
        setLanguage(lang);
      },
      dict: translations[language],
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};

export { translations };
