# Supabase 配置指南

将任务数据与图片存储在 Supabase，部署到 Vercel 后数据持久保存，不会因无状态实例而丢失。

---

## 一、创建 Supabase 项目

1. 打开 [https://supabase.com](https://supabase.com) 并登录
2. 点击 **New project**
3. 填写项目名称、数据库密码、区域（建议选离用户较近的区域，如 `Southeast Asia`）
4. 等待项目创建完成（约 1–2 分钟）

---

## 二、执行数据库脚本

1. 进入项目 **SQL Editor**
2. 点击 **New query**
3. 复制项目根目录 `supabase/schema.sql` 的全部内容并粘贴
4. 点击 **Run** 执行

脚本会创建：

- `tasks` 表（含索引与 `updated_at` 自动更新）
- Storage 桶 `task-images`（公开读，最大 10MB，仅图片类型）

---

## 三、确认 Storage 桶

1. 打开 **Storage** → 应看到桶 **`task-images`**
2. 确认 **Public bucket** 为开启（用户端需直接访问图片 URL）
3. 目录结构（由应用自动创建）：
   - `inputs/` — 用户上传的原图
   - `results/` — 后台上传的效果图

---

## 四、获取 API 密钥

1. 打开 **Project Settings** → **API**
2. 记录以下三项：

| 名称 | 环境变量 | 说明 |
|------|----------|------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | 形如 `https://xxxxx.supabase.co` |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 可暴露在前端（当前项目主要在服务端用 Service Role） |
| service_role | `SUPABASE_SERVICE_ROLE_KEY` | **仅服务端**，切勿提交到 Git 或暴露到浏览器 |

---

## 五、本地环境变量

1. 复制示例文件：

```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，填入上述三个值：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 启动开发服务器：

```bash
npm install
npm run dev
```

---

## 六、部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 打开 **Settings** → **Environment Variables**，添加与 `.env.local` 相同的三项：

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. 勾选 **Production**、**Preview**、**Development**（按需）
5. 重新 **Deploy**

> Vercel 无持久磁盘，本地 SQLite / `public/uploads` 在部署后会丢失；使用 Supabase 后任务与图片均保存在云端。

---

## 七、验证

1. 访问首页，上传照片并 **提交任务**
2. 应跳转到 `/task/A10001` 等详情页
3. 打开 `/admin`，能看到新任务与原图
4. 在后台详情页修改状态、上传效果图
5. 用户端刷新任务页，应看到效果图并可下载

在 Supabase Dashboard：

- **Table Editor** → `tasks` 查看记录
- **Storage** → `task-images` 查看 `inputs/`、`results/` 文件

---

## 八、安全说明

- `SUPABASE_SERVICE_ROLE_KEY` 拥有完整权限，仅用于 Next.js **服务端**（API Route、Server Component）
- 不要将 Service Role Key 写入 `NEXT_PUBLIC_*` 变量
- 当前版本未做后台登录，请勿将 `/admin` 地址公开给未授权人员；后续可加密码或 Supabase Auth

---

## 九、从 SQLite 迁移旧数据（可选）

若本地曾有 `data/tasks.db` 与 `public/uploads/` 中的文件：

1. 在 Supabase Storage 手动上传原图到 `inputs/`、效果图到 `results/`
2. 在 `tasks` 表中插入对应行，`input_image` / `result_image` 填写 Storage 的 **Public URL**

Public URL 格式：

```
https://<project-ref>.supabase.co/storage/v1/object/public/task-images/inputs/A10001.jpg
```
