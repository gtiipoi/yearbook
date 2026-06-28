-- 给已有评价但没有活动通知的同学补上铃铛
-- 在 Supabase SQL Editor 执行

INSERT INTO public.activities (student_id, type, message, related_id, seen)
SELECT DISTINCT r.target_id, 'review', '有同学给你写了新评价', r.target_id, false
FROM public.reviews r
WHERE NOT EXISTS (
  SELECT 1 FROM public.activities a
  WHERE a.student_id = r.target_id AND a.type = 'review'
);
