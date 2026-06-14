# Tier 1 — Especificação Completa de Implementação

> **Documento de execução.** Tudo que precisa ser feito para o Easy App parar de ser "boilerplate" e virar um template profissional Tier 1: fundações sólidas, features pré-prontas obrigatórias, DX que poupa semanas, e polish que comunica seriedade. Tiers 2 e 3 ficam para depois.
>
> **Objetivos transversais e inegociáveis**: **manutenibilidade ativa** (qualquer dev, sem contexto, edita com segurança) e **escalabilidade preparada** (modular monolith pronto para split, stateless, idempotente, observável). Estes objetivos são garantidos por aplicação rigorosa de **SOLID** + um catálogo claro de **design patterns arquiteturais, estruturais, criacionais, comportamentais e de integração** — detalhados em [§3.7](#37-solid--aplicação-prática-obrigatória) a [§3.12](#312-manutenibilidade--escalabilidade--princípios-operacionais).

---

## Sumário

1. [Princípios & North Star](#1-princípios--north-star)
2. [Diagnóstico do estado atual](#2-diagnóstico-do-estado-atual)
3. [Fundações arquiteturais, SOLID e Design Patterns](#3-fundações-arquiteturais-solid-e-design-patterns-pré-requisito-de-tudo)
   - 3.1 Estrutura final do monorepo
   - 3.2 Pacotes compartilhados
   - 3.3 Backend — estrutura DDD-lite
   - 3.4 Frontend — estrutura feature-first
   - 3.5 Boundaries (linter-enforced)
   - 3.6 Renomeação placeholder do template
   - **3.7 SOLID — aplicação prática obrigatória**
   - **3.8 Padrões arquiteturais (high-level)**
   - **3.9 Padrões estruturais, criacionais e comportamentais**
   - **3.10 Padrões de integração**
   - **3.11 Padrões frontend-específicos**
   - **3.12 Manutenibilidade & Escalabilidade — princípios operacionais**
4. [Features Tier 1 — detalhamento por feature](#4-features-tier-1--detalhamento-por-feature)
5. [Developer Experience (DX) Tier 1](#5-developer-experience-dx-tier-1)
6. [CI/CD Tier 1](#6-cicd-tier-1)
7. [Documentação Tier 1](#7-documentação-tier-1)
8. [Polish profissional Tier 1](#8-polish-profissional-tier-1)
9. [Critérios objetivos de "Tier 1 atingido"](#9-critérios-objetivos-de-tier-1-atingido)
10. [Roadmap em fases ordenadas](#10-roadmap-em-fases-ordenadas)
11. [Checklist consolidado](#11-checklist-consolidado)

---

## 1. Princípios & North Star

### 1.1 Princípios não-negociáveis do Tier 1

1. **Plug-out trivial**: toda feature pré-pronta é removível deletando 1 pasta + 1 import. Se exigir refactor, foi acoplada errado.
2. **Feature-first em TODOS os apps**: backend, mobile e web organizam código por *bounded context* / *feature*, não por camada técnica.
3. **Single source of truth para contratos**: Zod schemas em `packages/contracts` consumidos por backend, mobile e web. Mudar campo → quebra build de quem consome.
4. **Opinião sobre tech, neutralidade sobre produto**: o template decide stack (Nest, Expo, Next, TanStack, Zustand, Zod). Não decide se você vende SaaS ou rede social.
5. **Zero feature de "preencher tela"**: nada de dashboards genéricos, cards de exemplo, gráficos fake. Toda feature incluída é genuinamente reutilizável.
6. **5 minutos do clone ao app rodando**: `git clone → yarn bootstrap → yarn dev`. Mais que isso é fricção.
7. **Boundaries linter-enforced**: imports inválidos quebram CI, não dependem de disciplina.
8. **SOLID por padrão, não por exceção**: todo PR é revisado contra os 5 princípios (ver [§3.7](#37-solid--aplicação-prática-obrigatória)). Violação justificada vira ADR; injustificada bloqueia merge.
9. **Manutenibilidade ativa**: o código é lido 10× mais do que é escrito. Nomes longos e explícitos, responsabilidades únicas, modularização agressiva, refactor seguro via tipos + testes + boundaries.
10. **Escalabilidade preparada, não prematura**: modular monolith hoje, microservices possíveis amanhã sem reescrita. Stateless backend, idempotência em mutations, cache invalidation declarativa, observability built-in.
11. **Design patterns deliberados**: cada padrão aplicado tem motivo e está catalogado em [§3.8](#38-padrões-arquiteturais-high-level)–[§3.11](#311-padrões-frontend-específicos). Pattern por status (cargo culting) é anti-padrão.

### 1.2 Definição de "Tier 1 atingido"

Detalhada em [§9](#9-critérios-objetivos-de-tier-1-atingido). Resumo:

- Todas as 19 features Tier 1 implementadas, documentadas e plug-out testado.
- Tempo `clone → rodando` < 5 min (com Docker pré-instalado).
- Tempo `gerar feature nova com CLI` < 10 min para começar a escrever lógica.
- CI verde em `main` por ≥ 30 dias.
- 100% das features cobertas por pelo menos 1 teste idiomático.
- Bootstrap renomeia template em 1 comando, reset de histórico git incluso.
- **SOLID auditado por PR**: template de PR força checklist; ESLint custom rules pegam violações de SRP (arquivos >300 linhas), OCP (switch sobre tipo) e DIP (import direto de implementação no lugar de port).
- **Padrões catalogados**: cada padrão de [§3.8](#38-padrões-arquiteturais-high-level)–[§3.11](#311-padrões-frontend-específicos) tem pelo menos um uso de referência implementado e documentado.
- **Métricas de manutenibilidade**: complexidade ciclomática média ≤ 8 por arquivo; nenhum arquivo > 300 linhas sem justificativa; 0 ciclo de dependência entre módulos.

---

## 2. Diagnóstico do estado atual

### 2.1 Monorepo
- Turborepo + Yarn 4 workspaces — `apps/backend` (NestJS 11), `apps/mobile` (Expo 54 / RN 0.84).
- **Sem `packages/`**: zero código compartilhado entre apps.
- **Sem app web dedicado**: README promete Web via react-native-web, mas não há Next.js para SEO/SSR/admin.

### 2.2 Backend ([apps/backend/src](../apps/backend/src))
Três padrões organizacionais convivendo:

| Pasta | Padrão | Status |
|---|---|---|
| [src/modules/auth](../apps/backend/src/modules/auth), [user](../apps/backend/src/modules/user) | NestJS plano | Em uso |
| [src/modules/chat](../apps/backend/src/modules/chat), [communication-request](../apps/backend/src/modules/communication-request), [message](../apps/backend/src/modules/message) | `core/` + `infrastructure/` parcial | Em migração |
| [src/modules/demo](../apps/backend/src/modules/demo), [src/core](../apps/backend/src/core) | DDD-lite (`application/domain/infrastructure`) | Esqueleto vazio |

Problemas:
- [src/core/auth](../apps/backend/src/core/auth) e [src/core/user](../apps/backend/src/core/user) duplicam estruturalmente `modules/auth` e `modules/user`.
- [app.module.ts:4](../apps/backend/src/app.module.ts#L4) importa de `src/auth/auth.module` (path inexistente).
- Sem camada de domínio real, sem use cases nomeados, sem repository ports.
- `helpers/`, `decorators/`, `shared/helpers/` dispersos sem critério.

### 2.3 Mobile ([apps/mobile/src](../apps/mobile/src))
Sete formas paralelas para o mesmo tipo de código:

| Pasta | Conflito |
|---|---|
| [components/restyle](../apps/mobile/src/components/restyle) + [components/theme](../apps/mobile/src/components/theme) | Duplica [ui/primitives](../apps/mobile/src/ui/primitives) + [ui/components](../apps/mobile/src/ui/components) |
| [services/](../apps/mobile/src/services) | Duplica `core/{auth,user}/services` (vazias) |
| [stores/](../apps/mobile/src/stores) | Duplica `features/{auth,communication-request}/store` |
| [hooks/](../apps/mobile/src/hooks) (19 hooks) | Mistura feature-specific + transversal; duplica [shared/hooks/](../apps/mobile/src/shared/hooks) |
| [contexts/](../apps/mobile/src/contexts) | Duplica `features/auth/contexts`, `core/contexts` |

Adicional:
- Telas em três lugares: [app/](../apps/mobile/app) (raiz), `app/(grupo)/`, `features/*/screens`.
- Componentes de feature (`CommunicationRequestItem`, `MessageInput`) em [components/theme/](../apps/mobile/src/components/theme), longe da feature.
- Sem barrel exports nas features — sem contrato público.

### 2.4 Tooling
- Sem ESLint compartilhado, sem `tsconfig` base, sem Prettier compartilhada.
- Sem geradores. Sem CI além de scripts soltos.
- Sem `docker-compose` para mais que Mongo.

---

## 3. Fundações arquiteturais, SOLID e Design Patterns (pré-requisito de tudo)

> Nenhuma feature Tier 1 entra antes destas fundações estarem completas. Pular essa seção custa retrabalho em todas as features que vierem depois.
>
> Subseções 3.1–3.6 cobrem **estrutura** (monorepo, pacotes, layout backend/frontend, boundaries, bootstrap). Subseções **3.7–3.12** cobrem **disciplina arquitetural**: SOLID, padrões e princípios de manutenibilidade/escalabilidade que toda feature Tier 1 deve seguir. Nada aqui é decorativo — todo item é verificado em PR ou linter.

### 3.1 Estrutura final do monorepo

```text
{{app-name}}/
├── apps/
│   ├── backend/                  # NestJS 11
│   ├── mobile/                   # Expo 54 (iOS, Android)
│   └── web/                      # Next.js 15 (App Router) — NOVO
├── packages/
│   ├── contracts/                # Zod schemas + tipos DTO + socket events
│   ├── ui/                       # Design system cross-platform
│   ├── config-eslint/            # eslint configs (base, nestjs, react, react-native, next)
│   ├── config-typescript/        # tsconfig bases
│   ├── config-prettier/          # prettier config
│   └── utils/                    # funções puras (formatters, validators)
├── tooling/
│   ├── cli/                      # comando `easy` — gen feature, gen entity, etc.
│   ├── bootstrap/                # script de renomeação do template
│   └── doctor/                   # validação de pré-requisitos
├── docs/                         # ADRs + cookbook + arquitetura
├── .github/
│   ├── workflows/                # CI por workspace
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docker-compose.yaml           # mongo + redis + minio + mailhog
└── turbo.json
```

### 3.2 Pacotes compartilhados — especificação

#### `packages/contracts`
- **Stack**: Zod 3.x + tipos TS derivados.
- **Estrutura**:
  ```
  contracts/
  ├── src/
  │   ├── auth/               # LoginSchema, SignupSchema, etc.
  │   ├── user/               # UserSchema, UpdateUserSchema
  │   ├── notifications/
  │   ├── ...                 # 1 pasta por bounded context
  │   ├── events/             # WebSocket events tipados
  │   ├── errors/             # ApiError discriminated union
  │   └── index.ts
  └── package.json
  ```
- **Convenção**: cada schema exporta `Schema` (Zod), `Type` (TS), e opcionalmente `factory` (para testes/seeds).
- **Consumo backend**: pipe Nest `ZodValidationPipe` aplica schema em controllers.
- **Consumo client**: `zodResolver` no Formik + tipos nos hooks de TanStack Query.

#### `packages/ui`
- **Stack escolhida (decisão crítica)**: Tamagui v4. Justificativa: cross-platform real (RN + Web via same primitive), tree-shake granular, performance compile-time, theming token-driven.
- **Alternativa**: manter Shopify Restyle no mobile + duplicar com shadcn no web. Decisão registrada em [docs/adr/0001-design-system.md](adr/0001-design-system.md) (criar).
- **Estrutura**:
  ```
  ui/
  ├── src/
  │   ├── tokens/             # cores, espaçamentos, tipografia
  │   ├── primitives/         # Box, Stack, Text, Pressable
  │   ├── components/         # Button, Input, Card, Modal, Toast, ...
  │   ├── states/             # Skeleton, EmptyState, ErrorState, LoadingState
  │   ├── icons/              # wrapper sobre Lucide ou Phosphor
  │   └── index.ts
  ```
- **Migração**: [apps/mobile/src/components/restyle](../apps/mobile/src/components/restyle) e [components/theme](../apps/mobile/src/components/theme) viram consumidores do `@app/ui`. Componentes de feature saem daqui para suas features.

#### `packages/config-typescript`
- Arquivos: `base.json`, `nestjs.json`, `expo.json`, `nextjs.json`, `library.json`.
- Apps estendem via `"extends": "@app/config-typescript/nextjs.json"`.

#### `packages/config-eslint`
- Configs: `base`, `nestjs`, `react`, `react-native`, `next`.
- Plugins obrigatórios: `eslint-plugin-boundaries`, `eslint-plugin-import`, `@typescript-eslint`, `eslint-plugin-unused-imports`, `eslint-plugin-react-hooks`.
- Regras de boundaries (ver §3.5).

#### `packages/config-prettier`
- Um único `prettier.config.js` shared, com `.prettierignore` template.

#### `packages/utils`
- Funções puras sem deps de runtime: `formatCurrency`, `formatDate`, `cn`, `omit`, `pick`, `assertNever`.
- Sem React, sem Nest — importável de qualquer lugar.

### 3.3 Backend — estrutura DDD-lite final

```text
apps/backend/src/
├── main.ts
├── app.module.ts
├── modules/
│   └── <bounded-context>/
│       ├── domain/
│       │   ├── entities/         # classes puras (sem decorators Nest/Mongoose)
│       │   ├── value-objects/
│       │   ├── events/           # eventos de domínio
│       │   └── repositories/     # INTERFACES (portas)
│       ├── application/
│       │   ├── use-cases/        # 1 arquivo por caso (CreateX, GetXById, ...)
│       │   ├── dtos/             # re-export de contracts/ + DTOs internos
│       │   └── ports/            # interfaces de adapters externos
│       ├── infrastructure/
│       │   ├── persistence/      # schemas Mongoose + repository impl
│       │   ├── http/             # controllers REST (thin adapters)
│       │   ├── ws/               # gateways Socket.io
│       │   └── adapters/         # implementações de ports
│       └── <feature>.module.ts
├── shared/
│   ├── kernel/                   # value objects compartilhados (Email, UserId, Money)
│   ├── exceptions/               # DomainException base
│   ├── pipes/                    # ZodValidationPipe
│   ├── interceptors/             # LoggingInterceptor, AuditInterceptor
│   ├── filters/                  # AllExceptionsFilter
│   └── utils/
├── infrastructure/
│   ├── database/                 # MongooseModule + connection factory
│   ├── auth/                     # JwtModule, PassportModule wiring + guards
│   ├── events/                   # EventEmitter config
│   ├── config/                   # ConfigModule + Zod env schema
│   ├── mailer/                   # Resend adapter
│   ├── storage/                  # S3/R2 adapter
│   ├── queue/                    # BullMQ (opcional Tier 1, ver §4.X)
│   └── http/                     # axios instance para serviços externos
└── decorators/                   # @CurrentUser, @Audited, @Throttle
```

**Limpezas obrigatórias antes da migração**:
- ✂️ Apagar [src/core/](../apps/backend/src/core) (esqueleto vazio).
- ✂️ Apagar [src/modules/demo/](../apps/backend/src/modules/demo) (scaffold).
- ✂️ Apagar [ngrok.log](../apps/backend/ngrok.log) e adicionar ao [.gitignore](../apps/backend/.gitignore).
- 🔧 Corrigir [app.module.ts:4](../apps/backend/src/app.module.ts#L4) — path quebrado.
- 🔁 Consolidar `helpers/` e `shared/helpers/` em `shared/utils/`.

### 3.4 Frontend (mobile + web) — estrutura feature-first final

Estrutura idêntica entre `apps/mobile/src` e `apps/web/src`. Cada feature é autossuficiente:

```text
src/
├── app/                          # roteador (Expo Router | Next App Router)
│   └── (arquivos finos importam de features/)
├── features/
│   └── <feature-name>/
│       ├── api/                  # hooks TanStack Query/Mutation
│       ├── components/           # componentes ESCLUSIVOS da feature
│       ├── hooks/                # hooks de comportamento da feature
│       ├── screens/              # telas (mobile) / pages-wrappers (web)
│       ├── store/                # zustand slice da feature
│       ├── types/                # tipos derivados de @app/contracts + locais
│       ├── utils/
│       └── index.ts              # API pública (NUNCA importar profundo)
├── shared/
│   ├── components/               # genéricos não-DS, reutilizados
│   ├── hooks/                    # useDebounce, useAssets, etc.
│   ├── lib/                      # queryClient, axios, socket, storage adapter
│   └── utils/
├── core/
│   ├── auth/                     # única feature "core" (usada por todas as outras)
│   ├── config/                   # env, constants
│   ├── providers/                # AppProviders compõe Query/Theme/Auth/Socket
│   └── i18n/                     # config i18next
└── ui/                           # re-export curado de @app/ui + overrides locais
```

**Limpezas obrigatórias antes da migração** (mobile):
- ✂️ Apagar [src/components/restyle/](../apps/mobile/src/components/restyle) e [src/components/theme/](../apps/mobile/src/components/theme) após migrar para `@app/ui`.
- ✂️ Apagar [src/services/](../apps/mobile/src/services) — virar `features/<f>/api/`.
- ✂️ Apagar [src/stores/](../apps/mobile/src/stores) — virar `features/<f>/store/`.
- ✂️ Apagar [src/hooks/](../apps/mobile/src/hooks) — dividir entre `features/<f>/hooks/` e `shared/hooks/`.
- ✂️ Apagar [src/contexts/](../apps/mobile/src/contexts) — virar `features/<f>/contexts/` ou `core/providers/`.
- ✂️ Apagar [src/core/](../apps/mobile/src/core) (esqueleto duplicado com `features/`).
- 🔁 Consolidar [src/theme/](../apps/mobile/src/theme) com tokens de `@app/ui`.

### 3.5 Boundaries (linter-enforced)

Configuração `eslint-plugin-boundaries` em `packages/config-eslint/react.js`:

| De | Pode importar de | Não pode |
|---|---|---|
| `features/A` | `shared/`, `core/`, `ui/`, `@app/*` | `features/B` (qualquer outra feature) |
| `shared/` | `core/`, `ui/`, `@app/*` | `features/*` |
| `core/auth` | `shared/`, `ui/`, `@app/*` | `features/*` |
| `core/*` (exceto auth) | `shared/`, `@app/*` | `features/*`, `ui/` |
| `ui/` | `@app/ui`, `@app/utils` | tudo o resto |
| `app/` (router) | `features/*/index.ts`, `core/`, `shared/`, `ui/` | imports profundos em features |

Imports profundos (`features/x/components/Y` em vez de `features/x`) bloqueados via regra `boundaries/no-private`.

### 3.6 Renomeação placeholder do template

Substituições alvo (em `tooling/bootstrap/init.ts`):

| Placeholder | Onde aparece hoje | Vira |
|---|---|---|
| `{{APP_NAME}}` | [package.json:2](../package.json#L2), [apps/backend/package.json:2](../apps/backend/package.json#L2), [apps/mobile/package.json:2](../apps/mobile/package.json#L2), `README.md`, `app.json` | `--name=` |
| `{{SCOPE}}` | imports `@app/*` em todos os apps/packages | `--scope=` |
| `{{BUNDLE_ID}}` | [apps/mobile/app.json](../apps/mobile/app.json) (iOS/Android), `eas.json` | `--bundle-id=` |
| `{{DISPLAY_NAME}}` | `app.json`, `Info.plist`-equiv | `--display=` |

Script faz: substituição → `rm -rf .git && git init && git add -A && git commit -m "chore: initial commit"` → `cp .env.example .env` em cada app → `yarn install`.

---

### 3.7 SOLID — aplicação prática obrigatória

> **Regra do template**: SOLID é **checklist de PR**, não palestra. Toda PR responde explicitamente a `S/O/L/I/D — onde foi aplicado / onde foi violado e por quê`. Violações justificadas viram ADR. Violações injustificadas bloqueiam merge.

#### S — Single Responsibility Principle

**O que significa aqui**: 1 arquivo = 1 motivo para mudar.

| Camada | Como aplicar |
|---|---|
| **Use cases** | 1 arquivo = 1 caso de uso. `SignUp.ts` não orquestra envio de email — delega para `EmailVerificationSender` port. |
| **Controllers (Nest)** | Thin adapters. Apenas: validar payload via pipe Zod → chamar use case → mapear erro de domínio para HTTP. Sem regra de negócio. |
| **Gateways (WS)** | Idem controllers, mas para Socket.io. Sem regra de negócio dentro do gateway. |
| **Componentes React** | 1 componente = 1 responsabilidade visual. Lógica fica em hooks, dados em queries, JSX só renderiza. |
| **Hooks** | 1 hook = 1 capability. `useSignUp` não faz log de analytics — chama `trackEvent` injetado. |

**Smells a evitar** (bloqueados ou flagados por linter custom):
- Classe `*Service` com >5 métodos públicos não-correlatos.
- Arquivo `*.helpers.ts` ou `utils.ts` com >300 linhas.
- Controller que importa Mongoose direto.
- Componente React com >200 linhas (linter warning, justificável).
- `useEffect` com mais de 3 responsabilidades aninhadas.

**Refactor concreto exigido no projeto atual**: o atual [auth.service.ts](../apps/backend/src/modules/auth/auth.service.ts) provavelmente concentra signIn + signUp + refresh. Quebrar em `application/use-cases/{SignIn,SignUp,RefreshSession}.ts` — um arquivo por intenção.

#### O — Open/Closed Principle

**O que significa aqui**: extensível sem editar código existente. Aberto para extensão, fechado para modificação.

| Caso | Mecanismo |
|---|---|
| Adicionar OAuth provider (Google, Apple, GitHub, futuro Discord) | `OAuthProviderRegistry` (pattern Registry + Strategy). Novo provider = novo arquivo + 1 `register()`. |
| Trocar S3 por GCS/R2 | `StorageAdapter` port. Novo adapter = novo arquivo + troca de provider no module. |
| Adicionar canal de notificação (email/push/in-app/SMS futuro) | `NotificationDispatcher` por canal, escolha por tipo de evento. |
| Adicionar idioma | Adicionar `locales/<lang>/*.json`. Zero código tocado. |
| Adicionar entity tipo de auditoria | `@Audited({ action: '...' })` decorator. Sem mexer no `AuditInterceptor`. |

**Smells a evitar**:
- `switch(type) { case 'email': ... case 'push': ... }` que cresce a cada feature → vira Strategy/Registry.
- `if (provider === 'google') ... else if (provider === 'apple') ...` no controller → vira Strategy.
- "Adicionar feature X exige tocar 6 arquivos espalhados" → repensar abstração.

**Lint custom**: regra contra `switch` sobre campo de string com >3 cases dentro de `application/` (sinal de Strategy mal-modelado).

#### L — Liskov Substitution Principle

**O que significa aqui**: qualquer implementação de uma port deve ser substituível sem o consumidor perceber.

| Contrato | Implementações que TÊM que ser intercambiáveis |
|---|---|
| `SessionRepository` | `SessionMongoRepository`, `SessionInMemoryRepository` (testes) |
| `StorageAdapter` | `S3StorageAdapter`, `MinioStorageAdapter`, `LocalFilesystemAdapter` (dev) |
| `EmailSender` | `ResendEmailSender`, `MailhogEmailSender` (dev), `LogOnlyEmailSender` (CI) |
| `PushNotificationSender` | `ExpoPushAdapter`, `WebPushAdapter`, `NoopPushAdapter` (testes) |
| `CacheStore` | `RedisCache`, `InMemoryCache` |

**Garantia**: cada contrato tem **contract tests** em `packages/contracts/src/**/contract.spec.ts` que toda implementação roda. Implementação que falha contract test não merge.

**Smells a evitar**:
- Subclasse que joga `throw new Error('not supported')` em método herdado → quebra LSP.
- Implementação que muda semântica (ex: `find` que retorna `null` em uma impl e `throws` em outra).

#### I — Interface Segregation Principle

**O que significa aqui**: clientes não dependem de métodos que não usam.

| Tamanho ideal de port | Exemplo |
|---|---|
| 1–3 métodos | `EmailVerificationSender`, `PasswordHasher`, `OneTimeCodeGenerator` |
| Múltiplas ports em vez de 1 grande | `UserReader` + `UserWriter` separados (CQRS-lite); `NotificationCreator` separado de `NotificationReader` |

**Frontend**: hooks segregados.
- Em vez de `useNotifications()` retornar `{ list, unread, markAsRead, markAllAsRead, send, archive }`, oferecer:
  - `useNotifications()` — list + paginação.
  - `useUnreadCount()` — contador (subscreve socket).
  - `useMarkAsRead()` — mutation focada.

**Smells a evitar**:
- Interface com >10 métodos.
- "God services" do tipo `UserService` com 20 métodos.
- Hook que retorna objeto com >6 propriedades.

#### D — Dependency Inversion Principle

**O que significa aqui**: módulos de alto nível (use cases) não dependem de módulos de baixo nível (DB, HTTP). Ambos dependem de abstrações (ports).

**Estrutura obrigatória**:

```ts
// domain/repositories/SessionRepository.ts  ← INTERFACE
export const SESSION_REPOSITORY = Symbol('SessionRepository');
export interface SessionRepository {
  save(session: Session): Promise<void>;
  findById(id: string): Promise<Session | null>;
  revokeById(id: string): Promise<void>;
}

// application/use-cases/SignIn.ts  ← DEPENDE DA INTERFACE
@Injectable()
export class SignIn {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepository,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: SignInInput): Promise<Result<Session, AuthError>> { ... }
}

// infrastructure/persistence/SessionMongoRepository.ts  ← IMPLEMENTA
@Injectable()
export class SessionMongoRepository implements SessionRepository { ... }

// auth.module.ts  ← WIRING
@Module({
  providers: [
    SignIn,
    { provide: SESSION_REPOSITORY, useClass: SessionMongoRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
  ],
})
export class AuthModule {}
```

**Convenções**:
- Tokens de DI são `Symbol` exportados da pasta `domain/repositories/` ou `application/ports/`.
- Nunca strings inline em `@Inject('SessionRepository')` — sempre `@Inject(SESSION_REPOSITORY)`.
- Use case **nunca** importa de `infrastructure/`. Linter bloqueia.

**Frontend**:
- Hooks consomem `queryClient`, `axios`, `socket`, `storage` via context provider, não import direto de singleton.
- `AuthProvider` injeta `AuthFacade` no context; componente filho usa `useAuth()` — nunca importa axios direto.

**Smells a evitar**:
- `import { sessionRepository } from '../infrastructure/...'` dentro de use case → DIP violation.
- Hook que faz `import axiosInstance from 'shared/lib/axios'` no meio da árvore → use o injetado.

---

### 3.8 Padrões arquiteturais (high-level)

Padrões que definem o **shape do sistema inteiro**. Aplicação é obrigatória.

| Padrão | Aplicação no template | Justificativa |
|---|---|---|
| **Hexagonal (Ports & Adapters)** | Cada módulo backend: `domain/` + `application/` no centro; `infrastructure/` como adapters externos. | Domain testável sem framework. Trocar Mongo por Postgres não toca regra de negócio. |
| **Clean Architecture (layered)** | 4 camadas com regra de dependência: Domain ← Application ← Infrastructure ← Presentation. Setas sempre apontam para dentro. | Fluxo de dependência previsível, enforced via `eslint-plugin-boundaries`. |
| **Modular Monolith** | 1 binário, N módulos isolados como bounded contexts. Cada módulo expõe API pública via `*.module.ts`; resto é privado. | Pronto para extrair em microservices sem reescrita. Não paga custo de microservices agora. |
| **Domain-Driven Design (lite)** | Entities, Value Objects, Aggregates explícitos. Linguagem ubíqua (use case names = vocabulário do produto). | Reduz acoplamento entre módulos. Onboarding mais rápido (código fala a linguagem do produto). |
| **Event-Driven (intra-process)** | `EventEmitter` (Nest) para eventos de domínio (`UserSignedUp`, `OrderPlaced`). Listeners desacoplados em outros módulos. | Notifications, audit, emails reagem sem que módulo emissor precise saber. |
| **CQRS-lite (opcional por módulo)** | Em módulos com leitura/escrita assimétricas, separar `queries/` de `commands/` dentro de `use-cases/`. Default: não aplicar. | Aplicar só onde justifica (ex: `audit-logs` é só leitura) — não por dogma. |
| **Feature-First Vertical Slicing (frontend)** | Cada feature = slice vertical (api + UI + state + types). Cross-feature comm via eventos/store global. | Adicionar/remover feature = 1 pasta. Onboarding rastreável. |
| **Repository Pattern** | Interfaces em `domain/repositories/`, implementações em `infrastructure/persistence/`. | Substituição de persistência sem tocar regra de negócio. |
| **API Versioning** | Prefixo `/v1/` em todas as rotas. v2 coexiste com v1 enquanto deprecação rola. | Backward-compatibility para clients deployados. |
| **BFF (preparado)** | Estrutura permite endpoints específicos para web vs mobile no futuro; default é REST único. | Não over-engineer hoje; permite futuro split sem reescrita. |

---

### 3.9 Padrões estruturais, criacionais e comportamentais

Padrões "GoF" aplicados pontualmente conforme problema. Cada padrão abaixo tem **uso de referência** implementado no template (catalogado em [docs/patterns/](patterns/), a criar).

#### 3.9.1 Estruturais

| Padrão | Onde no template | Por quê |
|---|---|---|
| **Adapter** | `StorageAdapter` (S3/MinIO), `SecretStorageAdapter` (expo-secure-store/cookies), `EmailSender` (Resend/Mailhog) | Isolar APIs externas; tornar substituível. |
| **Facade** | `AuthFacade` no frontend abstrai `signIn/signUp/refresh/oauth/forgotPassword/...` sob API única | Componente não chama 5 endpoints; trocar implementação é trivial. |
| **Decorator** | `@CurrentUser()`, `@Audited()`, `@Throttle()`, `@RequirePermission()`, `@ApiV1()` | Anotações declarativas no lugar de código repetitivo. |
| **Composite** | UI compound components: `<Form>` + `<Form.Field>` + `<Form.Submit>`; `<Modal>` + `<Modal.Header>` + `<Modal.Body>`; `<DataState>` + `<DataState.Loading>` + `<DataState.Empty>` | Composição declarativa, sem props-explosion. |
| **Proxy** | Cache layer wrapping repository reads quando justificar; lazy loading de imagens | Transparência ao consumidor; otimização não-invasiva. |
| **Bridge** | `PushNotificationSender` (abstração) ↔ `ExpoPushAdapter` + `WebPushAdapter` (implementações) | Abstração e implementação variam independentemente. |
| **Flyweight** | Tokens de tema compartilhados em `packages/ui/tokens` (1 cor referenciada por N componentes) | Memória + consistência visual. |

#### 3.9.2 Criacionais

| Padrão | Onde no template | Por quê |
|---|---|---|
| **Factory Method** | Entity factories: `User.create(props)` valida invariantes e retorna `Result<User>`. Test factories: `userFactory.build({ override })` em `packages/contracts/src/**/factory.ts` | Centraliza criação válida; seeds determinísticos. |
| **Builder** | `QueryBuilder` para listagens complexas (filtros, paginação, sort) em `audit-logs`, `notifications` | Construção fluente e legível de queries com muitos parâmetros opcionais. |
| **Abstract Factory** | `OAuthProviderFactory` retorna `GoogleProvider` / `AppleProvider` / `GitHubProvider` com base em config | Família de objetos relacionados (token exchange + user info) por provider. |
| **Dependency Injection (IoC)** | Nest IoC (backend); React Context Providers (`AppProviders` compõe Query + Auth + Theme + Socket + i18n) | Inversão de controle de criação de dependências; testabilidade. |
| **Singleton (com disciplina)** | `axios` instance, `socket.io` client, `queryClient` — instanciados 1× em `shared/lib/` e **injetados via provider**. Nunca importados direto. | Reuso de conexões; controle de lifecycle. Disciplina: import direto via singleton é bloqueado por linter custom. |
| **Prototype** | Test factories usam clones determinísticos para criar variants (`adminFactory = userFactory.derive({ role: 'admin' })`) | Reuso de configuração base em testes. |

#### 3.9.3 Comportamentais

| Padrão | Onde no template | Por quê |
|---|---|---|
| **Strategy** | OAuth providers, notification dispatchers (email/push/in-app por evento type), storage backends | Algoritmos intercambiáveis em runtime. |
| **Observer** | Domain events + listeners via `EventEmitter` (backend); WebSocket events no frontend (TanStack Query invalidation reativa) | Desacoplamento publicador/subscriber. |
| **Chain of Responsibility** | Pipeline Nest: Pipe (validação) → Guard (auth/RBAC) → Interceptor (logging/audit) → Controller → Use Case → Repository | Cada elo trata sua responsabilidade; ordem clara. |
| **Command** | Use cases SÃO commands: encapsulam intenção + input + execução. Auditáveis e retry-safe. | Operações como objetos de primeira classe. |
| **Mediator** | `EventEmitter` media comunicação entre módulos backend. `useNotifications` media socket → query cache no frontend. | Reduz acoplamento N-para-N para N-para-1. |
| **State (Machine)** | `OnboardingState`, `EmailVerificationState`, `SessionState` modelados como state machines com transições explícitas (não flags soltas) | Estados inválidos viram impossíveis de representar. |
| **Template Method** | Base classes para use cases comuns (ex: `AuthenticatedUseCase` injeta `CurrentUser`). Usar com parcimônia para não criar herança profunda. | Reutilização de skeleton; cuidado com over-engineering. |
| **Iterator** | Cursores de paginação em `infinite query` (TanStack Query); `for await (const batch of repo.streamAll())` no backend | Navegação uniforme sobre coleções; lazy loading. |
| **Memento** | Form autosave com snapshots reverteis; undo opcional em ações destrutivas (delete account com grace period) | Reversibilidade segura. |

---

### 3.10 Padrões de integração

Como o template fala com o mundo externo (APIs, queues, webhooks) e como módulos internos se integram.

| Padrão | Aplicação no template |
|---|---|
| **Anti-Corruption Layer (ACL)** | Cada integração externa (Stripe, OAuth providers, Resend, Expo Push) tem um adapter que **traduz** modelos externos para modelos do domínio. Trocar provider não vaza para regra de negócio. |
| **Idempotency Key** | Mutations sensíveis (`POST /payments`, `POST /signup`) aceitam header `Idempotency-Key`. Backend faz dedupe por TTL configurável (default 24h). |
| **Retry com backoff exponencial + jitter** | Toda chamada externa usa `p-retry` com backoff exp + jitter. Default: 3 tentativas, 100ms → 500ms → 2s. Implementado em wrapper único `shared/http/external.ts`. |
| **Circuit Breaker** | Para integrações críticas: `opossum` ou impl simples. Abre após N falhas consecutivas, retoma com half-open. Métrica exposta em `/health/ready`. |
| **Outbox Pattern** | Eventos de domínio que precisam ser publicados externamente vão para coleção `outbox` **no mesmo commit** do agregado. Worker separado publica e marca `sentAt`. Garante consistency eventual mesmo com falha de rede. |
| **Inbox Pattern** | Webhooks recebidos vão para coleção `inbox` antes de processar — garante exactly-once (dedupe por `eventId`). |
| **Webhook Receiver padrão** | Endpoint `/v1/webhooks/:provider` valida signature → retorna 200 rapidamente → enfileira processamento. Resposta < 3s sempre. |
| **API Gateway pattern (interno)** | `apps/backend` é único ponto de entrada (REST + WS). Versionamento em URL (`/v1/`). |
| **OpenAPI contract-first** | Schema OpenAPI gerado a partir de controllers + contracts; cliente TS gerado em `packages/api-client` no CI. |
| **Saga (orchestration)** | Para fluxos multi-step com falha possível (ex: account deletion = export data → delete files → delete DB → send confirmation): sequência de use cases com **compensação** explícita por step. |
| **CQRS messaging** | Eventos de domínio (intra-process) usam Observer. Eventos de integração (inter-service futuro) seguem contrato versionado em `packages/contracts/src/events/`. |
| **Backpressure / Rate limiting** | Aplicado externamente (clients para nós, ver [§4.18](#418-rate-limiting)) e internamente (filas com concurrency limit no BullMQ). |
| **Bulkhead** | Pool de conexões separados por tipo de operação (read replica vs write, queue worker vs HTTP). Falha em um não derruba o outro. |
| **Health check pattern** | `/health` (liveness, sempre 200 se app vive); `/health/ready` (readiness, checa Mongo + Redis + dependências externas). |

---

### 3.11 Padrões frontend-específicos

| Padrão | Onde / Como |
|---|---|
| **Container / Presenter** | Screens (`features/<f>/screens/`) fazem fetching + state. Componentes em `components/` são puros (props in, JSX out, sem queries). |
| **Custom Hook = Use Case** | `useCreateNotification` encapsula mutation + side effects + navegação. Componente só renderiza. Hook é o "use case do client". |
| **Compound Components** | `<Form>` + `<Form.Field>` + `<Form.Submit>`; `<Modal>` + `<Modal.Header/Body/Footer>`; `<DataState>` + estados. Composição declarativa. |
| **Provider Composition** | `AppProviders` em `core/providers/` compõe Query + Theme + Auth + Socket + i18n. Ordem é importante e documentada. |
| **Headless + Styled split** | Lógica em hooks (`useDisclosure`, `useToast`, `useStepper`). Estilo em `packages/ui`. Permite re-skin sem duplicar lógica. |
| **Schema-Driven Forms** | Zod schema de `@app/contracts` dirige validação client + tipos + server. Single source of truth. |
| **Render Props / Slots** | Usar com parcimônia em `<DataState>` (renderProp por estado) e composições complexas onde compound não basta. |
| **State Reducer Pattern** | Para componentes complexos (`<Stepper>` do onboarding), expor `stateReducer` prop para consumer customizar transições sem fork. |
| **Optimistic UI** | Mutations otimistas no TanStack Query (`onMutate` + rollback em erro). Padrão para mark-as-read, like, follow, etc. |
| **Suspense + Error Boundary** | Cada feature wrapped em `<Suspense fallback={<Skeleton />}>` + `<ErrorBoundary>` por nível. Falha local não derruba app. |
| **Selectors (Zustand)** | Stores expõem selectors memoizados (`useAuthUser = () => useAuthStore(s => s.user)`) — evita re-render desnecessário. |
| **Adapter (cross-platform)** | `SecretStorage` (SecureStore mobile, cookies web), `Analytics` (PostHog tem 2 SDKs distintos) atrás de interface única em `shared/lib/`. |
| **Skeleton-first loading** | Toda query exibe Skeleton durante `isLoading`, nunca spinner em tela cheia (exceto guard de auth). |

---

### 3.12 Manutenibilidade & Escalabilidade — princípios operacionais

#### 3.12.1 Manutenibilidade

| Princípio | Como o template garante |
|---|---|
| **Código auto-documentado** | Nomes longos e explícitos (`SignUpWithEmailAndPassword`, não `register`). Use cases nomeados como verbos no infinitivo + contexto. Comentários só para o "por quê" não-óbvio (constraints, workarounds). |
| **Boundary explícito** | `eslint-plugin-boundaries` quebra build em import inválido. Sem disciplina humana = sem regressão. |
| **Mudança localizada** | Trocar persistência de um módulo = mexer em 1 pasta (`infrastructure/persistence/`). Trocar UI de uma feature = mexer em `features/<f>/components/`. |
| **Onboarding rápido** | Estrutura previsível: novo dev abre `features/X/` e encontra `api/screens/store/types` juntos. Não precisa caçar 4 pastas. |
| **Refactor seguro** | Cobertura de tipos 100% (`tsc --noEmit`) + testes idiomáticos por categoria + boundaries protegem refactors em larga escala. |
| **Sem flags zumbis** | Toda feature flag tem owner + data de cleanup documentada em `feature-flags.md`. Skill `/schedule` lembra owner antes do prazo. |
| **Dependency drift controlado** | Renovate agrupa updates por ecosistema; PRs de bump são revisados, não auto-merged em produção. |
| **Complexidade ciclomática auditada** | ESLint `complexity` rule com limite 10 por função. Warnings forçam refactor ou justificativa. |
| **Tamanho de arquivo monitorado** | `max-lines` rule: 300 linhas hard limit, com `// @maintained-by: <reason>` para exceções justificadas. |
| **Ciclos de dependência zero** | `eslint-plugin-import` `no-cycle` ativo. Ciclo detectado = build vermelho. |
| **ADRs para decisões reversíveis-caras** | Toda decisão arquitetural não-trivial em `docs/adr/`. Futuro dev entende **por quê** antes de "consertar". |

#### 3.12.2 Escalabilidade

| Dimensão | Decisão de design |
|---|---|
| **Escalabilidade horizontal do backend** | Backend **stateless**: sessions em Mongo, cache em Redis, queue em Redis. Adicionar instância = zero config change. |
| **Pronto para extrair microservices** | Modular monolith: cada `module/` tem boundaries claros, comunica via events. Extrair = mover pasta + emitir evento sobre HTTP/queue em vez de in-process. Custo de extração é linear, não quadrático. |
| **Pronto para multi-tenancy (Tier 2)** | Estrutura de `OrganizationContext` injetado via guard. Schemas já incluem `organizationId` como slot reservado (nullable em Tier 1). |
| **Pronto para database split** | Cada módulo só conhece **seus próprios schemas**. Cross-module = via events, não cross-collection joins. Permite "database per service" se um módulo crescer. |
| **Idempotência em mutations** | Permite retries safe em rede instável. Toda mutation que cria recurso aceita `Idempotency-Key`. |
| **Cache invalidation declarativa** | TanStack Query invalidate por **tag** (`['notifications', userId]`). Eventos WS do backend invalidam queries no client automaticamente. |
| **Read replicas (preparado)** | `infrastructure/database/` aceita `readUrl` distinta de `writeUrl`. Repository chooses based on operation. |
| **Background jobs ready** | Worker process separado em `apps/worker/` (Tier 2), mesma codebase, consome mesmos use cases via queue. |
| **Observability built-in** | Logs estruturados (`pino`), correlação por `requestId` (Nest middleware), OpenTelemetry hooks no `infrastructure/observability/`. |
| **Graceful shutdown** | `onApplicationShutdown` em Nest: drena requests, fecha pools, desinscreve de sockets. Zero-downtime deploy possível. |
| **Stateless WebSocket scaling** | Socket.io com adapter Redis (Tier 1 prepara, Tier 2 ativa). Permite N instâncias de gateway. |
| **Schema migration disciplinado** | `migrations/` em backend com `up`/`down` versionados. Deploy executa migrations antes de promover nova instância. |

#### 3.12.3 Métricas concretas de "manutenível e escalável"

Um repo é Tier-1 manutenível se um dev novo, sem contexto, consegue:
1. **Rodar local em <5 min** (`easy doctor` + `yarn dev`).
2. **Adicionar uma rota REST + tela mobile + tela web nova em <2h** (com CLI: <30 min).
3. **Trocar email provider sem mexer em mais de 2 arquivos** (port + module wiring).
4. **Identificar onde acontece "envio de email de welcome" em <1 min** (busca por `WelcomeEmail` ou `UserSignedUp` listener).
5. **Adicionar OAuth provider sem editar módulo auth core** (só cria adapter + register).
6. **Rodar o subset de testes da feature que editou em <30s** (Turbo cache hit por package).

E é escalável se:
1. **Subir 10 instâncias do backend** atrás de load balancer sem mudança de código.
2. **Tolerar queda do Redis** com degradação controlada (rate limit cai para in-memory, queue para in-process; logs alertam).
3. **Tolerar lentidão de provider externo** sem derrubar app (circuit breaker abre, fallback gracioso).
4. **Processar 10k+ notificações por minuto** via worker + queue sem afetar latência HTTP.

---

## 4. Features Tier 1 — detalhamento por feature

> Cada feature segue o template: **Objetivo · Stack · Estrutura · Contracts · Endpoints · UI · Plug-out · Aceite**.

### 4.1 Autenticação completa

**Objetivo**: signup, login, logout, refresh token, password reset por email, verificação de email, MFA (TOTP), OAuth (Google, Apple, GitHub), revogação de sessão por device.

**Stack escolhida**: Better-Auth (cross-platform, SSR-friendly, suporte nativo a OAuth + MFA + magic link). Substitui Passport JWT atual. Justificativa registrada em [docs/adr/0002-auth.md](adr/0002-auth.md).

**Localização**:
- Backend: `apps/backend/src/modules/auth/`
- Mobile: `apps/mobile/src/core/auth/`
- Web: `apps/web/src/core/auth/`
- Contracts: `packages/contracts/src/auth/`

**Estrutura backend**:
```
modules/auth/
├── domain/
│   ├── entities/Session.ts
│   ├── value-objects/Email.ts, Password.ts
│   ├── events/UserSignedUp.ts, PasswordResetRequested.ts
│   └── repositories/SessionRepository.ts (interface)
├── application/
│   ├── use-cases/
│   │   ├── SignUp.ts
│   │   ├── SignIn.ts
│   │   ├── SignOut.ts
│   │   ├── RefreshSession.ts
│   │   ├── RequestPasswordReset.ts
│   │   ├── ResetPassword.ts
│   │   ├── VerifyEmail.ts
│   │   ├── EnableMfa.ts
│   │   ├── VerifyMfa.ts
│   │   ├── RevokeSession.ts
│   │   └── ListSessions.ts
│   └── ports/EmailVerificationSender.ts
├── infrastructure/
│   ├── persistence/SessionSchema.ts, SessionMongoRepository.ts
│   ├── http/AuthController.ts
│   └── oauth/{Google,Apple,GitHub}Provider.ts
└── auth.module.ts
```

**Contracts** (`packages/contracts/src/auth/`):
- `SignUpSchema`, `SignInSchema`, `RefreshSchema`, `RequestResetSchema`, `ResetPasswordSchema`, `VerifyEmailSchema`, `EnableMfaSchema`, `VerifyMfaSchema`.
- `SessionSchema`, `UserSchema`.
- `AuthErrorSchema` (discriminated union: `invalid_credentials`, `email_not_verified`, `mfa_required`, etc.).

**Endpoints REST** (`/v1/auth/*`):
- `POST /sign-up`, `POST /sign-in`, `POST /sign-out`, `POST /refresh`
- `POST /password/request-reset`, `POST /password/reset`
- `POST /email/verify`, `POST /email/resend`
- `POST /mfa/enable`, `POST /mfa/verify`, `POST /mfa/disable`
- `GET /oauth/:provider/start`, `GET /oauth/:provider/callback`
- `GET /sessions`, `DELETE /sessions/:id`

**UI mobile** (`core/auth/screens/`):
- `WelcomeScreen` (continue com email / Google / Apple)
- `SignUpScreen`, `SignInScreen`
- `VerifyEmailScreen`, `ResendVerificationScreen`
- `ForgotPasswordScreen`, `ResetPasswordScreen`
- `MfaSetupScreen` (QR + backup codes), `MfaVerifyScreen`
- `SessionsScreen` (devices ativos)

**UI web** (`apps/web/src/core/auth/`):
- Rotas `/sign-in`, `/sign-up`, `/verify-email`, `/reset-password`, `/account/sessions`.
- Páginas server-rendered onde faz sentido (SEO de landing pós-signup).

**Storage de token**:
- Mobile: `expo-secure-store`.
- Web: cookies httpOnly + SameSite=Lax.
- Adapter unificado em `shared/lib/storage.ts` (interface `SecretStorage`).

**Plug-out**: para tirar MFA: `--include-mfa=false` no bootstrap omite use cases, telas e rotas. Para tirar OAuth: `--oauth=` vazio remove providers e rotas correspondentes.

**Aceite**:
- [ ] Fluxo email/senha funciona em mobile e web.
- [ ] OAuth Google funciona em mobile e web (callbacks dev configurados).
- [ ] Reset de senha entrega email real (Resend) com link válido por 1h.
- [ ] MFA TOTP com app autenticador + 10 backup codes.
- [ ] Refresh token rotaciona sob `sliding-expiration` de 7 dias.
- [ ] Revogar sessão invalida token em <30s nos outros devices.
- [ ] Tentativas de login com brute-force triggam rate limit (ver §4.18).

### 4.2 RBAC / Permissions

**Objetivo**: roles (`admin`, `user`, `manager` por padrão, extensíveis), policy guard, hooks de client.

**Stack**: CASL 6.x (Node + React). Justificativa: expressivo, isomórfico (mesmas rules backend/client), suporta condições por recurso.

**Localização**:
- Backend: `apps/backend/src/modules/rbac/`
- Frontend (mobile + web): `core/rbac/`
- Contracts: `packages/contracts/src/rbac/` — `RoleSchema`, `PermissionSchema`, `AbilityRules`.

**Backend**:
- `RoleEntity`, `PermissionEntity`, `UserRolesRepository`.
- Use cases: `AssignRole`, `RevokeRole`, `ListRoles`, `CheckPermission`.
- `@RequirePermission('article:update')` decorator + guard.
- Default seed: 3 roles (`admin`, `user`, `manager`) com permissões pré-definidas.

**Client**:
- Hook `useCan(action, resource, instance?)` retornando boolean.
- Componente `<Can action="..." resource="...">` para condicional declarativa.
- Provider monta abilities a partir do `/auth/me` response.

**Aceite**:
- [ ] Backend bloqueia request sem permissão com 403 + `ApiError.forbidden`.
- [ ] Frontend esconde CTA quando `useCan` retorna false.
- [ ] Trocar role do user via admin reflete em <30s (refetch + websocket de invalidação).

### 4.3 Perfil + Conta

**Objetivo**: editar perfil, trocar senha (com senha atual), trocar email (com confirmação), upload de avatar, deletar conta (GDPR).

**Localização**:
- Backend: `apps/backend/src/modules/user/` (refatorar atual).
- Frontend: `features/account/`.
- Contracts: `packages/contracts/src/user/`.

**Use cases backend**:
- `UpdateProfile`, `ChangePassword`, `RequestEmailChange`, `ConfirmEmailChange`.
- `UploadAvatar` (delega para `storage/`, ver §4.8).
- `RequestAccountDeletion`, `ConfirmAccountDeletion` (grace period 7 dias).

**UI**:
- `AccountScreen` agrega: avatar+nome (edit inline), email, senha, sessões, idioma, tema, "deletar conta".
- Confirmação para mudanças sensíveis: re-prompt da senha atual.

**Aceite**:
- [ ] Upload de avatar com preview, resize (200x200) e blur placeholder.
- [ ] Mudança de email exige confirmação por link nos dois emails (atual + novo).
- [ ] Delete account agenda hard-delete em D+7, cancelável.

### 4.4 Onboarding

**Objetivo**: stepper genérico com persistência de progresso, skip controlado, retomar.

**Localização**: `features/onboarding/`.

**API do template**:
```ts
const { current, next, prev, skip, complete } = useOnboarding({
  steps: ['welcome', 'profile', 'preferences', 'invite'],
  persist: true, // salva em local + remoto
});
```

**Estrutura**:
- Hook `useOnboarding` gerencia state + sincroniza com backend (`user.onboardingState`).
- `OnboardingShell` (layout com progress bar, back, skip).
- Steps são componentes plug-in; ordem definida em `features/onboarding/config.ts`.

**Backend**:
- Campo `onboardingState` em `User`.
- Endpoint `PATCH /v1/user/onboarding` salva progresso parcial.

**Aceite**:
- [ ] Fechar app no meio do step 3 retoma no step 3.
- [ ] Skip de step opcional respeita marcação; step obrigatório não permite skip.
- [ ] Completion dispara evento `OnboardingCompleted` (audit).

### 4.5 Notificações in-app

**Objetivo**: toast (já existe [src/ui/components/Toast](../apps/mobile/src/ui/components/Toast)), central de notificações com badge, mark-as-read individual + bulk, paginação.

**Localização**: `features/notifications/`.

**Backend**:
- `NotificationEntity`: `id`, `userId`, `type`, `payload` (json), `readAt`, `createdAt`.
- Use cases: `CreateNotification`, `MarkAsRead`, `MarkAllAsRead`, `ListNotifications` (paginated).
- Emissão por evento de domínio: listener genérico em `notifications/application/listeners/` reage a `*.Created` etc.
- WebSocket event `notification.created` para push real-time no client.

**Client**:
- `useNotifications()` retorna paginated query.
- `useUnreadCount()` retorna count com refetch on socket event.
- `<NotificationBell />` no header com badge.
- `NotificationsScreen` com infinite scroll (FlashList no mobile).

**Aceite**:
- [ ] Notificação criada no backend aparece em <2s no client conectado.
- [ ] Mark-as-read otimista, com rollback em erro.
- [ ] Badge zera ao abrir tela; backend confirma em background.

### 4.6 Push notifications

**Objetivo**: registrar token, foreground/background handlers, deep-linking para tela específica.

**Stack**: Expo Notifications (mobile). Web Push (web) via service worker já configurado para PWA (ver §4.10 / Tier 1.5).

**Localização**:
- Backend: `apps/backend/src/infrastructure/notifications/push/` (adapter para Expo Push API).
- Frontend: `core/push/`.
- Contracts: `packages/contracts/src/notifications/push.ts` — `RegisterTokenSchema`, `PushPayloadSchema`.

**Backend**:
- `RegisterPushToken` use case (token + device info).
- `SendPush` port + Expo adapter.
- Hook automático: emitir push para qualquer notificação criada (configurável por tipo).

**Client**:
- `usePushRegistration()` chamado em `AppProviders` pós-login.
- Pede permissão lazy (com explicação UX), não no boot.
- Handler de deep-link: payload contém `screen` + `params`.

**Aceite**:
- [ ] Receber push em background abre app na tela correta.
- [ ] Notificação no foreground exibe banner custom (não popup OS).
- [ ] Logout limpa token registrado.

### 4.7 Emails transacionais

**Objetivo**: templates de welcome, verify email, reset password, security alerts. Preview no dev.

**Stack**: React Email para templates + Resend para envio. Adapter substituível (interface `EmailSender`).

**Localização**:
- Backend: `apps/backend/src/infrastructure/mailer/`.
- Templates: `packages/emails/` (novo package; pode renderizar em backend ou via Resend hosting).

**Templates iniciais**:
- `WelcomeEmail`
- `VerifyEmail`
- `ResetPasswordEmail`
- `EmailChangeConfirmation`
- `SecurityAlert` (login from new device)

**Dev experience**:
- `yarn email:dev` abre preview server local (porta 3002) com hot reload.
- Mailhog (Docker) captura emails em dev sem chamar Resend.

**Aceite**:
- [ ] Todos os 5 templates renderizam corretamente em Gmail, Outlook, Apple Mail.
- [ ] Dev sem `RESEND_API_KEY` cai em Mailhog automaticamente.
- [ ] Template tem versão texto-plano para spam score.

### 4.8 File upload

**Objetivo**: presigned URLs, progress UI, retry, image optimization (resize + blur placeholder).

**Stack**: S3-compatible (AWS S3 prod / MinIO dev) + Sharp para processamento server-side.

**Localização**:
- Backend: `apps/backend/src/infrastructure/storage/`.
- Frontend: `shared/lib/upload.ts` + `shared/hooks/useUpload.ts`.

**Backend**:
- `GeneratePresignedUrl` use case (valida MIME, tamanho, escopo).
- `ConfirmUpload` use case (chamado pelo client pós-upload com `objectKey`).
- Webhook S3 → `OnObjectUploaded` listener processa (resize, virus scan opcional).
- Variants: `original`, `thumb-200`, `medium-800`.

**Client**:
- `useUpload({ accept, maxSize })` retorna `{ upload, progress, error, result }`.
- Componente `<UploadButton />` e `<UploadDropzone />` (web).

**Aceite**:
- [ ] Upload de 10MB com progresso visível e retry em rede instável.
- [ ] Resize gera 3 variants + blur placeholder (base64) em ≤2s pós-upload.
- [ ] Tentar upload de tipo não permitido falha client-side antes do request.

### 4.9 Internacionalização (i18n)

**Objetivo**: `pt-BR` e `en` por padrão, helpers tipados, plural, format de data/moeda, troca runtime.

**Stack**: i18next + react-i18next + `intl-messageformat`. Chaves tipadas via codegen.

**Localização**:
- Locale files: `packages/i18n/locales/{pt-BR,en}/<namespace>.json`.
- Setup: `core/i18n/` em cada app.

**Convenção**:
- Namespaces por feature: `auth.json`, `notifications.json`, `common.json`.
- Chaves nested: `auth.signIn.title`, `auth.signIn.errors.invalidCredentials`.
- Codegen: `yarn i18n:types` gera `I18nKeys` type a partir dos JSONs.

**Helpers**:
- `useT('namespace')` retorna `t` tipado: `t('signIn.title')` → autocomplete.
- `formatCurrency(value, locale)`, `formatDate(date, locale, style)` em `packages/utils/`.

**Aceite**:
- [ ] Troca de idioma reflete em <500ms sem reload.
- [ ] Idioma persistido por device.
- [ ] Detecta idioma do device no primeiro launch.
- [ ] Chaves faltantes quebram build (modo strict).

### 4.10 Dark mode + theming

**Objetivo**: light/dark/system, persistência, sem flash no web.

**Localização**:
- Tokens: `packages/ui/src/tokens/`.
- Provider: `core/providers/ThemeProvider.tsx`.

**Implementação**:
- Tamagui themes (`light`, `dark`) registrados.
- Mobile: detect via `react-native` `useColorScheme`, override via storage.
- Web: cookie `theme=` lido em RSC para evitar FOUC, `<html data-theme>` setado server-side.

**Hooks**:
- `useTheme()` retorna `{ current, set, toggle }`.

**Aceite**:
- [ ] Web não pisca tema errado no SSR.
- [ ] System mode reage a mudança do OS em tempo real.
- [ ] Toggle disponível em `AccountScreen` (ver §4.3).

### 4.11 Settings (tela única)

**Objetivo**: consolidar idioma, tema, notificações, conta, privacidade.

**Localização**: `features/settings/` (compõe componentes de outras features).

**Seções**:
- Conta (atalho para §4.3)
- Notificações (preferences por tipo: email, push, in-app — granular por categoria)
- Aparência (tema, idioma)
- Privacidade (cookies opt-in web, analytics opt-out)
- Sobre (version, build, links legais)

**Backend**:
- `UserPreferences` entity vinculada ao user.
- `UpdatePreferences` use case.
- `GET /v1/user/preferences`, `PATCH /v1/user/preferences`.

**Aceite**:
- [ ] Mudança persiste imediatamente + sincroniza entre devices.
- [ ] Opt-out de email reflete na próxima emissão (mailer respeita).

### 4.12 Error boundary + páginas de erro

**Objetivo**: error boundary global, 404, 500, retry de chunk (web).

**Localização**: `core/error/` em cada frontend.

**Componentes**:
- `<RootErrorBoundary>` em `AppProviders`.
- `ErrorFallback` brandeado com CTA "tentar novamente" / "ir para início" / "reportar".
- `NotFoundScreen`, `ServerErrorScreen`.
- Reportagem automática ao Sentry (ver §4.X — Tier 1 inclui hook de Sentry ou stub).

**Aceite**:
- [ ] Throw em componente filho cai no boundary, não tela branca.
- [ ] 404 no web tem SEO correto (status 404, não 200).
- [ ] Chunk load error tenta reload uma vez antes de mostrar erro.

### 4.13 Estados padronizados (skeleton, empty, error, loading)

**Objetivo**: parar de cada feature reinventar empty state.

**Localização**: `packages/ui/src/states/`.

**Componentes**:
- `<DataState query={query}>` wrapper de TanStack Query — renderiza loading/error/empty/data automaticamente.
- `<Skeleton />` primitivo.
- `<EmptyState illustration title description action />`.
- `<ErrorState error retry />`.

**Convenção**:
- Toda tela que consome query usa `<DataState>` ou justifica não usar.

**Aceite**:
- [ ] Storybook tem story para cada estado de cada componente principal.
- [ ] `DataState` cobre 100% dos use cases sem props customization no caso comum.

### 4.14 Search global / Command palette

**Objetivo**: debounced search com recent searches; cmd+k command palette no web.

**Localização**: `features/search/`.

**Mobile**:
- `<SearchInput>` (já existe em `ui/`) + hook `useSearch(scope)`.
- Recent searches persistidos por scope.

**Web**:
- `<CommandPalette>` (cmd+k / ctrl+k) com fuzzy search global.
- Items registráveis: features expõem `searchProviders` opcional.

**Aceite**:
- [ ] Search debounced em 300ms.
- [ ] Recent searches por scope persistem 30 dias.
- [ ] Cmd+k abre em <100ms.

### 4.15 Forms (schema-driven)

**Objetivo**: padrão único de form — Formik + Zod schema vindo de `@app/contracts`.

**Localização**: `shared/components/Form/` em cada app.

**API**:
```tsx
<Form schema={SignUpSchema} onSubmit={signUp}>
  <Form.Field name="email" />
  <Form.Field name="password" />
  <Form.Submit>Sign up</Form.Submit>
</Form>
```

**Comportamento**:
- Validação client via Zod.
- Erros server-side mapeados para campos automaticamente (via `ApiError.fieldErrors`).
- Autosave opcional via prop.

**Aceite**:
- [ ] Toda form do template usa `<Form>` (auth, account, settings, etc.).
- [ ] Erro server de campo aparece inline, não em toast.
- [ ] Form mantém scroll position em erro de validação.

### 4.16 Health, version, telemetria mínima

**Objetivo**: endpoints de operação básica.

**Backend**:
- `GET /health` — liveness (sempre 200 se app rodando).
- `GET /health/ready` — readiness (checa Mongo, Redis se configurado).
- `GET /version` — retorna `{ version, gitSha, buildAt }`.

**Frontend**:
- `AboutScreen` exibe versão + build hash (de `expo-constants` ou `process.env.NEXT_PUBLIC_*`).

**CI**:
- Inject `GIT_SHA` e `BUILD_AT` no build.

**Aceite**:
- [ ] `/health/ready` retorna 503 se Mongo cair.
- [ ] About no client mostra mesma versão que `/version` do backend ao qual está apontado.

### 4.17 Auditoria

**Objetivo**: log de eventos sensíveis (login, password change, role change, account delete, OAuth link/unlink).

**Localização**: `apps/backend/src/modules/audit/`.

**Implementação**:
- `AuditLogEntity`: `id`, `actorId`, `action`, `targetType`, `targetId`, `metadata`, `ip`, `userAgent`, `createdAt`.
- `@Audited({ action: 'user.password.change' })` decorator em use cases (NestJS interceptor lê e persiste async).
- Coleção dedicada com TTL configurável.

**Endpoint**:
- `GET /v1/admin/audit-logs` (admin-only, paginated, filtros).

**Aceite**:
- [ ] Mudança de senha gera log com `actorId`, `ip`, `userAgent`.
- [ ] Logs imutáveis (sem PATCH/DELETE público).
- [ ] Persistência de log nunca quebra o use case (try/catch silencioso + erro logado).

### 4.18 Rate limiting

**Objetivo**: por IP e por user, configurável por rota.

**Stack**: `@nestjs/throttler` v6.

**Defaults**:
- Global: 60 req/min por IP.
- Auth endpoints: 10 req/min por IP (signin, signup, password reset).
- Mutações user: 30 req/min por user.

**Implementação**:
- `@Throttle({ default: { limit, ttl } })` decorator por rota.
- Storage: memory (dev) / Redis (prod) — automático via env.

**Aceite**:
- [ ] 11 tentativas de signin em 1 min retornam 429.
- [ ] Headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` corretos.
- [ ] Em prod, throttler usa Redis (compartilhado entre instances).

### 4.19 Segurança HTTP

**Objetivo**: helmet, CORS configurável por env, CSRF para web, secure cookies, content security policy.

**Backend**:
- `helmet()` aplicado em main.ts com CSP configurada.
- CORS com whitelist por env (`CORS_ORIGINS=https://app.com,https://admin.com`).
- CSRF middleware para rotas que aceitam cookies (web).
- Cookies: `httpOnly`, `secure` (prod), `sameSite=lax`, `__Host-` prefix.

**Aceite**:
- [ ] `securityheaders.com` score A+ no domain de produção.
- [ ] CORS bloqueia origin não-whitelisted com erro claro nos logs.
- [ ] CSRF token validado em mutations do web.

---

## 5. Developer Experience (DX) Tier 1

### 5.1 CLI `easy`

**Localização**: `tooling/cli/`.

**Comandos**:

| Comando | Resultado |
|---|---|
| `easy gen feature <name>` | Cria `features/<name>/` em mobile, web, backend (`modules/<name>/`) com scaffolds DDD-lite + Zod schema em contracts |
| `easy gen entity <Name>` | Entity + repository port + Mongoose schema + repo impl + factory para seeds |
| `easy gen use-case <Name>` | Use case + spec stub + entry no module |
| `easy gen contract <name>` | Zod schema em `packages/contracts/src/<name>/` |
| `easy gen email <Name>` | Template React Email em `packages/emails/` |
| `easy db:seed` | Roda seeds determinísticos |
| `easy db:reset` | Wipe + (migrate) + seed |
| `easy doctor` | Valida node, docker, ports, env (ver §5.5) |
| `easy bootstrap --name=...` | Renomeia template |

**Stack**: Node script com `commander` + `inquirer` (prompts interativos) + `plop` para templates (ou implementação custom com `mustache`).

### 5.2 Mocks e seeds determinísticos

**Localização**:
- Factories: `packages/contracts/src/<feature>/factory.ts`.
- Seeds: `apps/backend/src/seeds/`.

**Cenário "demo" semeado**:
- 10 users (1 admin, 2 manager, 7 user) com nomes plausíveis.
- 3 organizações (se multi-tenancy em Tier 2).
- 30 notificações distribuídas.
- 1 conversa de chat com 20 mensagens.
- 5 communication requests em estados variados.

**Comando**: `yarn db:seed` → backend rodando com dados.

**MSW** (mobile + web):
- `shared/lib/mocks/` com handlers MSW.
- Flag `EXPO_PUBLIC_USE_MOCKS=true` (mobile) / `NEXT_PUBLIC_USE_MOCKS=true` (web) ativa MSW — desenvolver UI sem backend.

### 5.3 Storybook

**Localização**: `apps/storybook/` (RN Web + Storybook 8).

**Conteúdo obrigatório**:
- Todos os componentes de `packages/ui/` com stories `Default`, `Loading`, `Error`, `Empty`, `Populated`.
- Stories de forms (`SignUpForm`, etc.) — mostra integration com Zod.
- Deploy automático Chromatic (ou Vercel) por PR.

### 5.4 Testes idiomáticos

**Backend**:
- Unit: `apps/backend/src/modules/auth/application/use-cases/SignUp.spec.ts` — usa fakes de repositories.
- Integration: `apps/backend/src/modules/auth/infrastructure/http/AuthController.spec.ts` — usa `mongodb-memory-server`.
- Tooling: `jest` + `@nestjs/testing`.

**Frontend**:
- Component: `apps/mobile/src/features/auth/components/SignUpForm.spec.tsx` — RTL + jest.
- Hook: `apps/mobile/src/shared/hooks/useDebounce.spec.ts`.

**E2E**:
- Web: `apps/web/e2e/sign-up.spec.ts` (Playwright).
- Mobile: `apps/mobile/e2e/sign-up.flow.yaml` (Maestro — mais simples que Detox em 2026).

**Não exigimos cobertura X%** no Tier 1; exigimos que cada categoria tenha **pelo menos 1 exemplo** que sirva de molde mental.

### 5.5 `easy doctor`

**Checks**:
- Node version (>=18.18) e package manager (yarn 4).
- Docker daemon rodando.
- Ports livres: 3001 (backend), 8081 (Expo), 3000 (web), 27017 (Mongo), 6379 (Redis), 9000 (MinIO), 1025/8025 (Mailhog).
- Env vars obrigatórias presentes em cada `.env`.
- Conexão Mongo + Redis ok.
- `git` configurado (user.name, user.email).

**Output**: tabela colorida ✅/❌ com sugestão de fix por item.

### 5.6 docker-compose

**Localização**: [docker-compose.yaml](../docker-compose.yaml) (mover da raiz do backend para a raiz do repo).

**Serviços**:
- `mongo` (já existe).
- `redis` (cache + queue + throttler em prod-like dev).
- `minio` (S3-compatible, console em :9001).
- `mailhog` (SMTP + UI em :8025).
- (opcional, profile `observability`) `otel-collector`, `tempo`, `grafana`.

**Profiles**:
- `minimal`: só mongo (path rápido).
- `full`: tudo acima.
- `observability`: full + telemetria.

Comando: `docker compose --profile full up -d`.

### 5.7 Hot reload de contracts

`packages/contracts` compilado em watch mode pelo turbo (`turbo run dev`) — mudanças no Zod schema propagam em <1s para todos os apps com TS server rodando.

---

## 6. CI/CD Tier 1

### 6.1 GitHub Actions

**Workflow `.github/workflows/ci.yml`**:

Jobs em paralelo:
- `lint`: `turbo run lint`
- `typecheck`: `turbo run check-types`
- `test`: `turbo run test`
- `build`: `turbo run build`

Matriz: `ubuntu-latest`, `macos-latest`, `windows-latest`.

Cache: `actions/cache` para Yarn + Turbo cache local.

Tempo alvo: <8 min total (com cache quente).

### 6.2 Branch protection

- `main` protegida: requer 1 review + todos os checks passando.
- Squash merge default.

### 6.3 Pre-commit hooks

`husky` + `lint-staged`:
- ESLint --fix nos staged.
- Prettier --write nos staged.
- `tsc --noEmit` no workspace afetado.

### 6.4 Dependabot/Renovate

`.github/renovate.json`:
- Group por ecosystem (`react`, `nestjs`, `expo`).
- Auto-merge para patch.
- Schedule semanal para minor/major.

### 6.5 Release process

- Changesets para versionamento.
- `yarn changeset` cria entry, `yarn release` consolida + tag.
- `CHANGELOG.md` autogerado.

---

## 7. Documentação Tier 1

### 7.1 README rebuild

Conteúdo obrigatório:
1. Hero com GIF/vídeo de 30s (clone → app rodando).
2. Badges: build, license, version, node, "Deploy on Vercel".
3. "Por que usar este template" — comparação com alternativas.
4. Quickstart (5 comandos).
5. Stack overview com links para docs internas.
6. "Quando NÃO usar este template" (honestidade gera confiança).
7. Roadmap público (link para issues/milestones).
8. Contribuir / Licença / Sponsors.

### 7.2 Site de docs

**Localização**: `apps/docs/` com Fumadocs (Next.js, MDX, search built-in).

**Estrutura**:
```
docs/
├── getting-started/
├── architecture/
│   ├── monorepo.md
│   ├── backend-ddd.md
│   ├── feature-first-frontend.md
│   └── contracts.md
├── features/
│   ├── auth.md
│   ├── rbac.md
│   ├── ... (1 doc por feature Tier 1)
├── cookbook/
│   ├── add-stripe.md
│   ├── replace-mongo-with-postgres.md
│   ├── add-feature-with-cli.md
│   └── deploy-to-vercel.md
├── reference/
│   ├── cli.md
│   ├── env-vars.md
│   └── api-reference.md (OpenAPI swagger embed)
└── adr/                       # decisões arquiteturais
```

### 7.3 ADRs obrigatórias para v1.0

- `0001-design-system.md` — Tamagui vs Restyle.
- `0002-auth.md` — Better-Auth vs Passport.
- `0003-database.md` — Mongo como default, flag para Postgres.
- `0004-validation.md` — Zod compartilhado vs class-validator.
- `0005-monorepo-boundaries.md` — regras de imports.
- `0006-i18n.md` — i18next + chaves tipadas.
- `0007-state-management.md` — Zustand slices por feature + TanStack Query.
- `0008-feature-first.md` — convenções de pasta + plug-out.

### 7.4 Diagramas

`docs/architecture/diagrams/` com Excalidraw exportados:
- Visão geral do monorepo.
- Fluxo de auth (request → guard → use case → repo).
- Fluxo de notificação real-time.
- Estrutura de uma feature de ponta a ponta.

---

## 8. Polish profissional Tier 1

### 8.1 Repositório bem cuidado

- [ ] `.github/ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `question.yml`.
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` com checklist.
- [ ] `CODE_OF_CONDUCT.md` (Contributor Covenant).
- [ ] `SECURITY.md` com canal de disclosure.
- [ ] `CONTRIBUTING.md` com setup, convenções de commit, processo de PR.
- [ ] `LICENSE` (MIT recomendado para template).
- [ ] `CHANGELOG.md` mantido por Changesets.

### 8.2 Branding placeholder do template

- Logo placeholder em `apps/web/public/logo.svg`, `apps/mobile/assets/icon.png`.
- Substituído por `easy bootstrap --brand=...` (substitui SVG, gera ícones via `expo-asset-utils`).
- Landing page placeholder em `apps/web/app/page.tsx`: hero + features + CTA.

### 8.3 Deploy buttons

README inclui:
- Botão "Deploy backend to Railway" → template configurado.
- Botão "Deploy web to Vercel" → template configurado.
- Documentação para EAS Build (mobile).

### 8.4 Demo público

- `demo.{{template-name}}.dev` rodando 24/7.
- Login `demo@demo.com / demo` reseta a cada hora (cron no backend).
- Banner "modo demo" no UI.

### 8.5 Anti-padrões a evitar (checklist negativo)

- [ ] Nenhuma feature do template "preenche tela" (dashboards genéricos, cards exemplo).
- [ ] Nenhuma dependência com <5k stars + único mantenedor.
- [ ] README não diverge do código (snippets incluídos via macro).
- [ ] CI não fica vermelho em `main` >24h sem fix.
- [ ] `easy doctor` cobre 100% das causas comuns de "não roda na minha máquina".

---

## 9. Critérios objetivos de "Tier 1 atingido"

| # | Métrica | Alvo Tier 1 |
|---|---|---|
| 1 | Tempo `git clone → yarn dev` rodando | < 5 min (com Docker instalado) |
| 2 | Tempo `easy gen feature → começa lógica` | < 10 min |
| 3 | Features Tier 1 implementadas | 19/19 |
| 4 | Features com teste idiomático | 19/19 (≥1 teste por feature) |
| 5 | Features com doc dedicada | 19/19 |
| 6 | Features com plug-out testado | 19/19 |
| 7 | CI verde em `main` | ≥30 dias consecutivos antes do v1.0 |
| 8 | Tempo total do CI | < 8 min com cache quente |
| 9 | Cobertura de tipos (`tsc --noEmit`) | 100% verde em todos workspaces |
| 10 | Lighthouse no demo web | ≥90 em todas as categorias |
| 11 | Storybook coverage | 100% dos componentes `packages/ui/` |
| 12 | ADRs publicadas | 8/8 listadas em §7.3 |
| 13 | Bootstrap renomeia tudo | 1 comando, 0 manual |
| 14 | Demo público uptime | ≥99% no mês anterior ao v1.0 |
| 15 | OpenAPI cobrindo endpoints | 100% das rotas REST |
| 16 | Cross-platform: tela login funciona | iOS, Android, Web |
| 17 | Erros de boundaries (lint) | 0 |
| 18 | Bundle size mobile | dentro do P50 de Expo apps comparáveis |
| 19 | `securityheaders.com` no demo web | A+ |
| 20 | Releases mensais | ≥3 meses antes do v1.0 estável |
| 21 | SOLID auditado por PR | Template de PR força checklist S/O/L/I/D; lint custom bloqueia top violations |
| 22 | Padrões de [§3.8](#38-padrões-arquiteturais-high-level)–[§3.11](#311-padrões-frontend-específicos) com uso de referência | 100% catalogados em [docs/patterns/](patterns/) com exemplo no código |
| 23 | Complexidade ciclomática média por arquivo | ≤ 8 (ESLint `complexity`) |
| 24 | Tamanho máximo de arquivo | 300 linhas (`max-lines`), exceções justificadas |
| 25 | Ciclos de dependência | 0 (`eslint-plugin-import/no-cycle`) |
| 26 | Contract tests em cada port | 100% das ports (`EmailSender`, `StorageAdapter`, `SessionRepository`, etc.) cobertas |
| 27 | Backend stateless (escalabilidade horizontal) | Subir N instâncias sem mudança de código (validado em load test) |
| 28 | Tolerância a falha externa | Circuit breaker + retry + backoff verificados em testes de chaos básicos |
| 29 | Idempotência | Mutations sensíveis aceitam `Idempotency-Key` (validado em testes integration) |
| 30 | Observabilidade | Logs estruturados + `requestId` correlation em 100% das requests |

---

## 10. Roadmap em fases ordenadas

Cada fase = 1 ou mais PRs mergeable, sem quebrar build, com docs atualizadas.

### Fase 0 — Decisões e ADRs (1 sprint)

- [ ] ADR-0001 a ADR-0008 escritas e aprovadas.
- [ ] Confirmar stack: Tamagui, Better-Auth, Resend, Sentry, PostHog.
- [ ] Definir versão alvo dos frameworks (Nest 11, Expo 54, Next 15).

### Fase 1 — Fundações de monorepo + lint disciplinador (2 sprints)

- [ ] Criar `packages/config-typescript` e `packages/config-eslint`.
- [ ] Migrar apps para estender configs compartilhadas.
- [ ] Criar `packages/utils`.
- [ ] Criar `packages/contracts` (vazio, com primeiro schema de demo).
- [ ] Setup `turbo` pipelines `dev`, `build`, `lint`, `check-types`, `test`.
- [ ] Setup `husky` + `lint-staged`.
- [ ] Setup GitHub Actions CI básico (lint + typecheck + test em paralelo).
- [ ] **Lint rules SOLID/manutenibilidade** ativas desde dia 1:
  - `complexity: ["error", 10]`
  - `max-lines: ["error", { max: 300, skipBlankLines: true, skipComments: true }]`
  - `max-params: ["error", 4]`
  - `import/no-cycle: error`
  - `eslint-plugin-boundaries` com regras de [§3.5](#35-boundaries-linter-enforced)
  - Custom rule: `application/` não pode importar de `infrastructure/` (DIP enforcement)
  - Custom rule: bloqueio de `switch` >3 cases sobre string em `application/` (OCP hint para Strategy)
- [ ] **PR template** [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) com checklist S/O/L/I/D + patterns aplicados + boundaries respeitados.
- [ ] `docs/patterns/` criado com 1 página por padrão de [§3.8](#38-padrões-arquiteturais-high-level)–[§3.11](#311-padrões-frontend-específicos) (esqueleto inicial, exemplos vêm nas fases seguintes).

### Fase 2 — Limpeza backend (1 sprint)

- [ ] Apagar `apps/backend/src/core/`.
- [ ] Apagar `apps/backend/src/modules/demo/`.
- [ ] Corrigir `apps/backend/src/app.module.ts:4` (import quebrado).
- [ ] Consolidar `helpers/` e `shared/helpers/` em `shared/utils/`.
- [ ] `ngrok.log` no `.gitignore`.

### Fase 3 — Padronização backend DDD-lite (3 sprints)

PRs incrementais, um módulo por PR:

- [ ] Refatorar `auth` para DDD-lite.
- [ ] Refatorar `user` para DDD-lite.
- [ ] Refatorar `chat` para DDD-lite.
- [ ] Refatorar `communication-request` para DDD-lite.
- [ ] Refatorar `message` para DDD-lite.
- [ ] Criar `shared/kernel/` com value objects (`Email`, `UserId`, `Money`).
- [ ] Criar `infrastructure/{auth,events,config,database}/` consolidados.

### Fase 4 — Limpeza mobile (2 sprints)

- [ ] Migrar `components/restyle` + `components/theme` para `packages/ui` (ainda Restyle inicialmente, troca para Tamagui na Fase 6).
- [ ] Mover `services/` → `features/<f>/api/`.
- [ ] Mover `stores/` → `features/<f>/store/`.
- [ ] Mover `hooks/` (split entre `features/<f>/hooks/` e `shared/hooks/`).
- [ ] Mover `contexts/` → `features/<f>/contexts/` ou `core/providers/`.
- [ ] Apagar `core/` duplicado em mobile.

### Fase 5 — Boundaries enforcement (1 sprint)

- [ ] Ativar `eslint-plugin-boundaries` com regras §3.5.
- [ ] Corrigir todas as violações.
- [ ] CI bloqueia violações futuras.

### Fase 6 — Design system (2 sprints)

- [ ] Migrar `packages/ui` para Tamagui v4.
- [ ] Implementar tokens em `packages/ui/src/tokens/`.
- [ ] Implementar primitivos e componentes core.
- [ ] Implementar `<DataState>`, `<EmptyState>`, `<ErrorState>`, `<Skeleton>`.
- [ ] Setup `apps/storybook` com stories de todos componentes.

### Fase 7 — App web (2 sprints)

- [ ] Criar `apps/web` com Next.js 15 (App Router).
- [ ] Portar `core/auth/` para web (provando a parity).
- [ ] Setup theming dark mode no web (sem flash via cookie).

### Fase 8 — Features de fundação cross-app (2 sprints)

- [ ] §4.16 Health + version (backend).
- [ ] §4.12 Error boundary + 404/500.
- [ ] §4.13 Estados padronizados.
- [ ] §4.15 Forms (`<Form>` schema-driven).
- [ ] §4.19 Segurança HTTP (helmet, CORS, CSRF).
- [ ] §4.18 Rate limiting com Throttler.

### Fase 9 — Auth completa (Better-Auth) (3 sprints)

- [ ] §4.1 Auth completa (substitui Passport, mantém WebSocket auth).
- [ ] §4.2 RBAC com CASL.
- [ ] §4.3 Perfil + conta.
- [ ] §4.4 Onboarding.
- [ ] §4.17 Auditoria (decorator + interceptor).

### Fase 10 — Notificações + comunicação (2 sprints)

- [ ] §4.5 Notificações in-app + WebSocket event.
- [ ] §4.6 Push notifications (Expo Push).
- [ ] §4.7 Emails transacionais (React Email + Resend + Mailhog dev).

### Fase 11 — Upload + Settings + i18n (2 sprints)

- [ ] §4.8 File upload (S3/MinIO + Sharp).
- [ ] §4.9 i18n (i18next + chaves tipadas).
- [ ] §4.10 Dark mode polido (sem FOUC web).
- [ ] §4.11 Settings (tela unificada).
- [ ] §4.14 Search + Command Palette web.

### Fase 12 — DX (2 sprints)

- [ ] §5.1 CLI `easy gen feature/entity/use-case/contract`.
- [ ] §5.2 Seeds + factories + MSW.
- [ ] §5.5 `easy doctor`.
- [ ] §5.6 docker-compose com profiles (mongo + redis + minio + mailhog).

### Fase 13 — Docs (2 sprints)

- [ ] §7.1 README rebuild com GIF.
- [ ] §7.2 `apps/docs` com Fumadocs + 19 docs de feature.
- [ ] §7.3 ADRs públicas em `docs/adr/`.
- [ ] §7.4 Diagramas Excalidraw.

### Fase 14 — Polish + release (1 sprint)

- [ ] §8.1 Templates de issue/PR + COC + SECURITY + CONTRIBUTING + LICENSE + CHANGELOG.
- [ ] §8.2 Branding placeholder + bootstrap finaliza substituição.
- [ ] §8.3 Deploy buttons no README.
- [ ] §8.4 Demo público no ar com auto-reset.
- [ ] v1.0.0 tag.

**Total estimado**: ~27 sprints (assumindo 1 sprint = 1 semana, ~6 meses) com 1-2 devs em paralelo. Compressível para ~4 meses com 3+ devs em frentes não-dependentes (DX + docs paralelo a features).

---

## 11. Checklist consolidado

### Fundações
- [ ] `packages/contracts` com Zod schemas
- [ ] `packages/ui` com Tamagui v4
- [ ] `packages/config-typescript`, `config-eslint`, `config-prettier`
- [ ] `packages/utils`
- [ ] `apps/web` (Next.js 15) criado
- [ ] Backend refatorado para DDD-lite (5 módulos)
- [ ] Mobile reestruturado feature-first
- [ ] Boundaries linter-enforced ativo
- [ ] Bootstrap script renomeia template

### SOLID & Design Patterns (§3.7–§3.12)
- [ ] **S** — toda `*Service` God class eliminada; use cases em arquivos separados (1 use case = 1 arquivo)
- [ ] **S** — lint custom: `max-lines: 300`, `complexity: 10` ativos
- [ ] **O** — `OAuthProviderRegistry` permite adicionar provider sem editar `AuthModule`
- [ ] **O** — `NotificationDispatcher` por canal (email/push/in-app) escolhido por registry, não switch
- [ ] **L** — contract tests em `EmailSender`, `StorageAdapter`, `SessionRepository`, `PushNotificationSender`, `CacheStore`
- [ ] **I** — nenhum hook frontend retorna objeto com >6 propriedades; ports backend com ≤5 métodos cada
- [ ] **D** — use cases dependem só de tokens `Symbol` exportados de `domain/` ou `application/ports/`
- [ ] **D** — lint custom: `application/` não pode importar de `infrastructure/`
- [ ] Hexagonal — domain + application testáveis sem framework (zero import de `@nestjs/*` em `domain/`)
- [ ] Modular Monolith — 5 bounded contexts com `*.module.ts` como única API pública
- [ ] DDD-lite — Entity, Value Object, Aggregate explícitos em todos os módulos
- [ ] Event-Driven — `UserSignedUp`, `EmailVerified`, `PasswordChanged`, etc. publicados via `EventEmitter`
- [ ] Repository Pattern — interfaces em `domain/repositories/`, impls em `infrastructure/persistence/`
- [ ] Strategy — OAuth providers + notification dispatchers como Strategy implementations
- [ ] Adapter — `StorageAdapter`, `EmailSender`, `SecretStorageAdapter`, `PushNotificationSender`
- [ ] Facade — `AuthFacade` no frontend agrega `signIn/signUp/oauth/forgot/...`
- [ ] Decorator — `@CurrentUser`, `@Audited`, `@Throttle`, `@RequirePermission` em uso
- [ ] Compound Components — `<Form>`, `<Modal>`, `<DataState>`, `<ListItem>`
- [ ] Observer — domain events + WebSocket events → TanStack Query invalidation
- [ ] Chain of Responsibility — pipeline Nest documentado (pipe → guard → interceptor → controller)
- [ ] Command — use cases como objetos auditáveis
- [ ] State Machine — `OnboardingState` modelada com transições explícitas
- [ ] ACL — adapters traduzem modelos de Resend/Stripe/Expo Push/OAuth para domínio
- [ ] Idempotency Key — `POST /signup`, `POST /v1/payments` etc. dedupe por TTL
- [ ] Retry + backoff — wrapper único `shared/http/external.ts` aplicado em 100% chamadas externas
- [ ] Circuit Breaker — providers críticos com `opossum` ou impl simples
- [ ] Outbox Pattern — eventos externos via coleção `outbox` + worker dedicado
- [ ] Webhook receiver padrão — `/v1/webhooks/:provider` valida signature + enfileira
- [ ] OpenAPI contract-first — schema gerado + cliente TS em `packages/api-client`
- [ ] Saga — account deletion modelada com compensação por step
- [ ] Optimistic UI — mark-as-read e similares com rollback
- [ ] Suspense + Error Boundary por feature
- [ ] Skeleton-first loading em 100% das queries

### Manutenibilidade & Escalabilidade (§3.12)
- [ ] Complexidade ciclomática média ≤ 8 por arquivo
- [ ] `max-lines: 300` (com `@maintained-by` para exceções)
- [ ] `no-cycle` ativo (0 ciclos de dependência)
- [ ] Renovate configurado (agrupado por ecosystem)
- [ ] 8 ADRs principais publicadas em `docs/adr/`
- [ ] `feature-flags.md` com owner + cleanup date por flag
- [ ] Backend stateless validado em load test (≥3 instâncias)
- [ ] `OrganizationContext` + `organizationId` reservado nos schemas (Tier 2 plug-in)
- [ ] Cache invalidation por tag em TanStack Query
- [ ] `infrastructure/database/` suporta `readUrl` ≠ `writeUrl`
- [ ] Pino logging estruturado + `requestId` correlation
- [ ] OpenTelemetry hooks no `infrastructure/observability/`
- [ ] Graceful shutdown (`onApplicationShutdown` drena/limpa)
- [ ] Migrations versionadas com `up`/`down`
- [ ] PR template inclui checklist SOLID + patterns + boundaries

### Features Tier 1
- [ ] §4.1 Auth completa (Better-Auth, OAuth, MFA, sessions)
- [ ] §4.2 RBAC (CASL)
- [ ] §4.3 Perfil + Conta (avatar, email change, account delete)
- [ ] §4.4 Onboarding
- [ ] §4.5 Notificações in-app
- [ ] §4.6 Push notifications
- [ ] §4.7 Emails transacionais (React Email + Resend)
- [ ] §4.8 File upload (S3/MinIO + Sharp)
- [ ] §4.9 i18n (pt-BR + en, chaves tipadas)
- [ ] §4.10 Dark mode polido
- [ ] §4.11 Settings (tela unificada)
- [ ] §4.12 Error boundary + 404/500
- [ ] §4.13 Estados padronizados
- [ ] §4.14 Search + Command Palette
- [ ] §4.15 Forms schema-driven
- [ ] §4.16 Health + version
- [ ] §4.17 Auditoria
- [ ] §4.18 Rate limiting
- [ ] §4.19 Segurança HTTP

### DX
- [ ] CLI `easy` (gen feature/entity/use-case/contract)
- [ ] Seeds + factories + MSW
- [ ] Storybook com 100% de componentes de `packages/ui`
- [ ] Testes idiomáticos (unit, integration, component, E2E web + mobile)
- [ ] `easy doctor`
- [ ] docker-compose com profiles

### CI/CD
- [ ] CI lint + typecheck + test + build em matrix (ubuntu, macos, windows)
- [ ] Branch protection em `main`
- [ ] Pre-commit hooks (husky + lint-staged)
- [ ] Renovate configurado
- [ ] Changesets para release

### Docs
- [ ] README rebuild com GIF
- [ ] `apps/docs` com Fumadocs
- [ ] 19 docs de feature
- [ ] 8 ADRs publicadas
- [ ] Diagramas Excalidraw
- [ ] Cookbook (≥3 entries)

### Polish
- [ ] Issue templates + PR template
- [ ] COC + SECURITY + CONTRIBUTING + LICENSE + CHANGELOG
- [ ] Deploy buttons (Vercel + Railway)
- [ ] Demo público com auto-reset
- [ ] Branding placeholder + script de substituição

### Critérios objetivos
- [ ] Tempo clone → rodando < 5 min
- [ ] CLI gera feature em < 10 min até começar lógica
- [ ] CI verde em `main` ≥30 dias
- [ ] Lighthouse web ≥90 em todas categorias
- [ ] securityheaders.com A+ no demo
- [ ] OpenAPI cobre 100% das rotas
- [ ] Boundaries lint: 0 violações
- [ ] Cross-platform: login funciona iOS + Android + Web
- [ ] SOLID auditado por PR (template + lint custom)
- [ ] Padrões §3.8–§3.11 com uso de referência catalogado em `docs/patterns/`
- [ ] Contract tests em 100% das ports
- [ ] Backend stateless validado (3+ instâncias em load test)
- [ ] Idempotência validada em testes integration
- [ ] Logs estruturados + requestId em 100% das requests

---

**Quando todos os checkboxes acima estiverem marcados, o template está no Tier 1.** Daí abrimos o backlog do Tier 2 (Billing, Background jobs, Sentry, Multi-tenancy, Analytics, Admin panel, Webhooks emitter, API versionada, GDPR tooling, PWA).
