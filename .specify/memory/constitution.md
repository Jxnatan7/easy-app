# Easy App Template Constitution

> This constitution is **operational law** for every spec, plan, task, and PR in this repository. The detailed roadmap, feature catalog, and rationale live in [`docs/TIER-1-ROADMAP.md`](../../docs/TIER-1-ROADMAP.md). When in doubt, this constitution wins; the roadmap explains.

## Core Principles

### I. Feature-First & Plug-Out Trivial (NON-NEGOTIABLE)

Every pre-built feature is **removable by deleting one folder and one import**. If removing a feature requires editing unrelated code, the feature was coupled incorrectly and must be refactored before merge.

- Backend: 1 feature = 1 module under `apps/backend/src/modules/<name>/` with DDD-lite (`domain/`, `application/`, `infrastructure/`).
- Frontend: 1 feature = 1 folder under `apps/<mobile|web>/src/features/<name>/` with `api/`, `components/`, `hooks/`, `screens/`, `store/`, `types/`, `index.ts`.
- Cross-feature communication: **only** via events (backend) or global store/contracts (frontend). Direct imports between sibling features are blocked by the boundaries linter and fail CI.
- The `index.ts` of each feature is the public API. Deep imports (`features/x/components/Y`) are forbidden.

### II. SOLID by Default (NON-NEGOTIABLE)

The five SOLID principles are **PR gates**, not advice. Every PR description answers `S / O / L / I / D — where applied, where violated and why`.

- **S (SRP)**: 1 use case = 1 file. Controllers are thin HTTP adapters. Components are visually-single-purpose; logic lives in hooks. Enforced by lint: `max-lines: 300`, `complexity: 10`.
- **O (OCP)**: extension via Strategy + Registry. Adding an OAuth provider, storage adapter, or notification channel **must not** edit existing module code. Switch statements over a growing `type` string are a code smell.
- **L (LSP)**: every port has **contract tests**. Substituting `MongoRepository` for `InMemoryRepository` in any use case must not change observable behavior.
- **I (ISP)**: ports ≤ 5 methods. Hooks return objects with ≤ 6 keys. No "God" services or interfaces.
- **D (DIP)**: use cases depend on `Symbol`-typed ports exported from `domain/repositories/` or `application/ports/`. Code in `application/` may **not** import from `infrastructure/`. Enforced by a custom ESLint rule.

Justified violations require an ADR in [`docs/adr/`](../../docs/adr/) and explicit reviewer sign-off. Unjustified violations block merge.

### III. Single Source of Truth — Contracts

All cross-boundary types live in `packages/contracts` as **Zod schemas**. Schemas are the source; TypeScript types are derived (`z.infer<...>`).

- Backend validates inputs via a `ZodValidationPipe` reading from `@app/contracts`.
- Mobile and web consume the same schemas for form validation (`zodResolver`) and TanStack Query type inference.
- Changing a contract triggers a typecheck failure in **every** workspace that consumes it. CI must stay green across all workspaces before merge.
- Contracts include `factory.ts` per schema to produce deterministic test/seed data.

### IV. Pattern-Catalog Driven Design

Every architectural decision references the pattern catalog in [`docs/TIER-1-ROADMAP.md`](../../docs/TIER-1-ROADMAP.md) §§3.8–3.11. Cargo-culted or unnamed patterns are anti-patterns.

- **Architectural** (§3.8): Hexagonal Ports & Adapters, Clean Architecture (layered), Modular Monolith, DDD-lite, Event-Driven, Repository, API Versioning.
- **Structural** (§3.9.1): Adapter, Facade, Decorator, Composite, Bridge.
- **Creational** (§3.9.2): Factory Method, Builder, Abstract Factory, IoC/DI, disciplined Singleton (provider-injected, never imported as global).
- **Behavioral** (§3.9.3): Strategy, Observer, Chain of Responsibility, Command, Mediator, State Machine.
- **Integration** (§3.10): Anti-Corruption Layer, Idempotency Key, Retry + backoff, Circuit Breaker, Outbox, Inbox, Webhook receiver, Saga, OpenAPI contract-first.
- **Frontend** (§3.11): Container/Presenter, Custom Hook = Use Case, Compound Components, Provider Composition, Headless + Styled split, Schema-Driven Forms, Optimistic UI, Suspense + Error Boundary, Selectors.

Each pattern has at least one reference implementation in the codebase, catalogued under `docs/patterns/`.

### V. Maintainability & Scalability Built-In

Code is read 10× more than written, and load grows non-linearly. Both are first-class concerns of every PR.

**Maintainability gates** (enforced):
- `complexity: ["error", 10]` per function (ESLint).
- `max-lines: ["error", { max: 300 }]` per file. Exceptions require `// @maintained-by: <reason>` comment.
- `import/no-cycle: error` — zero dependency cycles between modules.
- 100% TypeScript coverage (`tsc --noEmit` green across all workspaces).
- Boundaries linter (`eslint-plugin-boundaries`) blocks cross-feature imports and inward-layer violations.

**Scalability requirements**:
- Backend instances are **stateless**: sessions in Mongo, cache + queue + rate limit in Redis. Horizontal scaling must not require code changes.
- Mutations that create resources accept `Idempotency-Key` header with TTL-based dedupe.
- Cache invalidation is declarative (TanStack Query tags + WebSocket-driven invalidation events).
- Schemas reserve `organizationId` slots (nullable in Tier 1, activated in multi-tenancy Tier 2) so vertical features can become tenant-scoped without migration.
- Cross-module communication is event-driven, not cross-collection joins — leaving database-per-service as an open future.
- Logs are structured (`pino`) with `requestId` correlation across HTTP/WS/queue. OpenTelemetry hooks present in `infrastructure/observability/`.

## Technology Stack & Architecture Constraints

The following choices are locked at the constitution level. Replacing any of them requires a constitutional amendment (semver MAJOR bump) preceded by an ADR.

**Locked stack**:
- Monorepo: Turborepo + Yarn 4 workspaces.
- Backend: NestJS 11 + Mongoose 8 (Mongo default; Postgres available behind `--db=postgres` bootstrap flag).
- Mobile: Expo 54 + React Native 0.84 + Expo Router (file-based).
- Web: Next.js 15 (App Router, RSC where appropriate).
- Shared contracts: Zod 3.x in `packages/contracts`.
- Design system: Tamagui v4 in `packages/ui` (cross-platform RN + Web).
- Data fetching: TanStack Query v5 (server state) + Zustand 5 (UI state, slice per feature).
- Forms: Formik + `zodResolver`.
- Auth: Better-Auth (replacing legacy Passport JWT).
- RBAC: CASL 6.x with isomorphic rules.
- Mailer: React Email templates + Resend (prod) / Mailhog (dev).
- File storage: S3-compatible (AWS S3 prod, MinIO dev) + Sharp for image processing.
- Realtime: Socket.io with Redis adapter (single-instance OK in Tier 1; Redis adapter present for horizontal scaling).
- Background jobs (Tier 2-ready): BullMQ on Redis.

**Architectural constraints**:
- Backend modules follow DDD-lite: `domain/` → `application/` → `infrastructure/` (dependencies always inward).
- Frontend apps follow feature-first vertical slicing with `eslint-plugin-boundaries` enforcement.
- All REST routes prefixed `/v1/`. API contracts generated to OpenAPI; TS client emitted to `packages/api-client` in CI.
- Domain events use the in-process `EventEmitter` (Nest). Integration events going across system boundaries use the **Outbox pattern**.
- Every external integration sits behind an **Anti-Corruption Layer** adapter. External models never reach `application/` or `domain/`.

## Quality Gates & PR Review Process

Every PR must pass these gates **before merge**:

1. **CI green across all workspaces**: `turbo run lint check-types test build` succeeds.
2. **Boundaries lint**: 0 violations.
3. **SOLID checklist in PR body**: explicit `S / O / L / I / D` answers. Reviewer verifies.
4. **Pattern declaration**: PR body lists which catalog patterns were used (or why none).
5. **Tests**: at least one idiomatic test for the category being changed (unit / integration / component / E2E) per [`docs/TIER-1-ROADMAP.md`](../../docs/TIER-1-ROADMAP.md) §5.4. PRs adding a feature must include a `factory.ts` for the new contracts.
6. **Plug-out test (feature PRs)**: explicit list of "files to delete to remove this feature". Reviewer mentally walks the list.
7. **Constitution compliance**: no principle violated without ADR + reviewer sign-off.
8. **Conventional Commits**: title follows `type(scope): subject`.

Spec-driven workflow: every non-trivial change starts with `/speckit-specify`, then `/speckit-plan`, `/speckit-tasks`, and finally `/speckit-implement`. Specs and plans live under `specs/NNN-name/`. Branch name matches the spec slug.

ADRs (`docs/adr/NNNN-title.md`) are required for: stack changes, deviations from this constitution, patterns chosen over plausible alternatives, and any decision whose reversal costs more than one sprint.

## Governance

This constitution supersedes ad-hoc team preferences and inherited habits. It does **not** supersede legal, security, or compliance requirements, which always take precedence and should be encoded as additional gates when applicable.

- **Amendments**: PR to `.specify/memory/constitution.md` with rationale, dependency-template sync (specs, plans, task templates), and at least one approving reviewer. Bump version per semver: MAJOR for principle removal/redefinition, MINOR for new principle or materially expanded guidance, PATCH for clarification.
- **Compliance verification**: every PR review confirms the PR body addresses SOLID and patterns. CI enforces boundaries, complexity, file size, and cycle limits.
- **Drift alarm**: if more than 2 PRs in a 30-day window add `@maintained-by` exception comments or skip the SOLID checklist, open a "constitution drift" issue and review whether the constitution needs an amendment or the team needs realignment.
- **Source of operational detail**: [`docs/TIER-1-ROADMAP.md`](../../docs/TIER-1-ROADMAP.md) is the working document for what to build and in what order. This constitution is the *how* and *what's non-negotiable*; the roadmap is the *what next*.

**Version**: 1.0.0 | **Ratified**: 2026-06-14 | **Last Amended**: 2026-06-14
