-- 4个新游戏的数据库表
-- 在 Supabase SQL Editor 中执行

-- 缘分十字路口投票
CREATE TABLE IF NOT EXISTS public.crossroads_votes (
  id         SERIAL PRIMARY KEY,
  question   TEXT NOT NULL,
  voted_id   TEXT NOT NULL,
  voter_id   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question, voter_id)
);
ALTER TABLE public.crossroads_votes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read votes" ON public.crossroads_votes;
CREATE POLICY "Anyone can read votes" ON public.crossroads_votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert votes" ON public.crossroads_votes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE id = voter_id AND auth_id = auth.uid()));

-- 热搜点赞
CREATE TABLE IF NOT EXISTS public.hotsearch_likes (
  id         SERIAL PRIMARY KEY,
  keyword    TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(keyword, user_id)
);
ALTER TABLE public.hotsearch_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read likes" ON public.hotsearch_likes;
CREATE POLICY "Anyone can read likes" ON public.hotsearch_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert likes" ON public.hotsearch_likes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE id = user_id AND auth_id = auth.uid()));
