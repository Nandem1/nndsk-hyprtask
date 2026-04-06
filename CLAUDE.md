# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (no --fix flag available by default)
```

No test runner is configured.

## Architecture

This project uses **Feature-Sliced Design (FSD)** with strict import boundaries enforced by ESLint (`eslint-plugin-boundaries`). Violating layer boundaries will cause lint errors.

### Layer hierarchy (top → bottom, each layer can only import from layers below it)

```
app/          → Next.js App Router routes. Can import: views, widgets, shared
src/views/    → Page-level containers. Can import: widgets, store, features, entities, shared
src/widgets/  → Complex UI components. Can import: store, features, entities, shared
src/store/    → Zustand global state. Can import: entities, shared
src/features/ → User-facing workflows. Can import: entities, shared
src/entities/ → Domain models & hooks. Can import: shared
src/shared/   → Reusable primitives. No internal imports allowed
```

### Path aliases

```typescript
@/*           → src/*
@shared/*     → src/shared/*
@entities/*   → src/entities/*
@features/*   → src/features/*
@widgets/*    → src/widgets/*
@views/*      → src/views/*
@store/*      → src/store/*
```

### State management

- **Zustand** (`src/store/`) — persisted to `localStorage` key `"hyprtask-store"`. Slices: `themeSlice`, `taskFiltersSlice`, `viewModeSlice`, `uiPreferencesSlice` (holds `isColacionOpen` + `animatedEmotes`)
  - Each slice separates state and actions into dedicated hooks: `useXState()`, `useXActions()`, `useX()` (combined)
  - Uses `useShallow` from `zustand/react/shallow` for shallow comparison
  - SSR-safe via `skipHydration` flag + `_hasHydrated` pattern
- **TanStack Query** — wraps localStorage-backed hooks; provides reactive cache invalidation

### Data persistence

All data lives in `localStorage` (no backend). TanStack Query is used as a reactive cache layer on top of it — mutations invalidate queries which triggers re-renders.

**Storage utilities** (`src/shared/lib/storage.ts`) are SSR-safe — `storageGet` returns `null` and `storageGetList` returns `[]` on the server. `asyncWrap()` wraps sync functions as Promises for TanStack Query mutations. `upsertItem<T>()` handles generic array upsert by `id`.

### TanStack Query conventions

Each entity exposes a query key factory in `model/query-keys.ts`:
```typescript
export const taskKeys = {
  all: ["tasks"] as const,
  active: () => [...taskKeys.all, "active"] as const,
  detail: (id: string) => [...taskKeys.all, "detail", id] as const,
};
```

Mutations use **optimistic updates** — `onMutate` cancels in-flight queries and updates the cache immediately; `onError` reverts; `onSettled` does final invalidation. Follow this pattern for all new mutations.

Generic mutation factories in `src/entities/project/hooks/use-entity-mutations.ts` provide `useUpsertMutation()` and `useDeleteEntityMutation()` for consistent optimistic update behavior across entities.

### Soft delete pattern

Projects and categories are never physically deleted — set `isActive: false` instead. Queries filter with `.filter(p => p.isActive !== false)`.

### Key domain types

```typescript
// src/entities/task/model/types.ts
interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  projectId?: string;
  categoryId?: string;
  notes?: string;
  parentTaskId?: string;   // Previous task in pipeline
  childTaskId?: string;    // Next task in pipeline
  order?: number;
}
```

### Routing

```
/              → redirect to /tasks
/tasks         → TaskBoard (Pipeline or Kanban view)
/sleep         → Sleep tracking dashboard
/sleep/config  → Sleep configuration
```

### UI stack

- **shadcn/ui** (new-york style) + **Radix UI** primitives
- **Tailwind CSS v4** — uses `@import "tailwindcss"` syntax, CSS variables for theming
- **Framer Motion** for animations — pre-built variants/transitions in `src/shared/lib/animations.ts` (`fadeIn`, `fadeInUp`, `scaleIn`, `spring`, tap gestures, etc.)
- **dnd-kit** for drag-and-drop in Kanban/Pipeline views
- **React Hook Form** + **Zod v4** for forms
- **Sonner** for toast notifications

### Theme system

Five palettes: `'genshin'`, `'zenless'`, `'wuthering'`, `'osu'`, `'mario'`. Each defines colors, emoji, and gradients. Theme state lives in `themeSlice`; CSS variables are applied at the root.

### Shared utilities worth knowing

- `src/shared/hooks/use-confirm.tsx` — `confirm()` returns `Promise<boolean>`, backed by a global `ConfirmProvider`; use for destructive actions instead of `window.confirm`
- `src/shared/hooks/use-countdown-timer.ts` — generic countdown hook; `useFocusTimer` is a thin wrapper around it
- `src/shared/lib/audio.ts` — `playSuccessSound()` via Web Audio API for task completion feedback
- `src/shared/lib/array.ts` — `reorderById()` updates `order` fields after drag-and-drop
- `src/shared/lib/seventv-api.ts` + `src/shared/lib/emote-parser.ts` — 7TV emote fetching and text parsing
- `src/shared/ui/rich-text.tsx` — pure presentational component; accepts `collection` as a prop. `ConnectedRichText.tsx` (widget layer) injects live emote data — always use the connected wrapper in widgets/features

### Keyboard shortcuts

`react-hotkeys-hook` is used for keyboard shortcuts. Register hotkeys at the feature/widget level, not inside entity components.
