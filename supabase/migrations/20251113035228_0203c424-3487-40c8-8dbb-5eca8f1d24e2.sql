-- Create storage bucket for visual snapshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('visual-snapshots', 'visual-snapshots', true)
ON CONFLICT (id) DO NOTHING;

-- Create visual_snapshots table
CREATE TABLE public.visual_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, snapshot_date)
);

-- Enable RLS
ALTER TABLE public.visual_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read access for visual snapshots
CREATE POLICY "Visual snapshots are viewable by everyone"
  ON public.visual_snapshots
  FOR SELECT
  USING (true);

-- Only authenticated users can insert snapshots
CREATE POLICY "Authenticated users can insert visual snapshots"
  ON public.visual_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Storage policies for visual-snapshots bucket
CREATE POLICY "Visual snapshot images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'visual-snapshots');

CREATE POLICY "Authenticated users can upload visual snapshots"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'visual-snapshots');

-- Create indexes
CREATE INDEX idx_visual_snapshots_project_id ON public.visual_snapshots(project_id);
CREATE INDEX idx_visual_snapshots_date ON public.visual_snapshots(snapshot_date DESC);