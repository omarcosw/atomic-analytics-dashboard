-- Seed script for local development
-- Creates a demo user, project, metrics and sample snapshots

DO $$
DECLARE
  demo_user uuid;
  created_user jsonb;
  default_project uuid;
  metric_faturamento uuid;
  metric_leads uuid;
  metric_roi uuid;
  metric_cpl uuid;
BEGIN
  SELECT id INTO demo_user FROM auth.users WHERE email = 'demo@atomic.com';

  IF demo_user IS NULL THEN
    SELECT auth.admin.create_user(
      jsonb_build_object(
        'email', 'demo@atomic.com',
        'password', 'atomic123',
        'email_confirm', true,
        'user_metadata', jsonb_build_object('full_name', 'Demo Atomic')
      )
    ) INTO created_user;

    SELECT id INTO demo_user FROM auth.users WHERE email = 'demo@atomic.com';
  END IF;

  INSERT INTO public.users_settings (user_id, preferences, theme)
  VALUES (
    demo_user,
    jsonb_build_object('locale', 'pt-BR', 'currency', 'BRL'),
    'default'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET preferences = EXCLUDED.preferences;

  SELECT id INTO default_project
  FROM public.projects
  WHERE user_id = demo_user AND name = 'Lançamento Novembro 2024';

  IF default_project IS NULL THEN
    INSERT INTO public.projects (
      user_id,
      name,
      type,
      status,
      is_active,
      public_slug,
      start_date,
      end_date,
      goals
    ) VALUES (
      demo_user,
      'Lançamento Novembro 2024',
      'launch',
      'running',
      true,
      'dash-1-a3f9d2',
      '2024-11-01',
      '2024-11-30',
      jsonb_build_object(
        'leadsTarget', 1500,
        'revenueTarget', 50000,
        'maxCPL', 15,
        'minROI', 200
      )
    )
    RETURNING id INTO default_project;
  END IF;

  -- Metrics
  INSERT INTO public.metrics (project_id, key, label, category, format, is_primary, sort_order)
  VALUES
    (default_project, 'faturamento_total', 'Faturamento Total', 'overview', 'currency', true, 1),
    (default_project, 'leads_captados', 'Leads Captados', 'overview', 'number', true, 2),
    (default_project, 'roi', 'ROI', 'overview', 'percent', true, 3),
    (default_project, 'cpl', 'CPL (Custo por Lead)', 'overview', 'currency', true, 4)
  ON CONFLICT (project_id, key) DO NOTHING;

  SELECT id INTO metric_faturamento FROM public.metrics
    WHERE project_id = default_project AND key = 'faturamento_total';
  SELECT id INTO metric_leads FROM public.metrics
    WHERE project_id = default_project AND key = 'leads_captados';
  SELECT id INTO metric_roi FROM public.metrics
    WHERE project_id = default_project AND key = 'roi';
  SELECT id INTO metric_cpl FROM public.metrics
    WHERE project_id = default_project AND key = 'cpl';

  -- Metric values (last 7 days)
  INSERT INTO public.metric_values (metric_id, ref_date, value, source)
  VALUES
    (metric_faturamento, '2024-11-10', 3200, 'sheets'),
    (metric_faturamento, '2024-11-11', 4100, 'sheets'),
    (metric_faturamento, '2024-11-12', 3850, 'sheets'),
    (metric_faturamento, '2024-11-13', 5200, 'sheets'),
    (metric_faturamento, '2024-11-14', 4700, 'sheets'),
    (metric_leads, '2024-11-10', 60, 'sheets'),
    (metric_leads, '2024-11-11', 74, 'sheets'),
    (metric_leads, '2024-11-12', 69, 'sheets'),
    (metric_leads, '2024-11-13', 88, 'sheets'),
    (metric_leads, '2024-11-14', 81, 'sheets'),
    (metric_roi, '2024-11-14', 285, 'calculated'),
    (metric_cpl, '2024-11-14', 12.5, 'calculated')
  ON CONFLICT (metric_id, ref_date) DO UPDATE SET value = EXCLUDED.value;

  -- Daily snapshots
  INSERT INTO public.daily_snapshots (
    project_id,
    snapshot_date,
    leads,
    revenue,
    roi,
    conversion,
    ticket,
    investimento,
    metrics_data
  ) VALUES
    (default_project, '2024-11-14', 81, 4700, 285, 3.8, 247, 15580,
      jsonb_build_object(
        'faturamento', 4700,
        'leads', 81,
        'roi', 285,
        'cpl', 12.5
      )
    )
  ON CONFLICT (project_id, snapshot_date) DO NOTHING;

  -- Notes sample
  INSERT INTO public.project_notes (project_id, user_id, content)
  VALUES (
    default_project,
    demo_user,
    'Acompanhar meta de leads nos próximos 3 dias e ajustar investimento em Meta Ads.'
  )
  ON CONFLICT DO NOTHING;
END $$;
