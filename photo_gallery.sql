
-- 照片墙数据表
CREATE TABLE IF NOT EXISTS public.photos (
  id          TEXT PRIMARY KEY DEFAULT ('p_' || replace(uuid_generate_v4()::text, '-', '')),
  uploader_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
  url         TEXT NOT NULL,
  caption     TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload photos" ON public.photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.students WHERE id = uploader_id AND auth_id = auth.uid()));
CREATE POLICY "Owner can delete own photos" ON public.photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.students WHERE id = photos.uploader_id AND auth_id = auth.uid()));

-- 请在 Supabase SQL Editor 中运行以上 SQL
