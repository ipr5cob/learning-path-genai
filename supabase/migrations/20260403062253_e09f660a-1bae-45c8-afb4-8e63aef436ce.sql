CREATE TABLE public.saved_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_learning_paths_user_id ON public.saved_learning_paths (user_id);

ALTER TABLE public.saved_learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage their own paths"
  ON public.saved_learning_paths
  FOR ALL
  USING (true)
  WITH CHECK (true);