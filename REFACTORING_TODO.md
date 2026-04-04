# Refactoring Plan - SOLID / DRY / KISS / FSD

## Estado: Fase 1 + Fase 2 + Fase 4 completadas

### Progreso - Batch 1 (completado previamente)
- [x] **Item 1**: FullscreenTimerLayout - Extraído correctamente. FocusMode y ColacionMode lo usan.
- [x] **Item 2**: `ProjectName` extraído a `entities/project/ui/ProjectName.tsx` con prop `variant` ("text" | "badge"). FocusMode y TaskDetailModal usan el componente compartido.
- [x] **Item 3**: VIEW_MODES consolidado - Eliminado duplicado de `entities/task/model/view-mode.ts`. Solo `TaskBoardHeader.tsx` tiene la config UI con iconos Lucide. Entity solo tiene tipos.
- [x] **Item 4**: Animation variants - `fullscreenContainerVariants`, `contentVariants`, `timerModeVariants` movidos a `shared/lib/animations.ts`. `focus-timer-constants.ts` re-exporta con alias para compatibilidad.
- [x] **Item 8**: `TaskViewMode` type movido a `shared/types/view-mode.ts`. Store importa de shared. Entity re-exporta para compatibilidad.
- [x] **FSD Fix 1**: `UserEmote` type movido a `shared/types/emote.ts`. `emote-parser.ts` importa de shared.
- [x] **FSD Fix 2**: `shared/ui/rich-text.tsx` convertido a componente puro (acepta `collection` como prop). Wrapper `ConnectedRichText.tsx` inyecta hooks de emotes. Solo widgets usan RichText.
- [x] **Lint cleanup**: Eliminados 13 warnings (imports/vars no usados). De 2 errors + 17 warnings a 0 errors + 4 warnings (3 img element + 1 react-compiler, ambos aceptables).
- [x] **Build + Lint**: `npm run build` pasa. `npm run lint` pasa con 0 errors.

### Progreso - Fase 1 Quick Wins (completado)
- [x] **1.1**: Reemplazar `import type { useThemeState }` por `ExtendedThemeClasses` directo en PipelineView, PipelineStep, KanbanTaskCard. Elimina acoplamiento frágil con store.
- [x] **1.2**: Fix indentación `PipelineView.tsx` líneas 6-12.
- [x] **1.3**: Extraer `NotesSection` (159 líneas), `AnimatedCheckbox` (34 líneas), `ContextCard` (39 líneas) de TaskDetailModal.tsx a archivos propios. TaskDetailModal pasa de 567 → ~310 líneas.
- [x] **1.4**: Crear `formatTaskDate()` en `shared/lib/format-date.ts`. Reemplaza 3 instancias inline de `toLocaleDateString` (PipelineStep, TaskDetailModal x2).
- [x] **1.5**: Agregar `gradientBgSolid` a `ExtendedThemeClasses` y `THEME_BASE_CLASSES`. Elimina `.replace("/10", "")` hack en PipelineStep y KanbanTaskCard.

### Progreso - Fase 2: Unificación de Componentes (completado)
- [x] **2.1**: Unificar 3 implementaciones de checkbox animado → `TaskCheckbox` en `shared/ui/task-checkbox.tsx` con `variant` prop ("sm"|"md"|"lg"). PipelineStep, KanbanTaskCard y TaskDetailModal usan el componente compartido. `AnimatedCheckbox.tsx` ahora es re-export para compatibilidad.
- [x] **2.2**: Extraer `TimerControls` compartido en `widgets/task-board/ui/TimerControls.tsx`. FocusMode y ColacionMode usan el componente compartido. Elimina ~50 líneas de duplicación.
- [x] **2.3**: Consolidar `useFocusTimer` y `useCountdownTimer` en hook extensible. `useCountdownTimer` (shared) ahora soporta fase de break opcional + `timeLeftRef`. `useFocusTimer` es un thin wrapper con nombres de métodos adaptados.
- [x] **Build + Lint**: `npm run build` pasa. `npm run lint` pasa con 0 errors, 4 warnings (aceptables).

### Items pendientes - Fase 3: Datos + Arquitectura
- [ ] **3.1**: Migrar `useFocusSessions` de useState+localStorage → TanStack Query (sync reactivo entre componentes)
- [ ] **3.2**: Refactor `use-task-mutations.ts` (292 líneas): extraer helpers de optimistic update compartidos → ~150 líneas
- [ ] **3.3**: Extraer `TaskActionButtons` (Actual/Foco/Delete) compartido para PipelineStep, KanbanTaskCard, TaskDetailModal

### Items pendientes - Fase 4: Limpieza Profunda
- [x] **4.1**: Dejar de exportar funciones raw de storage desde entity `index.ts`. Eliminadas 17 exports de `entities/task/index.ts` y 12 exports de `entities/project/index.ts`. Unico consumidor externo (`TasksPageContent.tsx`) ahora importa directo de `entities/task/lib/storage`.
- [x] **4.2**: Split `project/model/types.ts` (312 → 126 líneas): extraídos `model/color-constants.ts` (108 líneas) y `model/defaults.ts` (74 líneas). Index re-exporta desde los nuevos archivos.
- [x] **4.3**: Merge `colacion-slice` + `emote-prefs-slice` → `ui-preferences-slice`. Un solo slice con `isColacionOpen` + `animatedEmotes`. Hooks existentes sin cambios.
- [x] **Build + Lint**: `npm run build` pasa. `npm run lint` pasa con 0 errors, 4 warnings (aceptables).

### Archivos creados
- `src/shared/types/emote.ts` - Tipo UserEmote
- `src/shared/types/view-mode.ts` - Tipo TaskViewMode
- `src/shared/lib/format-date.ts` - Utilidad formatTaskDate (short/long)
- `src/entities/project/ui/ProjectName.tsx` - Componente ProjectName con variant
- `src/widgets/task-board/ui/ConnectedRichText.tsx` - Wrapper que inyecta hooks de emotes
- `src/widgets/task-board/ui/NotesSection.tsx` - Sección de notas con emote picker
- `src/widgets/task-board/ui/AnimatedCheckbox.tsx` - Re-export de TaskCheckbox para compatibilidad
- `src/widgets/task-board/ui/TimerControls.tsx` - Controles de timer compartidos (play/pause/reset)
- `src/shared/ui/task-checkbox.tsx` - TaskCheckbox unificado con variant (sm/md/lg)
- `src/widgets/task-board/ui/ContextCard.tsx` - Tarjeta de contexto parent/child
- `src/entities/project/model/color-constants.ts` - PROJECT_COLOR_CLASSES, CATEGORY_COLOR_CLASSES (extraído de types.ts)
- `src/entities/project/model/defaults.ts` - DEFAULT_PROJECTS, DEFAULT_CATEGORIES (extraído de types.ts)
- `src/store/slices/ui-preferences-slice.ts` - Slice unificado (colacion + emote prefs)

### Archivos modificados
- `src/entities/emote/model/types.ts` - Re-exporta UserEmote desde shared
- `src/entities/task/model/view-mode.ts` - Re-exporta TaskViewMode desde shared, eliminado VIEW_MODES
- `src/entities/task/index.ts` - Eliminada export de VIEW_MODES
- `src/entities/project/index.ts` - Agregada export de ProjectName
- `src/shared/lib/emote-parser.ts` - Importa UserEmote desde shared
- `src/shared/lib/animations.ts` - Agregados fullscreenContainerVariants, contentVariants, timerModeVariants
- `src/shared/lib/format-date.ts` - Nuevo: formatTaskDate() con estilos short/long
- `src/shared/types/theme.ts` - Agregado gradientBgSolid a ExtendedThemeClasses y THEME_BASE_CLASSES
- `src/shared/theme/config/utils.ts` - Agregado gradientBgSolid a getThemeClassesString
- `src/shared/ui/rich-text.tsx` - Convertido a componente puro con props collection/animatedEmotes
- `src/store/slices/view-mode-slice.ts` - Importa TaskViewMode desde shared
- `src/widgets/task-board/lib/focus-timer-constants.ts` - Re-exporta variants desde shared
- `src/widgets/task-board/ui/FocusMode.tsx` - Usa ProjectName, ConnectedRichText, TimerControls. Elimina imports Play/Pause/RotateCcw.
- `src/widgets/task-board/ui/ColacionMode.tsx` - Usa TimerControls. Elimina imports motion/Button/Play/Pause/RotateCcw.
- `src/widgets/task-board/hooks/useFocusTimer.ts` - Thin wrapper sobre useCountdownTimer. De 107 → ~52 líneas.
- `src/shared/hooks/use-countdown-timer.ts` - Agregado soporte para break phase, timeLeftRef, skipBreak. CountdownState ahora incluye "break".
- `src/widgets/task-board/ui/TaskDetailModal.tsx` - Usa TaskCheckbox de shared en vez de AnimatedCheckbox local.
- `src/widgets/task-board/ui/TaskDetailModal.tsx` - Extraídos NotesSection, AnimatedCheckbox, ContextCard. Usa formatTaskDate. De 567 → ~310 líneas.
- `src/widgets/task-board/ui/views/PipelineView.tsx` - Usa ExtendedThemeClasses directo, fix indentación
- `src/widgets/task-board/ui/views/PipelineStep.tsx` - Usa ExtendedThemeClasses directo, usa gradientBgSolid, usa formatTaskDate, usa TaskCheckbox compartido
- `src/widgets/task-board/ui/views/KanbanTaskCard.tsx` - Usa ExtendedThemeClasses directo, usa gradientBgSolid, usa TaskCheckbox compartido
- `src/widgets/task-board/ui/FocusTimerCircle.tsx` - Acepta timerState "completed" en el tipo
- Varias limpieza de imports no usados
- `src/entities/task/index.ts` - Eliminadas 17 exports de funciones raw de storage
- `src/entities/project/index.ts` - Eliminadas 12 exports de funciones raw de storage. Imports de constantes apuntan a nuevos archivos.
- `src/entities/project/model/types.ts` - Solo tipos/interfaces. De 312 → 126 líneas.
- `src/entities/project/lib/storage.ts` - Importa DEFAULT_PROJECTS/CATEGORIES desde `model/defaults`
- `src/entities/project/hooks/use-project-colors.ts` - Importa color classes desde `model/color-constants`
- `src/store/index.ts` - Usa UIPreferencesSlice unificado en vez de colacion + emote-prefs
- `src/store/slices/colacion-slice.ts` - ELIMINADO (mergeado en ui-preferences-slice)
- `src/store/slices/emote-prefs-slice.ts` - ELIMINADO (mergeado en ui-preferences-slice)
- `src/views/tasks/ui/TasksPageContent.tsx` - Importa autoArchiveCompletedTasks desde storage directo

### Warnings aceptables (no arreglables sin cambios mayores)
- 3x `@next/next/no-img-element` - Emotes externos 7TV, Next Image no aplica para URLs dinámicas
- 1x `react-hooks/incompatible-library` - React Compiler vs React Hook Form `watch()`
