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
    ├── theme-slice.ts    # Estado del tema
    ├── task-filters-slice.ts  # Filtros de tareas
    └── view-mode-slice.ts     # Modo de vista
```

## Mejores Prácticas Aplicadas

### ✅ 1. Persist Middleware Oficial
- Maneja automáticamente SSR con `skipHydration`
- Rehidratación automática en cliente
- `partialize` para seleccionar qué guardar
- `merge` para reconstruir computed values al hidratar

### ✅ 2. Separación Estado / Acciones
Las acciones nunca cambian, el estado sí:

```tsx
// Solo estado (se re-renderiza cuando cambia)
const { palette, themeClasses } = useThemeState();

// Solo acciones (nunca causa re-render)
const { changePalette } = useThemeActions();

// Ambos (cuando se necesiten ambos)
const { palette, changePalette } = useTheme();
```

### ✅ 3. useShallow para Objetos
Para comparación superficial de objetos (Zustand v5 API):

```tsx
useStore(
  useShallow((state) => ({ 
    palette: state.palette, 
    themeClasses: state.themeClasses 
  }))
);
```

### ✅ 4. SSR Safety
- Computed values en estado con defaults
- `_hasHydrated` flag para UI condicional
- `useHasHydrated()` hook para skeletons

## Uso

### Theme

```tsx
import { useTheme, useThemeState, useThemeActions } from '@/store/hooks';

// Solo lectura de estado (recomendado)
function Component() {
  const { palette, themeClasses } = useThemeState();
  return <div className={themeClasses.textPrimary}>{palette}</div>;
}

// Solo acciones
function ThemeSelector() {
  const { changePalette } = useThemeActions();
  return <button onClick={() => changePalette('zenless')}>Cambiar</button>;
}
```

### Task Filters (Ahora en Zustand)

```tsx
import { useTaskFiltersState, useTaskFiltersActions } from '@/store/hooks';

function TaskSidebar() {
  const { selectedProject, selectedCategory } = useTaskFiltersState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  
  // Los filtros persisten automáticamente
  // No más props drilling desde page.tsx
}
```

### View Mode

```tsx
import { useViewModeState, useViewModeActions } from '@/store/hooks';

function ViewSelector() {
  const { viewMode, viewModeLabel } = useViewModeState();
  const { setViewModeImmediate } = useViewModeActions();
  
  return (
    <div>
      <span>Modo: {viewModeLabel}</span>
      <button onClick={() => setViewModeImmediate('kanban')}>Kanban</button>
    </div>
  );
}
```

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│  PAGES (app/)                                               │
│  ├── tasks/page.tsx        → Layout limpio, sin estado      │
├─────────────────────────────────────────────────────────────┤
│  WIDGETS (src/widgets/)                                     │
│  ├── TaskBoard             → useTaskFiltersState()          │
│  ├── Header                → useThemeState()                │
├─────────────────────────────────────────────────────────────┤
│  ENTITIES (src/entities/)                                   │
│  ├── task/ui/TaskSidebar   → setSelectedProject()           │
├─────────────────────────────────────────────────────────────┤
│  STORE (src/store/)                                         │
│  ├── theme-slice.ts        ✅                               │
│  ├── task-filters-slice.ts ✅ (AHORA SÍ USADO)              │
│  └── view-mode-slice.ts    ✅                               │
└─────────────────────────────────────────────────────────────┘
```

## Cambios Realizados

### ✅ Eliminada capa `features/`
- Ya no existe `src/features/`
- Los hooks se consumen directamente desde `@/store/hooks`

### ✅ Filtros migrados a Zustand
- Eliminado props drilling de filtros (3 niveles)
- `TaskSidebar` y `TaskBoard` usan el store directamente
- Los filtros persisten en localStorage

### ✅ Hooks theme optimizados
- ~10 componentes actualizados a `useThemeState()`
- Menos re-renders innecesarios

## Ventajas

- ✅ **Sin capas redundantes**: 5 capas en lugar de 6
- **Sin props drilling**: Filtros en store global
- **Persistencia automática**: Tema, filtros y view mode se guardan
- **SSR First**: No hydration mismatches
- **Performance**: `useShallow` + separación estado/acciones
- **DevTools**: Redux DevTools middleware incluido
- **TypeScript**: 100% tipado

## Testing

```bash
npm run lint      # ✅ Sin errores
npx tsc --noEmit  # ✅ Sin errores
npm run build     # ✅ 7/7 páginas estáticas
```

## DevTools

El store incluye Redux DevTools middleware para debugging:
- Instala la extensión [Redux DevTools](https://github.com/reduxjs/redux-devtools) en tu navegador
- El store aparecerá como "hyprtask-store" en el panel de DevTools
