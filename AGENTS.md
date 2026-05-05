# Project Naming Conventions & Template Rules

## Naming Conventions
| Target              | Format                       | Example                              |
| ------------------- | ---------------------------- | ------------------------------------ |
| React component     | `PascalCase.tsx`             | `SignalCard.tsx`                     |
| Page                | `page.tsx`                   | `app/(app)/signals/page.tsx`         |
| Layout              | `layout.tsx`                 | `app/(app)/layout.tsx`               |
| Hook                | `use` + PascalCase           | `useSignals.ts`                      |
| Zustand store       | `use` + Name + `Store`       | `useAuthStore.ts`                    |
| Utility / helper    | `camelCase` or verb+noun     | `formatEdge.ts`, `calculateKelly.ts` |
| Interface           | `PascalCase`, no `I` prefix  | `SignalView`, `ApiResponse`          |
| Type alias          | `PascalCase`                 | `SignalStatus`, `Theme`              |
| Module constant     | `SCREAMING_SNAKE_CASE`       | `MIN_EDGE_THRESHOLD`                 |
| CSS custom property | `--dt-[tier]-[name]`         | `--dt-color-accent-default`          |
| Env variable        | public/private prefix rules  | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`    |
| Git branch          | `feature/`, `fix/`, `chore/` | `feature/signal-detail`              |
| Test file           | `[name].test.ts(x)`          | `SignalCard.test.tsx`                |

## Template Rules
- **Props interface**: Define `className?: string` on shared reusable UI components.
- **Event handlers**: Use optional chaining on optional event handlers (e.g. `onClick?.()`).
- **Exports**: Use named exports everywhere except for framework-required default exports (like `App.tsx` or Next.js route components).
- **Interface scope**: Props interface stays in the same file unless shared across multiple modules.
## TypeScript Patterns
| Do                                        | Don’t                                     |
| ----------------------------------------- | ----------------------------------------- |
| `type Status = 'A' \| 'B'`                | `enum Status { A, B }`                    |
| `z.infer<typeof schema>`                  | hand-written duplicate API types          |
| `satisfies` for config objects            | loose object literals with implicit shape |
| check nullable/optional values explicitly | assume `array[0]` exists                  |
| document the reason for unsafe casts      | silent `as any`                           |
| map docs → DTOs → UI models intentionally | pass Firestore-specific values into UI    |

## System & Security Policies

### Audit trail
- All bet writes must include `userId`, `signalId`, `loggedAt`, and `ipHash`.
- Firestore rules must enforce owner-only writes for user bet data.

### Retry / timeout policy
- **ML API**: 3 retries, exponential backoff, 5s timeout per attempt.
- **Firestore reads**: 2 retries, bounded timeout handling at the server layer.
- After final retry, show user-facing error with retry action.

### Feature flags
- Store per-user flags in `featureFlags/{uid}`.
- Gate all Phase 2 releases behind flags before general rollout.
- Phase 2A rollout: internal staff only.
- Beta users behind `liveOddsEnabled` flag.
- Notification beta behind `notificationsEnabled` flag.
- Production rollout proceeds only after stability metrics are acceptable.
- Phase 2B rollout: add second sport behind `multiSportEnabled` flag. Validate adapters, metrics, and filters. Expand only after operational confidence exists.
- Phase 2C rollout: private leaderboard. Tracked-bets only eligibility. Optional public profile. No open social graph until abuse controls exist.

### Rollback
- Vercel deploys are immutable; rollback to a previous deployment.
- ML versions are rolled out gradually via Cloud Run traffic split.

### Security rules — minimum bar
- Firestore rules are mandatory before shipping protected features.
- Only authenticated users can access private user data.
- User-scoped writes must verify ownership on the server.
- API keys live only in server env.
- Never expose ML API credentials to the browser.
- Route handlers validate auth before repository access.
- Rate-limit sensitive write endpoints where abuse is plausible.

## Definition of Done — Engineering

A task is not done unless all of the following are true:

- Scope matches Phase 1 requirements
- Types, schemas, and API contracts are aligned
- Loading, error, and empty states exist
- Query invalidation/update behavior is defined
- Tests exist at the correct level
- Observability hooks/logging are included where relevant
- Firestore rules/indexes were updated if schema changed
- Lint, typecheck, unit tests, and e2e-critical checks pass

## Sprint 1
- Odds provider abstraction
- Normalized market schema
- `oddsSnapshots`, `events`, `markets`

## Sprint 2
- Cron ingestion pipeline
- Signal refresh / invalidation logic
- Freshness indicators in UI

## Sprint 3
- Notification preferences
- Notification queue + in-app delivery
- Email/push adapters

## Sprint 4
- Sport abstraction
- Second-sport enablement
- Sport switcher + filters

## Sprint 5
- Leaderboard aggregation
- Tracked-bet eligibility rules
- Gated public profile surfaces