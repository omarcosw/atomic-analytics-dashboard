/**
 * DADOS: Estado do Onboarding
 * 
 * Gerencia o progresso do usuário no onboarding inicial.
 * 
 * PASSOS:
 * 1. Criar primeiro dashboard
 * 2. Conectar Google Sheets
 * 3. Selecionar aba da planilha
 * 4. Configurar mapeamento de métricas
 * 5. Ativar dashboard
 * 6. Visualizar versão pública
 * 
 * ONDE É USADO:
 * - Tela de onboarding (/onboarding)
 * - Banner em "Meus Projetos"
 * - Navegação guiada
 */

export interface OnboardingState {
  completed: boolean;
  step: number;
  skipped: boolean;
}

export let demoOnboarding: OnboardingState = {
  completed: false,
  step: 1,
  skipped: false,
};

// Funções helper para atualizar o estado
export const updateOnboardingStep = (step: number) => {
  demoOnboarding.step = step;
};

export const completeOnboarding = () => {
  demoOnboarding.completed = true;
  demoOnboarding.step = 7; // Além do último passo
};

export const skipOnboarding = () => {
  demoOnboarding.skipped = true;
  demoOnboarding.completed = true;
};

export const resetOnboarding = () => {
  demoOnboarding = {
    completed: false,
    step: 1,
    skipped: false,
  };
};

export const isOnboardingActive = () => {
  return !demoOnboarding.completed && !demoOnboarding.skipped;
};
