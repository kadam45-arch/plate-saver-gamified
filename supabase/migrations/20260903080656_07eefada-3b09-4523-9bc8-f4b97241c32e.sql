CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (id uuid, full_name text, branch text, eco_points integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.branch, p.eco_points
  FROM public.profiles p
  ORDER BY p.eco_points DESC, p.created_at ASC
  LIMIT 50;
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;