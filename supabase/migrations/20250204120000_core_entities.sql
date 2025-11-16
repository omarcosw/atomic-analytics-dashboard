-- Core data model for Atomic+ projects and metrics

-- Projects table ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'launch',
  status TEXT NOT NULL DEFAULT 'preparing',
  is_active BOOLEAN NOT NULL DEFAULT false,
  public_slug TEXT UNIQUE,
  start_date DATE,
  end_date DATE,
  goals JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own projects"
  ON public.projects
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(public_slug);

-- Dashboards settings -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dashboards_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  layout JSONB NOT NULL DEFAULT '{}'::jsonb,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

ALTER TABLE public.dashboards_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage dashboard settings for their projects"
  ON public.dashboards_settings
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = dashboards_settings.project_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = dashboards_settings.project_id
    )
  );

CREATE TRIGGER update_dashboards_settings_updated_at
BEFORE UPDATE ON public.dashboards_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Metrics -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  category TEXT,
  format TEXT NOT NULL DEFAULT 'number',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage metrics for their projects"
  ON public.metrics
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = metrics.project_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = metrics.project_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_metrics_project ON public.metrics(project_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_metrics_project_key ON public.metrics(project_id, key);

-- Custom metrics ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  definition JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage custom metrics for their projects"
  ON public.custom_metrics
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = custom_metrics.project_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = custom_metrics.project_id
    )
  );

CREATE TRIGGER update_custom_metrics_updated_at
BEFORE UPDATE ON public.custom_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Metric values -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metric_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_id UUID NOT NULL REFERENCES public.metrics(id) ON DELETE CASCADE,
  ref_date DATE NOT NULL,
  value NUMERIC NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_id, ref_date)
);

ALTER TABLE public.metric_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage metric values for their projects"
  ON public.metric_values
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = (
        SELECT project_id FROM public.metrics WHERE metrics.id = metric_values.metric_id
      )
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = (
        SELECT project_id FROM public.metrics WHERE metrics.id = metric_values.metric_id
      )
    )
  );

CREATE INDEX IF NOT EXISTS idx_metric_values_metric ON public.metric_values(metric_id);
CREATE INDEX IF NOT EXISTS idx_metric_values_ref_date ON public.metric_values(ref_date DESC);

-- User settings -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.users_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their settings"
  ON public.users_settings
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_users_settings_updated_at
BEFORE UPDATE ON public.users_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Project records (snapshots for onboarding/history) ------------------------
CREATE TABLE IF NOT EXISTS public.project_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access records for their projects"
  ON public.project_records
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = project_records.project_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.projects WHERE projects.id = project_records.project_id
    )
  );

CREATE INDEX IF NOT EXISTS idx_project_records_project ON public.project_records(project_id);
