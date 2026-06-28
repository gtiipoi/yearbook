-- 聊天已读功能：记录每个用户最后一次打开聊天室的时间
-- 在 Supabase SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.chat_reads (
  user_id      TEXT PRIMARY KEY REFERENCES public.students(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_reads ENABLE ROW LEVEL SECURITY;

-- 所有人可读（用于显示已读人数）
DROP POLICY IF EXISTS "Anyone can read chat_reads" ON public.chat_reads;
CREATE POLICY "Anyone can read chat_reads"
  ON public.chat_reads FOR SELECT
  USING (true);

-- 用户可创建自己的已读记录
DROP POLICY IF EXISTS "Users can insert own chat_reads" ON public.chat_reads;
CREATE POLICY "Users can insert own chat_reads"
  ON public.chat_reads FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.students WHERE id = user_id AND auth_id = auth.uid())
  );

-- 用户可更新自己的已读记录
DROP POLICY IF EXISTS "Users can update own chat_reads" ON public.chat_reads;
CREATE POLICY "Users can update own chat_reads"
  ON public.chat_reads FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.students WHERE id = user_id AND auth_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.students WHERE id = user_id AND auth_id = auth.uid())
  );
