# Zustand Store - HyprTask

## Posición en FSD

`src/store/` actúa como la capa **app** implícita en este proyecto (Next.js ocupa `app/` para el router, por lo que el store vive aquí como equivalente).

**Reglas que debe cumplir:**
- Puede importar desde cualquier capa inferior (`entities`, `shared`, etc.)
- **Ninguna capa inferior debe importar desde `@/store`** — solo `widgets` y capas superiores

**Jerarquía:** `store (app)` → `widgets` → `features` → `entities` → `shared`

## Estructura

```
src/store/
├── index.ts              # Store principal con persist middleware
├── types.ts              # Tipos base (StoreSetter, StoreGetter)
├── utils.ts              # Utilidades (flattenActions)
├── hooks.ts              # Hooks especializados con useShallow
└── slices/
    ├── theme-slice.ts        # Estado del tema
    ├── task-filters-slice.ts # Filtros de tareas
    ├── view-mode-slice.ts    # Modo de vista
    ├── colacion-slice.ts     # Panel colación (open/close)
    └── emote-prefs-slice.ts  # Preferencias de emotes
```

## Hooks disponibles

```ts
// Theme
useThemeState()  → { palette, themeClasses }
useTheme()       → { palette, themeClasses, changePalette }

// Task Filters
useTaskFiltersState()   → { selectedProjectId, selectedCategoryId, searchQuery, hasActiveFilters }
useTaskFiltersActions() → { setSelectedProject, setSelectedCategory, setSearchQuery }

// View Mode
useViewModeState()   → { viewMode, isTransitioning }
useViewModeActions() → { setViewMode }

// Colacion
useColacionState()   → { isColacionOpen }
useColacionActions() → { openColacion, closeColacion }

// Emote Prefs
useEmotePrefsState() → { animatedEmotes }
useEmotePrefs()      → { animatedEmotes, setAnimatedEmotes }
```

## Uso

```tsx
import { useTheme, useThemeState } from '@/store/hooks';

function Component() {
  const { palette, themeClasses } = useThemeState();
  const { changePalette } = useTheme();
}
```
