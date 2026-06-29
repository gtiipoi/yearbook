-- 猜同学PK游戏：暂存评价表
-- 在 Supabase SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.game_reviews (
  id          SERIAL PRIMARY KEY,
  writer_id   TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  strengths   TEXT,
  weaknesses  TEXT,
  guessed     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read game_reviews" ON public.game_reviews;
CREATE POLICY "Anyone can read game_reviews" ON public.game_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own game_reviews" ON public.game_reviews;
CREATE POLICY "Users can insert own game_reviews" ON public.game_reviews FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.students WHERE id = writer_id AND auth_id = auth.uid())
  );
