# Doctore AI — Conventions

> Canonical development conventions for naming, imports, component patterns, TypeScript, comments, and implementation discipline.
> This document must stay consistent with `instructions.md` and `docs/architecture.md`.

---

## 1. Purpose

This document defines:
- naming rules
- file conventions
- component patterns
- import order
- TypeScript conventions
- comment standards
- query/mutation conventions
- implementation do/don’t rules

It does **not** define runtime architecture or infrastructure boundaries.
Those belong in `docs/architecture.md`.

---

## 2. Naming

| Target | Format | Example |
|---|---|---|
| React component | `PascalCase.tsx` | `SignalCard.tsx` |
| Page | `page.tsx` | `app/(app)/signals/page.tsx` |
| Layout | `layout.tsx` | `app/(app)/layout.tsx` |
| Hook | `use` + PascalCase | `useSignals.ts` |
| Zustand store | `use` + Name + `Store` | `useAuthStore.ts` |
| Utility/helper | `camelCase` or verb+noun | `formatEdge.ts`, `calculateKelly.ts` |
| Interface | `PascalCase`, no `I` prefix | `SignalView`, `ApiResponse` |
| Type alias | `PascalCase` | `SignalStatus`, `Theme` |
| Module constant | `SCREAMING_SNAKE_CASE` | `DEFAULT_KELLY_FRACTION` |
| CSS custom property | `--dt-[tier]-[name]` | `--dt-color-accent-default` |
| Env variable | `NEXT_PUBLIC_*` or private uppercase | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| Git branch | `feature/`, `fix/`, `chore/` | `feature/signal-detail` |
| Test file | `[name].test.ts(x)` | `SignalCard.test.tsx` |

### Naming rules
- names must describe intent, not implementation accident
- abbreviations are avoided unless universally obvious
- pluralize collection-like values consistently (`signals`, `metrics`, `featureFlags`)
- avoid generic filenames such as `helpers.ts`, `misc.ts`, `temp.ts`

---

## 3. File and export rules

1. **Named exports only**
2. Exceptions are framework-required defaults:
   - `page.tsx`
   - `layout.tsx`
   - `loading.tsx`
   - `error.tsx`
   - `not-found.tsx`
3. **One responsibility per file**
4. If a component grows beyond ~200 lines, split it
5. Keep component-local types in the same file unless shared across modules
6. Do not create redundant `.types.ts` files for a single private component
7. Do not place business rules in files intended only for rendering

---

## 4. Component types and responsibilities

| Type | Location | Can | Cannot |
|---|---|---|---|
| UI atom | `components/shared/` | render, accept props, emit events | fetch data, call persistence layer |
| Feature component | `components/features/` | compose atoms, use hooks, manage local UI state | call Firestore directly |
| Page | `app/**/page.tsx` | compose features, load initial data, define metadata | hold business logic |
| Layout | `app/**/layout.tsx` | shell, providers, navigation | hold domain logic |
| Hook | `hooks/` | queries, mutations, state transitions | return JSX |
| Repository | `lib/server/repositories/` | persistence access and mapping | render UI |
| Service | `lib/server/services/` | orchestration and domain workflows | render UI |

---

## 5. Component template

```tsx id="iyn3c3"
// components/features/signals/SignalCard.tsx

import { cn } from '@/lib/utils'
import type { SignalView } from '@/types/view'

interface SignalCardProps {
  signal: SignalView
  onSelect?: (id: string) => void
  className?: string
}

export function SignalCard({ signal, onSelect, className }: SignalCardProps) {
  return (
    <button
      type="button"
      className={cn('card cursor-pointer text-left', className)}
      onClick={() => onSelect?.(signal.id)}
    >
      {/* content */}
    </button>
  )
}
```
