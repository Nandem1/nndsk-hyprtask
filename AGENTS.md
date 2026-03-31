# HyprTask - Developer Guide

## Mejoras Implementadas

### Fase 1: TanStack Query Optimizations
- ✅ QueryClient mejorado con retry exponencial
- ✅ Query Error Boundary implementado
- ✅ Prefetch hooks para tareas
- ✅ Optimistic updates mejorados para setCurrentTask y updateSettings
- ✅ Query keys factory extendido con `detail(key)`

### Fase 2: Framer Motion Animations
- ✅ `AnimatedContainer` - Componente reutilizable con variants
- ✅ `AnimatedList` - Listas con stagger animations
- ✅ `FilteredAnimatedList` - Listas filtradas con AnimatePresence
- ✅ Animaciones con soporte para `prefers-reduced-motion`
- ✅ Animation library centralizada en `src/shared/lib/animations.ts`

### Fase 3: Performance Optimizations
- ✅ Dynamic imports para vistas pesadas (Terminal, CodeNotes, TerminalOut)
- ✅ Skeleton components para estados de carga
- ✅ React.memo optimizaciones preparadas

### Fase 4: shadcn Components
- ✅ `Badge` - Badges con variants
- ✅ `Dialog` - Modales accesibles
- ✅ `Toaster` - Notificaciones toast
- ✅ `Separator` - Divisores visuales
- ✅ `Skeleton` - Estados de carga

### Fase 5: Polish
- ✅ `EmptyState` - Componente reutilizable para estados vacíos
- ✅ `style-utils` - Utilidades CSS reutilizables
- ✅ Toaster integrado en layout

### Fase 6: SSR Optimizations (NEW)
- ✅ **Server Components First**: App pages ahora son Server Components
- ✅ **Suspense Boundaries**: Cada página con Suspense + Skeleton
- ✅ **Header Split**: Header (Server) + HeaderClient (Client) + HeaderSkeleton
- ✅ **UI Components Server-Side**: Button, Card, Input, Badge, Skeleton son Server Components
- ✅ **Client Components minimizados**: Solo "use client" cuando es necesario

## Estructura de UI Components

```
src/shared/ui/
├── button.tsx              # Server Component ✅
├── card.tsx                # Server Component ✅
├── input.tsx               # Server Component ✅
├── label.tsx               # Server Component ✅
├── badge.tsx               # Server Component ✅
├── separator.tsx           # Server Component ✅
├── skeleton.tsx            # Server Component ✅
├── empty-state.tsx         # Server Component ✅
├── dialog.tsx              # Client Component (Radix UI)
├── sonner.tsx              # Client Component (Toast)
├── animated-container.tsx  # Client Component (Framer Motion)
├── animated-list.tsx       # Client Component (Framer Motion)
└── index.ts                # Exports con separación Server/Client
```

## Server vs Client Components

### Server Components (sin "use client")
- ✅ No usan hooks (useState, useEffect)
- ✅ No acceden a APIs del navegador
- ✅ No usan event handlers (onClick, onSubmit)
- ✅ Pueden ser async
- ✅ Mejor SEO y TTFB

### Client Components (con "use client")
- Hooks del estado (useState, useEffect, useContext)
- Event handlers (onClick, onSubmit, etc.)
- APIs del navegador (localStorage, window, document)
- Hooks personalizados que usan lo anterior
- Framer Motion (usa useEffect internamente)

## Pattern: Server Component Wrapper + Client Child

```tsx
// app/tasks/page.tsx - Server Component
import { Suspense } from "react";
import { TasksPageContent } from "./TasksPageContent";
import { TasksPageSkeleton } from "./TasksPageSkeleton";

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksPageSkeleton />}>
      <TasksPageContent /> {/* Client Component */}
    </Suspense>
  );
}

// app/tasks/TasksPageContent.tsx - Client Component
"use client";
export function TasksPageContent() {
  const { themeClasses } = useThemeState();
  // ... hooks y lógica
}

// app/tasks/TasksPageSkeleton.tsx - Server Component
export function TasksPageSkeleton() {
  return <Skeleton className="h-96" />;
}
```

## Uso de Animaciones

### AnimatedContainer
```tsx
import { AnimatedContainer } from "@/shared/ui";

<AnimatedContainer animation="fadeInUp" delay={0.2}>
  <YourComponent />
</AnimatedContainer>
```

### AnimatedList
```tsx
import { AnimatedList } from "@/shared/ui";

<AnimatedList
  items={tasks}
  keyExtractor={(task) => task.id}
  renderItem={(task) => <TaskCard task={task} />}
/>
```

## Uso de TanStack Query

### Prefetching
```tsx
import { usePrefetchTask } from "@/entities/task";

const { prefetchTask } = usePrefetchTask();

// En evento hover
onMouseEnter={() => prefetchTask(task.id)}
```

### Mutations con Optimistic Updates
```tsx
import { useToggleTask, useDeleteTask } from "@/entities/task";

const toggleMutation = useToggleTask();
const deleteMutation = useDeleteTask();

// Los updates optimistas ya están configurados
```

## Mejores Prácticas

1. **Server Components First**: Empezar siempre como Server Component
2. **Suspense + Skeleton**: Cada Client Component debe tener un Skeleton
3. **Separar concerns**: UI presentacional = Server, Interactividad = Client
4. **"use client" mínimo**: Solo cuando sea estrictamente necesario
5. **useReducedMotion**: Los componentes de animación ya lo implementan
6. **Query keys factory**: Usar siempre para consistencia de caché
7. **Separar estado y acciones**: Usar hooks especializados del store

## Scripts

```bash
npm run build    # Build de producción
npm run dev      # Desarrollo
npm run lint     # ESLint
```
