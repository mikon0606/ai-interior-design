-- AI装修大师 · tasks 表与 Storage 配置
-- 在 Supabase Dashboard → SQL Editor 中执行本脚本

-- 1. tasks 表
CREATE TABLE IF NOT EXISTS public.tasks (
  id BIGSERIAL PRIMARY KEY,
  task_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  input_image TEXT NOT NULL,
  result_image TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_task_number ON public.tasks (task_number);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_created_at
  ON public.tasks (user_id, created_at DESC);

-- 2. 用户端只允许读取自己的任务；服务端 Service Role 仍可处理全部任务
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- 3. 自动更新 updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_set_updated_at ON public.tasks;
CREATE TRIGGER tasks_set_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Storage 桶（公开读，供用户查看原图/效果图）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-images',
  'task-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 5. Storage 策略：公开读取
DROP POLICY IF EXISTS "Public read task images" ON storage.objects;
CREATE POLICY "Public read task images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'task-images');

-- 服务端使用 Service Role Key 上传，无需额外 INSERT 策略
-- 请勿将 Service Role Key 暴露到浏览器
