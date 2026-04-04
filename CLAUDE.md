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

- **Zustand** (`src/store/`) — persisted to `localStorage` key `"hyprtask-store"`. Slices: `themeSlice`, `taskFiltersSlice`, `viewModeSlice`
- **TanStack Query** — wraps localStorage-backed hooks; provides reactive cache invalidation

### Data persistence

All data lives in `localStorage` (no backend). TanStack Query is used as a reactive cache layer on top of it — mutations invalidate queries which triggers re-renders.

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
- **Framer Motion** for animations
- **dnd-kit** for drag-and-drop in Kanban/Pipeline views
- **React Hook Form** + **Zod v4** for forms
- **Sonner** for toast notifications
