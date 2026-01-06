# 🚀 Easy App - Fullstack Monorepo Template

### [PT](https://github.com/Jxnatan7/easy-app)

### [EN](https://github.com/Jxnatan7/easy-app/README-en.md)

### [ES](https://github.com/Jxnatan7/easy-app/README-es.md)

### [ZH](https://github.com/Jxnatan7/easy-app/README-zh.md)

### [HI](https://github.com/Jxnatan7/easy-app/README-hi.md)

**Easy App** is a comprehensive and opinionated ecosystem for accelerated cross-platform application development. It utilizes a monorepo architecture to unify a robust **NestJS** backend with a versatile **Expo (React Native)** frontend.

The primary goal is to eliminate repetitive initial setup by delivering critical out-of-the-box features like **JWT Authentication**, **Real-time Chat via WebSockets**, and a **Modular Architecture**, allowing you to focus solely on your product's business logic.

---

## ✨ Key Features

- **⚡ Instant Initialization:** With a single command (`yarn start`), the backend (including the database via Docker) and the frontend (Expo) run simultaneously.
- **📱 Truly Cross-Platform:** A single frontend codebase serving **Android, iOS, and Web**.
- **💬 Real-time Chat:** Integrated messaging system using **Socket.io** with JWT authentication.
- **🏗️ Modular Backend:** Evolutionary architecture with NestJS, facilitating scalability and maintenance.
- **🔐 Complete Auth:** Fully implemented user registration and login flow using **Passport.js** and **JWT**.
- **🎨 UI/UX Ready:** Pre-built components, form validation with **Formik**, animations with **Lottie**, and theme management with **Shopify Restyle**.
- **💾 State Management & Caching:** Efficient data synchronization with **TanStack Query (React Query)** and global state management with **Zustand**.

---

## 🛠️ Tech Stack

### Monorepo Tooling

- **TurboRepo:** Intelligent build and cache management.
- **TypeScript:** Static typing across the entire project.

### Backend (apps/backend)

- **Framework:** NestJS (v11)
- **Database:** MongoDB via Mongoose.
- **Communication:** WebSockets (Socket.io) and REST.
- **Security:** Passport JWT and Bcrypt for password hashing.
- **Utilities:** Integrated Ngrok for testing on physical devices.

### Frontend (apps/mobile)

- **Framework:** Expo (v54) + React Native.
- **Routing:** Expo Router (File-based routing).
- **Data Fetching:** TanStack Query v5.
- **State:** Zustand.
- **Styling:** Shopify Restyle (Utility-first for React Native).
- **Forms:** Formik + Validation.
- **Lists:** Shopify FlashList for maximum performance.

---

## 📂 Project Structure

```text
easy-app/
├── apps/
│   ├── backend/          # NestJS API, MongoDB, WebSockets
│   └── mobile/           # Expo App (Android, iOS, Web)
├── package.json          # Global scripts and Turbo configuration
└── ...config files

```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for MongoDB)
- Expo Go (optional for physical device testing)

### Installation and Execution

1. **Clone the repository:**

```bash
git clone https://github.com/Jxnatan7/easy-app.git
cd easy-app

```

2. **Install dependencies:**

```bash
yarn install

```

3. **Start the complete application:**

```bash
yarn start

```

_This command will:_

- Spin up the MongoDB database via Docker.
- Start the Ngrok tunnel for the backend.
- Run NestJS in watch mode.
- Open the Expo Dev Server.

---

## 🕹️ Available Scripts

| Command        | Description                                            |
| -------------- | ------------------------------------------------------ |
| `yarn start`   | Starts backend and frontend simultaneously.            |
| `yarn backend` | Starts only the NestJS server (with Docker and Ngrok). |
| `yarn mobile`  | Starts only the Expo environment with tunnel support.  |
| `yarn build`   | Builds both applications for production.               |
| `yarn lint`    | Runs linting across the entire monorepo.               |
| `yarn format`  | Formats code using Prettier.                           |

---

## 🏗️ Backend Architecture

The backend was built following **Evolutionary Architecture** and **Modular Design** principles. Each application domain is isolated, allowing the system to grow in an organized and sustainable way.

### 📁 Folder Structure (apps/backend)

```text
src/
├── @core/                 # Shared logic, global entities, and base utilities
├── auth/                  # Auth Module (Guards, JWT Strategies, Passport)
├── chat/                  # Chat Module (WebSocket Gateways and room logic)
├── communication-request/ # Contact/friend request management
├── message/               # Message domain and history
├── user/                  # User profile and data management
├── helpers/               # Utility functions and formatters
├── app.module.ts          # Root module orchestrating the app
└── main.ts                # Entry point (Bootstrap) and middleware config

```

### 🧩 Module Anatomy

Each module within `src/` follows a separation of concerns pattern:

- **`core/`**: Contains pure business rules, use cases, and schema definitions (Mongoose). This layer is independent of external protocols.
- **`http/`**: Houses Controllers and DTOs (Data Transfer Objects), handling the REST transport layer.
- **`gateways/`**: (Chat module only) Manages bidirectional communication via **WebSockets (Socket.io)**.
- **`strategies/` & `guards/**`: (Auth module only) Defines how the system protects routes and validates JWT tokens.

---

## 💬 Real-time Communication (WebSockets)

**Easy App** uses **Socket.io** integrated with NestJS to provide a persistent and secure chat experience. Communication is JWT-protected and organized through dynamic Rooms.

### 🔐 Security and Authentication

WebSockets require validation during the handshake:

- **Token Extraction**: The gateway accepts JWT via query string (`?token=...`) or the `Authorization` header (Bearer).
- **Validation**: `JwtService` verifies the token; if invalid, the connection is immediately rejected.
- **Identity**: Once connected, user data (`userId`, `role`) is linked to the Socket instance (`client.data`), removing the need to resend user data with every message.

### 🏠 Room Management

1. **Personal Room**: Upon connecting, each user automatically joins the `user:{userId}` room. This allows private notifications to be sent from anywhere in the system.
2. **Chat Room (1v1)**: When entering a conversation, users join `chat:{id}` rooms.

- **Security Lock**: The gateway validates if the user is a participant before allowing entry.
- **Participant Limit**: Integrated logic restricts rooms to a maximum of 2 distinct participants to ensure 1v1 privacy.

---

## 📱 Frontend (Expo & React Native)

The **Easy App** frontend is designed for a fluid native experience on Android and iOS while maintaining full Web compatibility.

### 🔄 Data Sync and Real-time

1. **HTTP & Cache (TanStack Query)**: REST requests are managed by React Query. Hooks like `useChatMessages` use automatic caching for instant loading and handle pagination/error states transparently.
2. **WebSockets (Socket.io-client)**: The `useChatSocket` hook manages the bidirectional connection.

- **Cache Invalidation**: When a `message` event is received via WebSocket, the app automatically invalidates relevant React Query queries, ensuring message history and chat lists update without a page refresh.

### 🏗️ UI Toolkit: Restyle & Components

The design system is built on **Shopify Restyle**, enabling:

- **Theming**: Easy switching of colors, spacing, and typography variants.
- **Performance**: Uses atomic components (`Box`, `Text`) to avoid unnecessary re-renders.
- **Ready-to-use Components**: Includes `FlashList` (optimized for messages), `CodeCamera` for QR scanning, and `BottomSheet` for quick actions.

---

## 🤝 Contributing

Feel free to open issues or submit Pull Requests. For major changes, please open an issue first to discuss what you would like to change.

---

⭐ **Like this project? Consider giving it a star!**

---
