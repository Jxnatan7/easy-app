# 🚀 Easy App - Fullstack Monorepo Template

### [PT](https://github.com/Jxnatan7/easy-app)

### [EN](https://github.com/Jxnatan7/easy-app/README-en.md)

### [ES](https://github.com/Jxnatan7/easy-app/README-es.md)

### [ZH](https://github.com/Jxnatan7/easy-app/README-zh.md)

### [HI](https://github.com/Jxnatan7/easy-app/README-hi.md)

O **Easy App** é um ecossistema completo e opinativo para o desenvolvimento acelerado de aplicações cross-platform. Ele utiliza uma arquitetura de monorepositório para unificar um backend robusto em **NestJS** com um frontend versátil em **Expo (React Native)**.

O objetivo principal é eliminar a configuração inicial repetitiva, entregando de imediato funcionalidades críticas como **Autenticação JWT**, **Chat em tempo real via WebSockets** e **Arquitetura Modular**, permitindo que você foque apenas na regra de negócio do seu produto.

---

## ✨ Funcionalidades Principais

- **⚡ Inicialização Instantânea:** Com apenas um comando (`yarn start`), o backend (incluindo banco de dados via Docker) e o frontend (Expo) entram em execução simultânea.
- **📱 Cross-Platform Real:** Uma única base de código frontend que atende **Android, iOS e Web**.
- **💬 Chat Real-time:** Sistema de mensagens integrado utilizando **Socket.io** com autenticação JWT.
- **🏗️ Backend Modular:** Arquitetura evolutiva com NestJS, facilitando a escalabilidade e manutenção.
- **🔐 Auth Completa:** Fluxo de cadastro e login de usuários já implementado com **Passport.js** e **JWT**.
- **🎨 UI/UX Ready:** Componentes pré-construídos, validação de formulários com **Formik**, animações com **Lottie** e gerenciamento de temas com **Shopify Restyle**.
- **💾 Gerenciamento de Estado & Cache:** Sincronização de dados eficiente com **TanStack Query (React Query)** e estado global com **Zustand**.

---

## 🛠️ Tech Stack

### Monorepo Tooling

- **TurboRepo:** Gerenciamento inteligente de build e cache.
- **TypeScript:** Tipagem estática em todo o projeto.

### Backend (apps/backend)

- **Framework:** NestJS (v11)
- **Banco de Dados:** MongoDB via Mongoose.
- **Comunicação:** WebSockets (Socket.io) e REST.
- **Segurança:** Passport JWT e Bcrypt para hashing de senhas.
- **Utilitários:** Ngrok integrado para testes em dispositivos físicos.

### Frontend (apps/mobile)

- **Framework:** Expo (v54) + React Native.
- **Roteamento:** Expo Router (File-based routing).
- **Data Fetching:** TanStack Query v5.
- **Estado:** Zustand.
- **Estilização:** Shopify Restyle (Utility-first para React Native).
- **Formulários:** Formik + Validação.
- **Listas:** Shopify FlashList para performance máxima.

---

## 📂 Estrutura do Projeto

```text
easy-app/
├── apps/
│   ├── backend/          # NestJS API, MongoDB, WebSockets
│   └── mobile/           # Expo App (Android, iOS, Web)
├── package.json          # Scripts globais e Turbo configuration
└── ...config files

```

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js >= 18
- Docker & Docker Compose (para o MongoDB)
- Expo Go (opcional para testes físicos)

### Instalação e Execução

1. **Clone o repositório:**

```bash
git clone https://github.com/Jxnatan7/easy-app.git
cd easy-app

```

2. **Instale as dependências:**

```bash
yarn install

```

3. **Inicie a aplicação completa:**

```bash
yarn start

```

_Este comando irá:_

- Levantar o banco de dados MongoDB via Docker.
- Iniciar o túnel Ngrok para o backend.
- Rodar o NestJS em modo watch.
- Abrir o Expo Dev Server.

---

## 🕹️ Scripts Disponíveis

| Comando        | Descrição                                             |
| -------------- | ----------------------------------------------------- |
| `yarn start`   | Inicia backend e frontend simultaneamente.            |
| `yarn backend` | Inicia apenas o servidor NestJS (com Docker e Ngrok). |
| `yarn mobile`  | Inicia apenas o ambiente Expo com suporte a túnel.    |
| `yarn build`   | Compila ambas as aplicações para produção.            |
| `yarn lint`    | Executa a verificação de lint em todo o monorepo.     |
| `yarn format`  | Formata o código usando Prettier.                     |

---

## 🏗️ Arquitetura do Backend

O backend foi construído seguindo princípios de **Arquitetura Evolutiva** e **Design Modular**. Cada domínio da aplicação é isolado, permitindo que o sistema cresça de forma organizada e sustentável.

### 📁 Estrutura de Pastas (apps/backend)

```text
src/
├── @core/                 # Lógica compartilhada, entidades globais e utilitários base
├── auth/                  # Módulo de Autenticação (Guards, Strategies JWT, Passport)
├── chat/                  # Módulo de Chat (Gateways WebSocket e lógica de salas)
├── communication-request/ # Gestão de solicitações de contato/amizade
├── message/               # Domínio de mensagens e histórico
├── user/                  # Gestão de perfis e dados de usuários
├── helpers/               # Funções utilitárias e formatadores
├── app.module.ts          # Módulo raiz que orquestra a aplicação
└── main.ts                # Ponto de entrada (Bootstrap) e config. de middlewares

```

### 🧩 Anatomia de um Módulo

Cada módulo dentro de `src/` segue um padrão de separação de interesses para facilitar testes e manutenção:

- **`core/`**: Contém as regras de negócio puras, casos de uso e definições de esquemas (Mongoose). Esta camada é independente de protocolos externos.
- **`http/`**: Abriga os Controllers e DTOs (Data Transfer Objects), lidando especificamente com a camada de transporte REST.
- **`gateways/`**: (Exclusivo do módulo de Chat) Gerencia a comunicação bidirecional via **WebSockets (Socket.io)**.
- **`strategies/` & `guards/**`: (Exclusivo de Auth) Define como o sistema protege as rotas e valida o token JWT.

### ⚙️ Infraestrutura e Configurações

- **Docker & Docker Compose**: O projeto já inclui arquivos de configuração para subir um container do **MongoDB**, garantindo que o ambiente de desenvolvimento seja idêntico para todos os colaboradores.
- **Ngrok Integration**: Configurado para expor o servidor local automaticamente, facilitando o teste do app mobile em dispositivos físicos sem complicação de rede.
- **Environment**: Gerenciamento de variáveis de ambiente robusto via `.env` para chaves de API, segredos de JWT e strings de conexão.

---

## 💬 Sistema de Comunicação Real-time (WebSockets)

O **Easy App** utiliza **Socket.io** integrado ao NestJS para fornecer uma experiência de chat persistente e segura. A comunicação é protegida por JWT e organizada através de salas (Rooms) dinâmicas.

### 🔐 Segurança e Autenticação

Diferente de requisições HTTP comuns, o WebSocket exige uma validação no momento do handshake:

- **Extração de Token**: O gateway aceita o JWT tanto via query string (`?token=...`) quanto pelo header `Authorization` (Bearer).
- **Validação**: O `JwtService` verifica o token; se inválido, a conexão é rejeitada imediatamente.
- **Identidade**: Uma vez conectado, os dados do usuário (`userId`, `role`) são vinculados à instância do Socket (`client.data`), eliminando a necessidade de reenviar dados de usuário em cada mensagem.

### 🏠 Gerenciamento de Salas (Rooms)

A aplicação utiliza uma estratégia de salas para entrega segmentada de mensagens:

1. **Sala Pessoal**: Ao conectar, cada usuário entra automaticamente na sala `user:{userId}`. Isso permite o envio de notificações privadas de qualquer lugar do sistema.
2. **Sala de Chat (1v1)**: Ao entrar em uma conversa, os usuários ingressam em salas `chat:{id}`.

- **Trava de Segurança**: O gateway valida se o usuário é realmente um participante do chat antes de permitir a entrada.
- **Limite de Participantes**: Existe uma lógica integrada que monitora e restringe as salas a no máximo 2 participantes distintos, garantindo a privacidade de chats 1v1.

### 📡 Eventos do Gateway

#### **Enviados pelo Cliente (Subscribers)**

| Evento       | Payload                              | Descrição                                                                 |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| `join`       | `{ communicationRequestId: string }` | Entra em uma sala baseada em uma requisição de contato.                   |
| `joinByChat` | `{ chatId: string }`                 | Entra em uma sala diretamente pelo ID do chat.                            |
| `message`    | `{ chatId, content, timestamp }`     | Envia uma mensagem. O servidor persiste no MongoDB e replica para a sala. |
| `leave`      | `{ communicationRequestId: string }` | Sai da sala de chat atual.                                                |

#### **Enviados pelo Servidor (Emitters)**

| Evento                      | Payload            | Gatilho                                                  |
| --------------------------- | ------------------ | -------------------------------------------------------- |
| `message`                   | `MessageObject`    | Nova mensagem recebida na sala.                          |
| `new_communication_request` | `RequestData`      | Notifica um usuário sobre um novo pedido de contato.     |
| `participant_joined`        | `{ userId }`       | Indica que o outro participante entrou no chat.          |
| `joined`                    | `{ room, chatId }` | Confirmação de que o cliente entrou na sala com sucesso. |
| `error` / `*_error`         | `string`           | Falha na autenticação ou validação de regras de negócio. |

### 💾 Persistência e Notificações

- **Mensagens**: Todas as mensagens enviadas via evento `message` são validadas, vinculadas ao remetente e salvas no MongoDB antes de serem transmitidas.
- **Notificações Cross-Module**: O backend conta com métodos como `notifyNewCommunicationRequest`, permitindo que outros módulos (como o de contatos) disparem eventos de WebSocket para o usuário alvo de forma desacoplada.

---

## 📱 Frontend (Expo & React Native)

O frontend do **Easy App** foi projetado para oferecer uma experiência nativa fluida em Android e iOS, mantendo compatibilidade total com a Web. A arquitetura foca fortemente na **separação de preocupações** e no **reuso de lógica** através de hooks customizados.

### 📁 Estrutura de Pastas (apps/mobile)

```text
mobile/
├── app/                  # Rotas do Expo Router (File-based routing)
│   ├── (tabs)/           # Estrutura principal com abas
│   └── (communication-request)/ # Fluxo de etapas para novas conexões
├── components/           # Biblioteca de componentes UI
│   ├── restyle/          # Componentes primitivos (Box, Text, etc.) baseados no Shopify Restyle
│   └── theme/            # Componentes de domínio (Chat, Botões, Formulários)
├── hooks/                # Lógica de negócio e integração com API/Sockets
├── contexts/             # Provedores de estado global (Auth, Keyboard, Communication)
├── services/             # Configurações de API (Axios) e integração WebSocket
└── stores/               # Estado global persistente (Zustand)

```

### 🔄 Sincronização de Dados e Real-time

A aplicação utiliza uma abordagem híbrida para garantir que a UI esteja sempre atualizada:

1. **HTTP & Cache (TanStack Query)**:

- As requisições REST são gerenciadas pelo **React Query**.
- Hooks como `useChatMessages` utilizam o cache automático para carregamento instantâneo, lidando com paginação e estados de erro de forma transparente.

2. **WebSockets (Socket.io-client)**:

- O hook `useChatSocket` gerencia a conexão bidirecional.
- **Invalidatão de Cache**: Ao receber um evento de `message` via WebSocket, a aplicação invalida automaticamente as queries do React Query relacionadas, garantindo que o histórico de mensagens e a lista de chats sejam atualizados sem que o usuário precise recarregar a tela.

### 🏗️ UI Toolkit: Restyle & Componentes

O sistema de design é construído sobre o **Shopify Restyle**, permitindo:

- **Theming**: Troca fácil de cores, espaçamentos e variantes de tipografia.
- **Performance**: Utiliza componentes atômicos (`Box`, `Text`) que evitam re-renderizações desnecessárias.
- **Componentes Prontos**: O repositório já conta com `FlashList` (otimizada para mensagens), `CodeCamera` para leitura de QR Codes e `BottomSheet` para ações rápidas.

### ⚓ Hooks Customizados (A "Mágica" do Easy App)

Os hooks encapsulam toda a complexidade da aplicação, permitindo que as telas (views) permaneçam limpas:

- **`useChatSocket`**: Gerencia o handshake JWT e a entrada em salas de chat.
- **`useChatMessages`**: Abstrai a lógica de busca de histórico e integração com o socket.
- **`useUserForm`**: Lida com a validação de formulários complexos e submissão de dados.
- **`useCommunicationRequestController`**: Controla o fluxo de pedidos de amizade e aceitação em tempo real.

### 🔐 Fluxo de Autenticação

A segurança é gerenciada pelo `AuthProvider`, que:

- Persiste o JWT de forma segura (usando `SecureStore` no mobile e `js-cookie` na web).
- Injeta automaticamente o token nos headers de todas as requisições HTTP e no handshake do WebSocket.
- Monitora a validade da sessão e redireciona o usuário para o `login` caso o token expire.

---

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues ou enviar Pull Requests. Para mudanças maiores, por favor, abra uma issue primeiro para discutir o que você gostaria de mudar.

---

⭐ **Gostou do projeto? Considere dar uma estrela no repositório!**

---
