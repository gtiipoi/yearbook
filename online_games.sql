-- 在线互动游戏房间系统
-- 在 Supabase SQL Editor 中执行

CREATE TABLE IF NOT EXISTS public.game_rooms (
  id          SERIAL PRIMARY KEY,
  room_code   TEXT NOT NULL UNIQUE,
  host_id     TEXT NOT NULL,
  game_type   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'waiting',
  players     JSONB NOT NULL DEFAULT '[]',
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read game_rooms" ON public.game_rooms;
CREATE POLICY "Anyone can read game_rooms" ON public.game_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert game_rooms" ON public.game_rooms;
CREATE POLICY "Anyone can insert game_rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update game_rooms" ON public.game_rooms;
CREATE POLICY "Anyone can update game_rooms" ON public.game_rooms FOR UPDATE USING (true);
