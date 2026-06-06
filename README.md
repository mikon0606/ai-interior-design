# AI装修大师（人工审核模式 + Supabase）

用户提交装修任务 → 后台人工处理 → 上传效果图 → 用户查看并下载。

数据与图片均存储在 **Supabase**（PostgreSQL + Storage），适合部署到 **Vercel**，不会因实例重启丢失数据。

## 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 Supabase 密钥
npm run dev
```

**完整 Supabase 配置步骤见：[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**

## 环境变量

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key（预留） |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端密钥（必填，勿泄露） |

## 功能

### 用户端 `/`

- 上传房间照片、填写装修需求 → **提交任务**
- 跳转 `/task/A10001`，查看状态与结果
- 完成后下载效果图

### 后台 `/admin`

- 任务列表、详情、修改状态、上传效果图

## 技术栈

- Next.js 15 · TypeScript · Tailwind CSS
- Supabase（`tasks` 表 + `task-images` Storage）
- 无 OpenAI · 无支付 · 无登录

## 命令

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 数据库表 `tasks`

| 字段 | 说明 |
|------|------|
| id | 主键 |
| task_number | 任务编号，如 A10001 |
| prompt | 装修需求 |
| input_image | 原图 URL（Storage） |
| result_image | 效果图 URL |
| status | pending / processing / completed |
| created_at | 创建时间 |
| updated_at | 更新时间 |
