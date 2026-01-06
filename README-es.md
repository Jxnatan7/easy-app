# 🚀 Easy App - Fullstack Monorepo Template

### [PT](https://github.com/Jxnatan7/easy-app)

### [EN](https://github.com/Jxnatan7/easy-app/README-en.md)

### [ES](https://github.com/Jxnatan7/easy-app/README-es.md)

### [ZH](https://github.com/Jxnatan7/easy-app/README-zh.md)

### [HI](https://github.com/Jxnatan7/easy-app/README-hi.md)

**Easy App** es un ecosistema completo y de opinión firme para el desarrollo acelerado de aplicaciones multiplataforma. Utiliza una arquitectura de monorepositorio para unificar un backend robusto en **NestJS** con un frontend versátil en **Expo (React Native)**.

El objetivo principal es eliminar la configuración inicial repetitiva, entregando de inmediato funcionalidades críticas como **Autenticación JWT**, **Chat en tiempo real vía WebSockets** y una **Arquitectura Modular**, permitiendo que te enfoques únicamente en la lógica de negocio de tu producto.

---

## ✨ Funcionalidades Principales

- **⚡ Inicialización Instantánea:** Con un solo comando (`yarn start`), el backend (incluyendo la base de datos vía Docker) y el frontend (Expo) se ejecutan simultáneamente.
- **📱 Cross-Platform Real:** Una única base de código frontend que sirve para **Android, iOS y Web**.
- **💬 Chat en Tiempo Real:** Sistema de mensajería integrado utilizando **Socket.io** con autenticación JWT.
- **🏗️ Backend Modular:** Arquitectura evolutiva con NestJS, facilitando la escalabilidad y el mantenimiento.
- **🔐 Auth Completa:** Flujo de registro e inicio de sesión de usuarios ya implementado con **Passport.js** y **JWT**.
- **🎨 UI/UX Ready:** Componentes preconstruidos, validación de formularios con **Formik**, animaciones con **Lottie** y gestión de temas con **Shopify Restyle**.
- **💾 Gestión de Estado y Caché:** Sincronización de datos eficiente con **TanStack Query (React Query)** y estado global con **Zustand**.

---

## 🛠️ Tech Stack

### Monorepo Tooling

- **TurboRepo:** Gestión inteligente de builds y caché.
- **TypeScript:** Tipado estático en todo el proyecto.

### Backend (apps/backend)

- **Framework:** NestJS (v11)
- **Base de Datos:** MongoDB vía Mongoose.
- **Comunicación:** WebSockets (Socket.io) y REST.
- **Seguridad:** Passport JWT y Bcrypt para el hashing de contraseñas.
- **Utilidades:** Ngrok integrado para pruebas en dispositivos físicos.

### Frontend (apps/mobile)

- **Framework:** Expo (v54) + React Native.
- **Enrutamiento:** Expo Router (Basado en archivos).
- **Data Fetching:** TanStack Query v5.
- **Estado:** Zustand.
- **Estilizado:** Shopify Restyle (Utility-first para React Native).
- **Formularios:** Formik + Validación.
- **Listas:** Shopify FlashList para un rendimiento máximo.

---

## 📂 Estructura del Proyecto

```text
easy-app/
├── apps/
│   ├── backend/          # NestJS API, MongoDB, WebSockets
│   └── mobile/           # Expo App (Android, iOS, Web)
├── package.json          # Scripts globales y configuración de Turbo
└── ...config files

```

---

## 🚀 Cómo Empezar

### Requisitos Previos

- Node.js >= 18
- Docker y Docker Compose (para el MongoDB)
- Expo Go (opcional para pruebas en dispositivos físicos)

### Instalación y Ejecución

1. **Clona el repositorio:**

```bash
git clone https://github.com/Jxnatan7/easy-app.git
cd easy-app

```

2. **Instala las dependencias:**

```bash
yarn install

```

3. **Inicia la aplicación completa:**

```bash
yarn start

```

_Este comando realizará lo siguiente:_

- Levantará la base de datos MongoDB vía Docker.
- Iniciará el túnel Ngrok para el backend.
- Ejecutará NestJS en modo watch.
- Abrirá el Expo Dev Server.

---

## 🕹️ Scripts Disponibles

| Comando        | Descripción                                          |
| -------------- | ---------------------------------------------------- |
| `yarn start`   | Inicia backend y frontend simultáneamente.           |
| `yarn backend` | Inicia solo el servidor NestJS (con Docker y Ngrok). |
| `yarn mobile`  | Inicia solo el entorno Expo con soporte de túnel.    |
| `yarn build`   | Compila ambas aplicaciones para producción.          |
| `yarn lint`    | Ejecuta el linter en todo el monorepo.               |
| `yarn format`  | Formatea el código usando Prettier.                  |

---

## 🏗️ Arquitectura del Backend

El backend fue construido siguiendo principios de **Arquitectura Evolutiva** y **Diseño Modular**. Cada dominio de la aplicación está aislado, permitiendo que el sistema crezca de forma organizada y sostenible.

### 📁 Estructura de Carpetas (apps/backend)

```text
src/
├── @core/                 # Lógica compartida, entidades globales y utilidades base
├── auth/                  # Módulo de Autenticación (Guards, Estrategias JWT, Passport)
├── chat/                  # Módulo de Chat (Gateways WebSocket y lógica de salas)
├── communication-request/ # Gestión de solicitudes de contacto/amistad
├── message/               # Dominio de mensajes e historial
├── user/                  # Gestión de perfiles y datos de usuarios
├── helpers/               # Funciones utilitarias y formateadores
├── app.module.ts          # Módulo raíz que orquestra la aplicación
└── main.ts                # Punto de entrada (Bootstrap) y config. de middlewares

```

### 🧩 Anatomía de un Módulo

Cada módulo dentro de `src/` sigue un patrón de separación de responsabilidades:

- **`core/`**: Contiene las reglas de negocio puras, casos de uso y definiciones de esquemas (Mongoose). Esta capa es independiente de protocolos externos.
- **`http/`**: Alberga los Controladores y DTOs (Data Transfer Objects), manejando específicamente la capa de transporte REST.
- **`gateways/`**: (Exclusivo del módulo de Chat) Gestiona la comunicación bidireccional vía **WebSockets (Socket.io)**.
- **`strategies/` & `guards/**`: (Exclusivo de Auth) Define cómo el sistema protege las rutas y valida el token JWT.

---

## 💬 Comunicación en Tiempo Real (WebSockets)

**Easy App** utiliza **Socket.io** integrado con NestJS para proporcionar una experiencia de chat persistente y segura. La comunicación está protegida por JWT y organizada a través de salas (Rooms) dinámicas.

### 🔐 Seguridad y Autenticación

Los WebSockets requieren validación durante el apretón de manos (handshake):

- **Extracción de Token**: El gateway acepta el JWT tanto vía query string (`?token=...`) como por el header `Authorization` (Bearer).
- **Validación**: `JwtService` verifica el token; si es inválido, la conexión se rechaza inmediatamente.
- **Identidad**: Una vez conectado, los datos del usuario (`userId`, `role`) se vinculan a la instancia del Socket (`client.data`), eliminando la necesidad de reenviar datos del usuario en cada mensaje.

### 🏠 Gestión de Salas (Rooms)

1. **Sala Personal**: Al conectarse, cada usuario entra automáticamente en la sala `user:{userId}`. Esto permite enviar notificaciones privadas desde cualquier lugar del sistema.
2. **Sala de Chat (1v1)**: Al entrar en una conversación, los usuarios se unen a salas `chat:{id}`.

- **Bloqueo de Seguridad**: El gateway valida si el usuario es realmente un participante antes de permitir la entrada.
- **Límite de Participantes**: Existe una lógica integrada que restringe las salas a un máximo de 2 participantes distintos para garantizar la privacidad 1v1.

---

## 📱 Frontend (Expo & React Native)

El frontend de **Easy App** está diseñado para ofrecer una experiencia nativa fluida en Android e iOS, manteniendo compatibilidad total con la Web.

### 🔄 Sincronización de Datos y Real-time

1. **HTTP y Caché (TanStack Query)**: Las solicitudes REST son gestionadas por React Query. Hooks como `useChatMessages` utilizan el caché automático para una carga instantánea y manejan la paginación y estados de error de forma transparente.
2. **WebSockets (Socket.io-client)**: El hook `useChatSocket` gestiona la conexión bidireccional.

- **Invalidación de Caché**: Al recibir un evento de `message` vía WebSocket, la aplicación invalida automáticamente las consultas de React Query relacionadas, asegurando que el historial y la lista de chats se actualicen sin que el usuario tenga que recargar la pantalla.

---

## 🤝 Contribuciones

Siéntete libre de abrir issues o enviar Pull Requests. Para cambios mayores, por favor abre un issue primero para discutir lo que te gustaría cambiar.

---

⭐ **¿Te gusta este proyecto? ¡Considera darle una estrella al repositorio!**
