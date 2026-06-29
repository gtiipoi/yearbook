-- PK小游戏排行榜
-- 在 Supabase SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.game_scores (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  game       TEXT NOT NULL,
  score      INTEGER NOT NULL,
  detail     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read scores" ON public.game_scores;
CREATE POLICY "Anyone can read scores" ON public.game_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own scores" ON public.game_scores;
CREATE POLICY "Users can insert own scores" ON public.game_scores FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.students WHERE id = user_id AND auth_id = auth.uid())
  );
