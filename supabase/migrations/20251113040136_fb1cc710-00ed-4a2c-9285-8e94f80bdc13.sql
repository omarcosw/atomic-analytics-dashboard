-- Create daily_snapshots table for time travel analytics
CREATE TABLE IF NOT EXISTS public.daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  leads INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  roi DECIMAL(8,2) DEFAULT 0,
  conversion DECIMAL(5,2) DEFAULT 0,
  ticket DECIMAL(12,2) DEFAULT 0,
  investimento DECIMAL(12,2) DEFAULT 0,
  metrics_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, snapshot_date)
);

-- Enable RLS
ALTER TABLE public.daily_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read access for snapshots
CREATE POLICY "Daily snapshots are viewable by everyone"
  ON public.daily_snapshots
  FOR SELECT
  USING (true);

-- Authenticated users can insert snapshots
CREATE POLICY "Authenticated users can insert daily snapshots"
  ON public.daily_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update snapshots
CREATE POLICY "Authenticated users can update daily snapshots"
  ON public.daily_snapshots
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_daily_snapshots_project_date ON public.daily_snapshots(project_id, snapshot_date DESC);
CREATE INDEX idx_daily_snapshots_date ON public.daily_snapshots(snapshot_date DESC);