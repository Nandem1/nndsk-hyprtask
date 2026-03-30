# Zustand Store - HyprTask

Implementación de estado global usando Zustand v5 con patrón class-based y middleware oficial de persistencia.

## Estructura

```
src/store/
├── index.ts              # Store principal con persist middleware
├── types.ts              # Tipos base compartidos
├── utils.ts              # Utilidades (flattenActions)
├── hooks.ts              # Hooks especializados con useShallow
├── StoreInitializer.tsx  # Manejo de hidratación SSR
└── slices/
    ├── theme-slice.ts    # Estado del tema con computed values
    ├── task-filters-slice.ts  # Filtros de tareas
    └── view-mode-slice.ts     # Modo de vista
```

## Mejores Prácticas Aplicadas

### ✅ 1. Persist Middleware Oficial
Usamos el middleware `persist` de Zustand en lugar de manual localStorage:
- Maneja automáticamente SSR con `skipHydration`
- Rehidratación automática en cliente
- `partialize` para seleccionar qué guardar
- `merge` para reconstruir computed values al hidratar

### ✅ 2. Separación Estado / Acciones
Las acciones nunca cambian, el estado sí. Separamos los hooks:

```tsx
// Solo estado (se re-renderiza cuando cambia)
const { palette, themeClasses } = useThemeState();

// Solo acciones (nunca causa re-render)
const { changePalette } = useThemeActions();

// Ambos (usar solo cuando se necesiten ambos)
const { palette, changePalette } = useTheme();
```

### ✅ 3. useShallow para Objetos
Cuando seleccionamos múltiples valores, usamos `useShallow` para comparación superficial:

```tsx
// ✅ Correcto - shallow comparison
const { palette, themeClasses } = useStore(
  useShallow((state) => ({ palette: state.palette, themeClasses: state.themeClasses }))
);

// ❌ Evitar - objeto nuevo en cada render
const { palette, themeClasses } = useStore((state) => ({ 
  palette: state.palette, 
  themeClasses: state.themeClasses 
}));
```

### ✅ 4. Computed Values en Estado
Para SSR safety, los valores computados se almacenan en el estado:

```typescript
export interface ThemeState {
  palette: ThemePalette;
  themeClasses: ThemeClasses;  // Computed
  isDarkPalette: boolean;      // Computed
}
```

### ✅ 5. Hydration Safety
- `skipHydration: typeof window === "undefined"` evita hydration mismatch
- `_hasHydrated` flag para UI que depende de localStorage
- `StoreInitializer` component para forzar rehidratación si es necesario

## Uso Básico

### Theme

```tsx
import { useTheme, useThemeState, useThemeActions } from '@/store/hooks';

// Opción 1: Solo estado (recomendado para UI)
function ThemeDisplay() {
  const { palette, themeClasses } = useThemeState();
  return <div className={themeClasses.textPrimary}>{palette}</div>;
}

// Opción 2: Solo acciones (recomendado para handlers)
function ThemeSelector() {
  const { changePalette } = useThemeActions();
  return <button onClick={() => changePalette('zenless')}>Cambiar</button>;
}

// Opción 3: Ambos (cuando se necesiten en el mismo componente)
function ThemeSettings() {
  const { palette, changePalette, themeClasses } = useTheme();
  // ...
}
```

### Task Filters

```tsx
import { useTaskFilters, useTaskFiltersState, useTaskFiltersActions } from '@/store/hooks';

function TaskFilters() {
  const { selectedProject, hasActiveFilters } = useTaskFiltersState();
  const { setSelectedProject, clearFilters } = useTaskFiltersActions();
  // ...
}
```

### View Mode

```tsx
import { useViewMode, useViewModeState, useViewModeActions } from '@/store/hooks';

function ViewSelector() {
  const { viewMode, viewModeLabel } = useViewModeState();
  const { setViewMode } = useViewModeActions();
  
  return (
    <div>
      <span>Modo: {viewModeLabel}</span>
      <button onClick={() => setViewMode('kanban')}>Kanban</button>
    </div>
  );
}
```

### Hydration Safety

```tsx
import { useHasHydrated } from '@/store/hooks';

function MyComponent() {
  const hasHydrated = useHasHydrated();
  
  if (!hasHydrated) {
    return <Skeleton />; // o null, o spinner
  }
  
  return <ActualContent />;
}
```

## Crear un Nuevo Slice

1. Crear archivo en `src/store/slices/my-slice.ts`:

```typescript
import { StoreSetter, StoreGetter, PublicActions } from '../types';

// State - incluir computed values
export interface MyState {
  value: string;
  computedValue: boolean;  // Computed & stored for SSR
}

export const initialMyState: MyState = {
  value: '',
  computedValue: false,
};

// Actions Class
export class MyActionImpl {
  private readonly _get: Getter;
  private readonly _set: Setter;

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
    this._set = set;
    this._get = get;
  }

  setValue = (value: string): void => {
    this._set({ 
      value,
      computedValue: value.length > 0  // Update computed
    });
  };
}

export type MyActions = PublicActions<MyActionImpl>;
export const createMySlice = (set: Setter, get: Getter, api?: unknown) =>
  new MyActionImpl(set, get, api);
```

2. Registrar en `src/store/index.ts` con persist opcional:

```typescript
import {
  createMySlice,
  initialMyState,
  type MyState,
  type MyActions,
} from './slices/my-slice';

export interface AppStore extends 
  MyState,
  MyActions { _hasHydrated?: boolean }

const initialState = { ...initialMyState };

export const useStore = create<AppStore>()(
  persist(
    (...params) => ({
      ...initialState,
      ...flattenActions<MyActions>([createMySlice(...params)]),
      _hasHydrated: false,
    }),
    {
      name: "hyprtask-store",
      partialize: (state) => ({ myValue: state.value }),
      skipHydration: typeof window === "undefined",
    }
  )
);
```

3. Crear hooks en `src/store/hooks.ts`:

```typescript
export function useMyState() {
  return useStore(
    useShallow(
      useCallback(
        (state) => ({ value: state.value, computedValue: state.computedValue }),
        []
      )
    )
  );
}

export function useMyActions() {
  return useStore(
    useCallback((state) => ({ setValue: state.setValue }), [])
  );
}

export function useMy() {
  return useStore(
    useShallow(
      useCallback(
        (state) => ({ 
          value: state.value, 
          computedValue: state.computedValue,
          setValue: state.setValue 
        }),
        []
      )
    )
  );
}
```

## Ventajas

- ✅ **Middleware persist oficial**: Manejo robusto de SSR y localStorage
- ✅ **Separación estado/acciones**: Optimización de renders
- ✅ **useShallow**: Comparación eficiente de objetos
- ✅ **TypeScript**: Tipado completo y seguro
- ✅ **SSR First**: No más hydration mismatches
- ✅ **Escalable**: Patrón class-based para lógica compleja
- ✅ **DevTools**: Integrado con Redux DevTools

## Migración desde Context API (Completada)

- ❌ `useThemeContext` → ✅ `useThemeState` / `useThemeActions`
- ❌ `useTaskFilters` (Context) → ✅ `useTaskFiltersState` / `useTaskFiltersActions`
- ❌ `useTaskViewMode` (Context) → ✅ `useViewModeState` / `useViewModeActions`
- ❌ Manual localStorage → ✅ `persist` middleware
