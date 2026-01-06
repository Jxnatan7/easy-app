# 🚀 Easy App - 全栈 Monorepo 模板

### [PT](https://github.com/Jxnatan7/easy-app)

### [EN](https://github.com/Jxnatan7/easy-app/README-en.md)

### [ES](https://github.com/Jxnatan7/easy-app/README-es.md)

### [ZH](https://github.com/Jxnatan7/easy-app/README-zh.md)

### [HI](https://github.com/Jxnatan7/easy-app/README-hi.md)

**Easy App** 是一个完整且具有指导性的生态系统，旨在加速跨平台应用的开发。它采用 Monorepo（单一代码库）架构，将强大的 **NestJS** 后端与灵活的 **Expo (React Native)** 前端统一管理。

其主要目标是消除重复的初始配置，直接交付核心功能，如 **JWT 身份验证**、**基于 WebSockets 的实时聊天**和**模块化架构**，让您能够专注于产品的业务逻辑。

---

## ✨ 核心特性

- **⚡ 瞬时启动：** 只需一条命令 (`yarn start`)，后端（包括通过 Docker 运行的数据库）和前端 (Expo) 即可同时运行。
- **📱 真正的跨平台：** 一套前端代码库，同时支持 **Android、iOS 和 Web**。
- **💬 实时聊天：** 集成 **Socket.io** 的消息系统，并具备 JWT 身份验证。
- **🏗️ 模块化后端：** 基于 NestJS 的演进式架构，便于扩展和维护。
- **🔐 完备的鉴权：** 使用 **Passport.js** 和 **JWT** 实现完整的用户注册和登录流程。
- **🎨 UI/UX 就绪：** 内置预构建组件、**Formik** 表单校验、**Lottie** 动画以及 **Shopify Restyle** 主题管理。
- **💾 状态管理与缓存：** 通过 **TanStack Query (React Query)** 实现高效数据同步，并使用 **Zustand** 进行全局状态管理。

---

## 🛠️ 技术栈

### Monorepo 工具

- **TurboRepo:** 智能构建与缓存管理。
- **TypeScript:** 全栈静态类型支持。

### 后端 (apps/backend)

- **框架:** NestJS (v11)
- **数据库:** MongoDB (通过 Mongoose)。
- **通信:** WebSockets (Socket.io) 和 REST API。
- **安全:** Passport JWT 和 Bcrypt 密码哈希。
- **工具:** 集成 Ngrok，方便在真实设备上进行测试。

### 前端 (apps/mobile)

- **框架:** Expo (v54) + React Native。
- **路由:** Expo Router (基于文件的路由)。
- **数据获取:** TanStack Query v5。
- **状态管理:** Zustand。
- **样式:** Shopify Restyle (React Native 的原子化样式库)。
- **表单:** Formik + 校验。
- **列表:** 使用 Shopify FlashList 以获得极致性能。

---

## 📂 项目结构

```text
easy-app/
├── apps/
│   ├── backend/          # NestJS API, MongoDB, WebSockets
│   └── mobile/           # Expo App (Android, iOS, Web)
├── package.json          # 全局脚本和 Turbo 配置
└── ...配置文件

```

---

## 🚀 快速上手

### 环境要求

- Node.js >= 18
- Docker & Docker Compose (用于运行 MongoDB)
- Expo Go (可选，用于真机测试)

### 安装与运行

1. **克隆仓库:**

```bash
git clone https://github.com/Jxnatan7/easy-app.git
cd easy-app

```

2. **安装依赖:**

```bash
yarn install

```

3. **启动完整应用:**

```bash
yarn start

```

_该命令将执行：_

- 通过 Docker 启动 MongoDB 数据库。
- 为后端开启 Ngrok 隧道。
- 以监听模式运行 NestJS。
- 打开 Expo 开发服务器。

---

## 🕹️ 可用脚本

| 命令           | 描述                                       |
| -------------- | ------------------------------------------ |
| `yarn start`   | 同时启动后端和前端。                       |
| `yarn backend` | 仅启动 NestJS 服务（含 Docker 和 Ngrok）。 |
| `yarn mobile`  | 仅启动支持隧道的 Expo 环境。               |
| `yarn build`   | 构建后端和前端的生产版本。                 |
| `yarn lint`    | 在整个 Monorepo 中运行代码检查。           |
| `yarn format`  | 使用 Prettier 格式化代码。                 |

---

## 🏗️ 后端架构

后端遵循**演进式架构**和**模块化设计**原则构建。每个应用领域（Domain）都是孤立的，确保系统能够以组织有序且可持续的方式增长。

### 📁 文件夹结构 (apps/backend)

```text
src/
├── @core/                 # 共享逻辑、全局实体和基础工具
├── auth/                  # 鉴权模块 (Guards, JWT 策略, Passport)
├── chat/                  # 聊天模块 (WebSocket Gateways 和房间逻辑)
├── communication-request/ # 联系人/好友请求管理
├── message/               # 消息领域与历史记录
├── user/                  # 用户资料与数据管理
├── helpers/               # 工具函数与格式化程序
├── app.module.ts          # 编排应用的根模块
└── main.ts                # 入口文件 (Bootstrap) 和中间件配置

```

### 🧩 模块解剖

`src/` 下的每个模块都遵循关注点分离模式：

- **`core/`**: 包含纯业务规则、用例和 Schema 定义 (Mongoose)。此层独立于外部协议。
- **`http/`**: 存放 Controllers 和 DTOs (数据传输对象)，专门处理 REST 传输层。
- **`gateways/`**: (仅聊天模块) 处理通过 **WebSockets (Socket.io)** 进行的双向通信。
- **`strategies/` & `guards/**`: (仅鉴权模块) 定义系统如何保护路由和验证 JWT 令牌。

---

## 💬 实时通信系统 (WebSockets)

**Easy App** 使用与 NestJS 集成的 **Socket.io** 提供持久且安全的聊天体验。所有通信均受 JWT 保护，并通过动态房间 (Rooms) 进行组织。

### 🔐 安全与身份验证

WebSocket 在握手阶段需要验证：

- **令牌提取**: Gateway 接受通过查询参数 (`?token=...`) 或 `Authorization` 请求头 (Bearer) 传递的 JWT。
- **验证**: `JwtService` 验证令牌；如果无效，连接将立即被拒绝。
- **身份绑定**: 连接成功后，用户数据 (`userId`, `role`) 将绑定到 Socket 实例 (`client.data`)，无需在每条消息中重复发送用户数据。

### 🏠 房间管理

1. **个人房间**: 连接时，每个用户自动加入 `user:{userId}` 房间。这允许系统从任何地方发送私有通知。
2. **聊天室 (1v1)**: 进入对话时，用户加入 `chat:{id}` 房间。

- **安全锁定**: Gateway 会在允许进入前验证用户是否确实是该聊天的参与者。
- **参与者限制**: 内置逻辑监控并将房间限制为最多 2 个不同的参与者，以确保 1v1 隐私。

---

## 📱 前端 (Expo & React Native)

**Easy App** 的前端旨在为 Android 和 iOS 提供流畅的原生体验，同时保持完全的 Web 兼容性。

### 🔄 数据同步与实时性

1. **HTTP 与缓存 (TanStack Query)**: REST 请求由 React Query 管理。`useChatMessages` 等 Hooks 使用自动缓存实现即时加载，并透明地处理分页和错误状态。
2. **WebSockets (Socket.io-client)**: `useChatSocket` Hook 管理双向连接。

- **缓存失效**: 当通过 WebSocket 收到 `message` 事件时，应用会自动失效相关的 React Query 查询，确保消息历史和聊天列表在无需刷新页面的情况下自动更新。

### 🏗️ UI 工具包: Restyle 与组件

设计系统构建在 **Shopify Restyle** 之上，支持：

- **主题化**: 轻松切换颜色、间距和排版变体。
- **性能**: 使用原子组件 (`Box`, `Text`) 避免不必要的重新渲染。
- **开箱即用组件**: 内置 `FlashList`（针对消息优化）、用于二维码扫描的 `CodeCamera` 以及用于快速操作的 `BottomSheet`。

---

## 🤝 贡献

欢迎提交 Issue 或 Pull Request。对于重大改动，请先提交 Issue 讨论您想要更改的内容。

---

⭐ **喜欢这个项目吗？请考虑给仓库点个 Star！**
