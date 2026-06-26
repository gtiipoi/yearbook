-- ============================================================
-- 青春纪念册 — Supabase 数据库迁移脚本
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本
-- ============================================================

-- 1. 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 创建 students 表
CREATE TABLE public.students (
  id          TEXT PRIMARY KEY DEFAULT ('s_' || replace(uuid_generate_v4()::text, '-', '')),
  auth_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 12),
  cls         TEXT NOT NULL,
  avatar      TEXT NOT NULL DEFAULT '🌟',
  is_seed     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_students_auth_id ON public.students(auth_id);

-- 3. 创建 reviews 表
CREATE TABLE public.reviews (
  id           TEXT PRIMARY KEY DEFAULT ('r_' || replace(uuid_generate_v4()::text, '-', '')),
  target_id    TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  author_id    TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  strengths    TEXT NOT NULL DEFAULT '',
  weaknesses   TEXT NOT NULL DEFAULT '',
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (target_id <> author_id)
);
CREATE INDEX idx_reviews_target_id ON public.reviews(target_id);
CREATE INDEX idx_reviews_author_id ON public.reviews(author_id);

-- 4. 开启 RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. students RLS 策略
CREATE POLICY "Anyone can read students"
  ON public.students FOR SELECT
  USING (true);

CREATE POLICY "Owner can update own student row"
  ON public.students FOR UPDATE
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Owner can delete own student row"
  ON public.students FOR DELETE
  USING (auth_id = auth.uid());

-- 6. reviews RLS 策略
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users with student record can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = author_id AND auth_id = auth.uid()
    )
  );

CREATE POLICY "Author can delete own review"
  ON public.reviews FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE id = reviews.author_id AND auth_id = auth.uid()
    )
  );

-- 7. 种子数据 — 12 个预置学生
INSERT INTO public.students (id, name, cls, avatar, is_seed) VALUES
  ('s1',  '林小棠', '高三(1)班', '🌸', true),
  ('s2',  '陈星河', '高三(1)班', '🌌', true),
  ('s3',  '苏念晴', '高三(2)班', '☀️', true),
  ('s4',  '陆子轩', '高三(2)班', '🦁', true),
  ('s5',  '白雨霏', '高三(3)班', '🦋', true),
  ('s6',  '顾云深', '高三(3)班', '🌿', true),
  ('s7',  '沈清禾', '高三(1)班', '🌙', true),
  ('s8',  '赵一阳', '高三(2)班', '🔥', true),
  ('s9',  '周以安', '高三(3)班', '🐳', true),
  ('s10', '许晚晴', '高三(1)班', '🎀', true),
  ('s11', '唐小鱼', '高三(2)班', '🐣', true),
  ('s12', '季深',   '高三(3)班', '🍃', true);

-- 8. 种子数据 — 13 条预置评价
INSERT INTO public.reviews (id, target_id, author_id, strengths, weaknesses, is_anonymous, created_at) VALUES
  ('r1',  's1',  's2',  '性格开朗，总是能带动班级气氛', '有时候话有点多，上课会被老师点名', false, '2026-06-20T10:30:00+08:00'),
  ('r2',  's1',  's3',  '对朋友特别真诚，乐于助人', '早上总是卡点到教室', true,  '2026-06-21T14:20:00+08:00'),
  ('r3',  's1',  's5',  '画画很好看，板报每次都靠她', '有时候太在意别人的看法了', false, '2026-06-22T09:15:00+08:00'),
  ('r4',  's2',  's1',  '理科大神，数学题没有他不会的', '文科作业经常忘交', false, '2026-06-19T16:40:00+08:00'),
  ('r5',  's2',  's4',  '逻辑思维超强，讲题很清楚', '不太会安慰人', true,  '2026-06-21T11:10:00+08:00'),
  ('r6',  's3',  's1',  '声音特别好听，唱歌比赛拿了奖', '有时候过于追求完美，把自己搞得很累', false, '2026-06-20T08:45:00+08:00'),
  ('r7',  's3',  's6',  '温柔体贴，是很多人的知心姐姐', '不太会说拒绝', true,  '2026-06-22T17:30:00+08:00'),
  ('r8',  's4',  's2',  '幽默风趣，班级段子手', '上课爱睡觉，课桌总是最乱的', false, '2026-06-18T13:00:00+08:00'),
  ('r9',  's4',  's3',  '关键时刻很靠谱，有担当', '嘴巴太毒了，开玩笑没分寸', true,  '2026-06-21T15:50:00+08:00'),
  ('r10', 's5',  's4',  '跳舞超棒，文艺汇演C位', '太安静了，课堂上不敢发言', false, '2026-06-19T12:20:00+08:00'),
  ('r11', 's5',  's1',  '细心，总能注意到别人忽略的细节', '容易紧张，考试前会失眠', true,  '2026-06-22T20:05:00+08:00'),
  ('r12', 's6',  's2',  '文笔很好，作文经常被当范文', '体育课能躲就躲，有点拖延症', false, '2026-06-20T18:30:00+08:00'),
  ('r13', 's6',  's5',  '很善良，默默帮助别人不求回报', '话太少，有时候让人猜不透在想什么', true,  '2026-06-22T10:40:00+08:00');
