ALTER TABLE public.profiles ALTER COLUMN eco_points SET DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_eaten integer NOT NULL DEFAULT 0;
UPDATE public.profiles SET eco_points = 0 WHERE eco_points = 1250;

CREATE TABLE public.redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id text NOT NULL,
  reward_name text NOT NULL,
  cost integer NOT NULL,
  token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.redemptions TO authenticated;
GRANT ALL ON public.redemptions TO service_role;

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
  ON public.redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
  ON public.redemptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);