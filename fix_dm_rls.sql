-- 修复 direct_messages 表的 RLS 策略
-- 请在 Supabase Dashboard → SQL Editor 中执行此脚本

-- 1. 为 direct_messages 添加 RLS 策略（如果还没有的话）
ALTER TABLE IF EXISTS public.direct_messages ENABLE ROW LEVEL SECURITY;

-- 2. 允许用户读取涉及自己的私信
DROP POLICY IF EXISTS "Users can read their own DMs" ON public.direct_messages;
CREATE POLICY "Users can read their own DMs" ON public.direct_messages FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = sender_id AND auth_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.students WHERE id = receiver_id AND auth_id = auth.uid())
);

-- 3. 允许用户发送私信（发送者必须是自己的 student 记录）
DROP POLICY IF EXISTS "Users can send DMs" ON public.direct_messages;
CREATE POLICY "Users can send DMs" ON public.direct_messages FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE id = sender_id AND auth_id = auth.uid())
);

-- 4. 允许用户标记收到的消息为已读
DROP POLICY IF EXISTS "Users can update received DMs as read" ON public.direct_messages;
CREATE POLICY "Users can update received DMs as read" ON public.direct_messages FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = receiver_id AND auth_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE id = receiver_id AND auth_id = auth.uid())
);
