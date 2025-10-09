# EduChain 知识分享社区 - 前端

基于可信区块链记录的知识分享与贡献激励社区系统前端应用。

## 🚀 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS + Headless UI
- **状态管理**: Zustand + React Query
- **表单处理**: React Hook Form + Zod
- **图表可视化**: ECharts
- **实时通信**: Socket.io Client
- **区块链交互**: Web3.js
- **部署平台**: Cloudflare Pages

## 📦 功能特性

### 用户端功能
- 🔐 用户注册登录（支持Turnstile人机验证）
- 📝 知识内容发布与管理
- 💬 实时聊天与社区互动
- 🏆 贡献排行榜与统计
- 💰 激励代币余额查询
- 🔍 高级搜索与内容推荐
- 📊 个人贡献数据可视化

### 管理端功能
- 👥 用户管理与权限控制
- 📋 内容审核与质量评分
- 🪙 代币发放与管理
- 📈 系统统计与监控
- ⛓️ 区块链状态监控

### 区块链浏览器
- 🔗 实时区块链状态展示
- 📊 贡献记录上链进度
- 🔍 区块和交易查询
- 📈 网络活动监控

## 🛠️ 开发环境设置

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境变量配置
复制 `.env.example` 到 `.env.local` 并配置：

```bash
# API服务地址
NEXT_PUBLIC_API_URL=https://api.educhain.cc

# Turnstile人机验证
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key

# Socket.io实时通信
NEXT_PUBLIC_SOCKET_URL=https://api.educhain.cc
```

### 开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 🏗️ 构建部署

### 本地构建测试
```bash
npm run build
```

### 类型检查
```bash
npm run type-check
```

### 代码检查
```bash
npm run lint
```

## 🌐 部署到Cloudflare Pages

### 自动部署
1. 连接GitHub仓库到Cloudflare Pages
2. 构建命令: `npm run build`
3. 输出目录: `out`
4. 环境变量配置生产环境值

### 域名配置
- 主域名: `educhain.cc`
- API域名: `api.educhain.cc`

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理端页面
│   ├── user/              # 用户端页面
│   ├── blockchain/        # 区块链浏览器
│   └── api/               # API路由代理
├── components/            # React组件
│   ├── admin/            # 管理端组件
│   ├── user/             # 用户端组件
│   ├── ui/               # 通用UI组件
│   └── providers/        # Context提供者
├── hooks/                # 自定义Hooks
├── services/             # API服务
├── types/                # TypeScript类型定义
└── utils/                # 工具函数
```

## 🔗 相关链接

- [后端仓库](https://github.com/ozemyn/educhain)
- [API文档](https://api.educhain.cc/docs)
- [部署地址](https://educhain.cc)

## 📄 许可证

MIT License