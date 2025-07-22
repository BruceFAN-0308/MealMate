# 数据库设置指南 (Database Setup Guide)

## 📋 步骤 (Steps)

### 1. 配置环境变量 (Configure Environment Variables)

1. 在项目根目录找到 `.env` 文件
2. 更新 `DATABASE_URL` 为您的 Supabase 连接字符串：

```env
# 在 Supabase Dashboard > Settings > Database > Connection info 中找到
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT_REF].supabase.co:5432/postgres?schema=public"

# 其他 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. 生成 Prisma 客户端 (Generate Prisma Client)

```bash
npm run db:generate
```

### 3. 推送数据库模式到 Supabase (Push Database Schema to Supabase)

```bash
npm run db:push
```

或者使用 migration （推荐用于生产环境）:

```bash
npm run db:migrate
```

### 4. 验证数据库 (Verify Database)

您可以使用 Prisma Studio 查看数据库：

```bash
npm run db:studio
```

## 🗃️ 创建的数据表 (Created Tables)

### `recipes` 表
- 存储食谱信息
- 包含标题、类别、来源地、说明、图片和配料

### `meal_plans` 表  
- 存储用户的餐食计划
- 包含计划名称、描述、开始/结束日期

### `planned_meals` 表
- 存储具体的计划餐食
- 关联餐食计划和食谱
- 包含日期、餐食类型（早/午/晚/零食）、份数和备注

## 🔐 安全性 (Security)

Prisma schema 包含了以下安全特性：
- 使用 UUID 作为主键
- 外键约束确保数据完整性
- 级联删除防止孤儿记录

## 🚀 使用说明 (Usage)

配置完成后，您可以在代码中使用：

```typescript
import { prisma } from '../lib/prisma';

// 创建餐食计划
const mealPlan = await prisma.mealPlan.create({
  data: {
    user_id: userId,
    name: "Weekly Plan",
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
});
```

## ❓ 常见问题 (FAQ)

**Q: 连接失败怎么办？**
A: 检查 `.env` 文件中的数据库连接字符串是否正确，确保包含正确的密码和项目引用。

**Q: 表已存在错误？**
A: 如果表已存在，可以先删除现有表或使用 `db:push --force-reset`

**Q: 权限问题？**  
A: 确保您的 Supabase 用户有足够的权限创建表和索引。 