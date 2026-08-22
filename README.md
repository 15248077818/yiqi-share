# 一起分享｜前端云端完整模板

这版已经把前端主要功能接到 Supabase API：
- 邮箱注册/登录
- 昵称
- 图片上传
- 发帖
- 点赞
- 评论
- 管理员删除帖子

## 上线步骤
1. 创建 Supabase 项目。
2. SQL Editor 执行 `supabase/schema.sql`。
3. 创建用户后，把该用户在 `profiles` 表中的 `is_admin` 改为 `true`。
4. 设置环境变量：
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
5. `npm install`
6. `npm run build`
7. 将项目部署到 Vercel、Netlify 或其他支持 Vite 的平台。

注意：这里只能生成完整源码和数据库配置；我无法替你创建第三方云服务账号、获取密钥或直接把网站发布到你的个人账户。
