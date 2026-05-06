# Doctore AI — Architecture

> Canonical architecture reference for system structure, boundaries, data flow, and delivery constraints.
> This document must stay consistent with `instructions.md`.

---

## 1. Purpose

This document defines:
- system boundaries
- runtime architecture
- data access rules
- project structure
- domain model separation
- deployment topology
- production constraints for Phase 1

It does **not** define naming, formatting, import order, or TypeScript style rules.
Those belong in `docs/conventions.md`.

---

## 2. Product architecture summary

Doctore AI is a model-driven MLB betting analytics SaaS with:

- **Next.js 14 App Router frontend**
- **Firebase Auth** for browser authentication
- **Firebase Admin** for server-side authorization and protected data access
- **Firestore** as the primary application database
- **FastAPI ML sidecar** for probability / edge inference
- **TanStack Query** for client-side server-state synchronization
- **Zustand** for lightweight UI/global state
- **Vercel + Cloud Run** as the deployment topology

### Core product flow

1. model-derived signals are stored in Firestore
2. authenticated users view filtered signals
3. users open a signal detail view
4. users log a bet against a signal
5. the app surfaces historical performance, calibration, and configuration

---

## 3. Architecture principles

1. **Server Components are the default**
2. **Firestore access is server-only**
3. **Client hooks call typed HTTP endpoints, never Firestore directly**
4. **All external and persisted data is validated with Zod**
5. **Persistence models, API DTOs, and UI models are separate when shapes differ**
6. **Business logic lives in repositories, services, hooks, or pure utilities — not page shells**
7. **Phase 1 scope is intentionally narrow; out-of-scope features must not leak into the implementation**

---

## 4. Runtime topology

### Frontend
- Next.js 14 App Router
- Server Components for initial rendering
- Client Components only where interactivity is required
- Tailwind + tokenized design system
- TanStack Query for browser cache/state sync

### Backend application layer
- Next.js Route Handlers
- Zod-validated request/response contracts
- Firebase Admin for secure access to protected data
- repository + service layering for domain logic

### Database
- Firestore
- user-scoped documents and collections
- rules-enforced access
- schema-sensitive indexes tracked in version control

### ML inference layer
- FastAPI on Cloud Run
- `/predict` for probability/edge/Kelly output
- `/health` for version and status checks
- server-to-server access only

### Observability
- Sentry for client and server runtime errors
- analytics events for key betting/product actions
- audit metadata on protected writes

---

## 5. Deployment topology

| Layer | Platform | Responsibility |
|---|---|---|
| Frontend app | Vercel | Next.js rendering, Route Handlers |
| ML sidecar | Cloud Run | model inference and health checks |
| Database/Auth | Firebase | Firestore, Auth, rules |
| Error tracking | Sentry | runtime monitoring |

### Deployment rules
- Vercel deploys are immutable
- rollback must be possible without code edits
- ML version rollout must support staged traffic shifting
- production credentials remain server-only

---

## 6. Data access architecture

## 6.1 Read path

### Server-rendered path
1. `page.tsx` or a server-side feature boundary calls a server repository/service
2. repository reads Firestore via Firebase Admin
3. data is validated/mapped into DTO or view-safe shape
4. server returns rendered UI or serialized props

### Client-interactive path
1. client component uses a hook from `hooks/`
2. hook calls typed `app/api/*` endpoint
3. route handler validates input/output with Zod
4. repository/service reads server-side data
5. hook returns query/mutation state to UI

---

## 6.2 Write path

1. client action triggers a hook mutation
2. hook sends typed payload to `app/api/*`
3. route handler validates payload with Zod
4. service enforces auth/business rules
5. repository writes to Firestore
6. mutation invalidates or updates query cache explicitly
7. audit metadata and logging run where applicable

---

## 6.3 Hard boundaries

### Allowed
- browser auth SDK usage for sign-in/sign-out/session bootstrap
- Route Handlers calling repositories/services
- repositories calling Firestore server SDK
- hooks calling typed HTTP endpoints

### Forbidden
- Firestore client SDK usage inside React components
- Firestore client SDK usage inside hooks
- business logic inside `page.tsx` shell components
- UI components importing repositories/services directly
- unvalidated request bodies reaching persistence layer

---

## 7. Authentication and authorization model

## 7.1 Authentication
- browser authentication uses **Firebase Auth**
- session bootstrap is initiated from the client
- protected server access is verified via **Firebase Admin**

## 7.2 Authorization
- all protected data access is checked on the server
- user-specific data must be scoped by authenticated `uid`
- Firestore rules are mandatory before shipping private features

## 7.3 Session routes
Recommended API surface:

```txt id="sxfc99"
app/api/auth/session/route.ts
```

---

## 8. Layer Responsibilities

| Layer                 | Responsibility                                          | Must not do                      |
| --------------------- | ------------------------------------------------------- | -------------------------------- |
| `app/**/page.tsx`     | server composition, initial data loading                | hold domain/business logic       |
| `components/shared`   | reusable presentational UI                              | fetch data or touch persistence  |
| `components/features` | feature composition and local UX logic                  | call Firestore directly          |
| `hooks/`              | client-side query/mutation orchestration                | return JSX or call Firestore SDK |
| `app/api/*`           | validate requests, enforce auth, expose typed contracts | hold rendering concerns          |
| `repositories/`       | database access and document mapping                    | contain UI logic                 |
| `services/`           | orchestration, ML calls, auth/session logic             | render UI                        |
| `types/`              | stable cross-layer shapes                               | embed framework behavior         |
| `schemas/`            | runtime validation                                      | replace domain orchestration     |
