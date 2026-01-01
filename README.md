# Cloudflare 批量域名管理工具

基于 **Bun + Elysia + JSX (SSR) + HTMX** 构建的轻量级 Cloudflare 批量管理工具。

## 功能特性

### 🚀 批量域名管理
- 批量添加域名到 Cloudflare
- 支持 A 记录和 CNAME 记录
- 灵活的 DNS 记录配置（@、www、泛域名等）
- 自定义子域名记录

### 🌐 域名管理
- 查看所有域名及安全状态
- 批量/单独设置安全级别（Under Attack 模式）
- 批量/单独开关 CDN 代理
- 泛域名 CDN 批量管理

### 🤖 蜘蛛屏蔽
- 预设常见爬虫（AhrefsBot、MJ12bot、SemrushBot 等）
- AI 爬虫屏蔽（GPTBot、anthropic-ai、Claude-Web）
- 自定义 User-Agent 特征
- 支持屏蔽、JS 质询、托管质询三种处理方式

### 🛡️ API 防护（防 CC 攻击）
- 指定保护路径（支持通配符）
- 多种防护规则：
  - 屏蔽无 Referer 请求
  - 屏蔽非浏览器 User-Agent
  - 屏蔽空 User-Agent
  - 屏蔽高风险国家
  - 质询可疑请求
- IP 白名单支持

### 💾 其他特性
- 本地 SQLite 存储配置
- 单文件打包，无需安装依赖
- 支持跨平台编译

## 快速开始

### 安装依赖

```bash
bun install
```

### 启动服务

```bash
# 开发模式（热重载）
bun run dev

# 生产模式
bun run start
```

访问 http://localhost:3001

### 打包分发

```bash
# macOS (Apple Silicon)
bun run build:mac

# Windows
bun run build:win

# Linux
bun run build:linux
```

## 项目结构

```
├── src/
│   ├── components/        # UI 组件
│   │   ├── Alert.tsx      # 提示组件
│   │   └── Layout.tsx     # 页面布局
│   ├── services/          # 业务逻辑
│   │   ├── cloudflare.ts  # Cloudflare API 封装
│   │   └── db.ts          # SQLite 数据存储
│   ├── views/             # 页面
│   │   ├── Home.tsx       # 批量操作控制台
│   │   ├── Domains.tsx    # 域名列表管理
│   │   ├── BotBlock.tsx   # 蜘蛛屏蔽
│   │   ├── ApiProtect.tsx # API 防护
│   │   └── Settings.tsx   # 系统设置
│   └── index.tsx          # 程序入口
├── index.ts               # CLI 批量脚本
├── cc-protection.ts       # CC 防护快捷脚本
└── package.json
```

## 使用说明

### 1. 配置 API 凭证

首次使用需在「设置」页面配置：
- Cloudflare 账户邮箱
- Global API Key（在 Cloudflare 控制台 → My Profile → API Tokens 获取）

### 2. 批量添加域名

在「仪表盘」页面：
1. 输入域名列表（每行一个）
2. 选择记录类型（A 记录或 CNAME）
3. 填写解析目标（IP 或 CNAME 域名）
4. 选择 DNS 记录类型（@、www、*、api 等）
5. 设置 CDN 代理和安全级别
6. 点击「开始执行」

### 3. 域名管理

在「域名管理」页面：
- 查看所有域名及当前安全级别
- 批量操作：全部高防、全部恢复、泛域名 CDN 开关
- 单域名操作：CDN 开关、高防模式切换

### 4. 蜘蛛屏蔽

在「蜘蛛屏蔽」页面：
- 勾选要屏蔽的爬虫
- 添加自定义 User-Agent 特征
- 选择处理方式（屏蔽/质询）
- 应用到所有域名

### 5. API 防护

在「API 防护」页面：
- 输入要保护的路径（如 `/api/*`、`/login`）
- 选择防护规则
- 配置 IP 白名单（可选）
- 应用到所有域名

## CLI 命令

```bash
# 批量添加域名（需修改 index.ts 中的配置）
bun run cli

# CC 防护快捷命令
bun run cc:status    # 查看当前安全级别
bun run cc:high      # 设置高安全级别
bun run cc:medium    # 设置中等安全级别
bun run cc:normal    # 恢复正常级别
```

## 技术栈

| 组件 | 说明 |
|------|------|
| Bun | 高性能 JavaScript 运行时 |
| Elysia | Bun 生态最快的 Web 框架 |
| @kitajs/html | JSX 服务端渲染 |
| HTMX | 无需前端 JS 的交互方案 |
| TailwindCSS | CDN 引入，零构建 |
| bun:sqlite | 内置 SQLite 存储配置 |

## WAF 规则说明

本工具创建的 WAF 规则：

| 规则名称 | 功能 |
|----------|------|
| Block Bad Bots | 蜘蛛/爬虫屏蔽 |
| API Protection - * | API 防护系列规则 |

## 注意事项

- 泛域名 (`*`) 开启 CDN 需要 Cloudflare 企业版证书
- API 请求有速率限制，批量操作会自动控制请求间隔
- 配置数据存储在 `cf-manager.sqlite` 文件中
- WAF 规则会应用到所有域名，请谨慎配置
- API 防护规则可能影响移动端 APP 或第三方回调，请配置白名单

## License

MIT
