# Plan: Expansión de Atajos — Vim Feel

## Mapa final de shortcuts

### Globales (siempre activos, fuera de modales de formulario)
| Key | Acción | Estado |
|---|---|---|
| `j` / `↓` | Siguiente tarea | ✅ existente |
| `k` / `↑` | Tarea anterior | ✅ existente |
| `Enter` | Abrir detalle | ✅ existente |
| `Esc` | Cerrar modal / limpiar selección | ✅ existente |
| `n` / `o` | Nueva tarea (`o` = alias vim "open line") | `o` nuevo |
| `Space` | Completar / descompletar | ✅ existente |
| `f` | Modo Foco | ✅ existente |
| `d` | Eliminar seleccionada | ✅ existente |
| `s` | Marcar como actual | ✅ existente |
| `1` | Vista Pipeline | ✅ existente |
| `2` | Vista Kanban | ✅ existente |
| `v` | Ciclar vista (pipeline ↔ kanban) | nuevo |
| `q` | Limpiar filtros | ✅ existente |
| `m` | Abrir / cerrar Colación | nuevo |
| `t` | Ciclar paleta de tema | nuevo |
| `[` | Proyecto anterior | nuevo |
| `]` | Proyecto siguiente | nuevo |

### Prefijo `g` — Goto (secuencia de 2 teclas)
| Secuencia | Acción |
|---|---|
| `g h` | Ir a /tasks (home) |
| `g s` | Ir a /sleep |
| `g c` | Ir a /sleep/config |

### Dentro del Detail Modal (context-aware)
| Key | Acción |
|---|---|
| `e` | Editar notas (focus textarea) |
| `Ctrl+Enter` | Guardar notas (cuando editando) |
| `p` | Ciclar prioridad (low → medium → high → low) |

### Dentro del Focus Mode (context-aware)
| Key | Acción |
|---|---|
| `Space` | Play / Resume timer |
| `p` | Pause timer |
| `r` | Reset timer |
| `c` | Completar tarea y cerrar |
| `b` | Saltar break (cuando en break) |

---

## Fases de implementación

### Fase 1 — Definiciones y panel
Agregar todas las nuevas definiciones a `keyboard-shortcuts.ts` y actualizar el panel lateral.

**Tareas:**
- [ ] Agregar en `keyboard-shortcuts.ts`: `ALIAS_NEW_TASK` (o), `CYCLE_VIEW` (v), `OPEN_COLACION` (m), `CYCLE_THEME` (t), `FILTER_PREV` ([), `FILTER_NEXT` (]), `GOTO_HOME`, `GOTO_SLEEP`, `GOTO_CONFIG`
- [ ] Agregar nuevos grupos: `"Ir a"`, `"Interfaz"`
- [ ] Actualizar `KeyboardShortcutsPanel.tsx` para mostrar todos los grupos nuevos

---

### Fase 2 — Shortcuts globales simples
Agregar los nuevos globales al hook principal `useKeyboardShortcuts.ts`.

**Tareas:**
- [ ] `o` → alias de `handleOpenCreateModal`
- [ ] `v` → `setViewMode(current === "pipeline" ? "kanban" : "pipeline")`
- [ ] `m` → `openColacion()` (hook desde `useColacionActions`)
- [ ] `t` → `changePalette(nextPalette)` — ciclar array de paletas desde `theme-slice`
- [ ] `[` / `]` → ciclar `selectedProjectId` por lista de proyectos activos

---

### Fase 3 — Prefijo `g` (goto leader key)
Implementar sistema de tecla líder con timeout, similar a vim.

**Arquitectura:**
```
useLeaderKey(key: "g", timeout: 800ms)
  → retorna: { leaderActive, resetLeader }
  → cuando leaderActive, registrar sub-atajos (h, s, c)
  → usar next/navigation router.push()
```

**Tareas:**
- [ ] Crear `src/widgets/task-board/hooks/use-leader-key.ts` — hook genérico para tecla líder con timeout
- [ ] Agregar goto shortcuts en `useKeyboardShortcuts.ts` usando el leader hook
- [ ] Visual feedback: indicador sutil en el panel de atajos cuando `g` está pending

---

### Fase 4 — Shortcuts dentro del Detail Modal
Agregar atajos contextuales al `TaskDetailModal`.

**Tareas:**
- [ ] Leer `TaskDetailModal.tsx` y `NotesSection.tsx` para entender la estructura actual
- [ ] Crear `useDetailModalShortcuts` hook en `src/widgets/task-board/hooks/`
- [ ] `e` → trigger click / focus del textarea de notas (via ref o evento)
- [ ] `p` → ciclar prioridad vía mutación `useUpdateTask` o similar
- [ ] `Ctrl+Enter` → trigger submit de notas (cuando textarea activo) en `NotesSection`
- [ ] Agregar el hook al `TaskDetailModal` (habilitado solo cuando `isOpen`)

---

### Fase 5 — Shortcuts dentro del Focus Mode
Agregar atajos de timer al `FocusMode`.

**Tareas:**
- [ ] Leer `FocusMode.tsx` y `TimerControls.tsx` para entender la API del timer
- [ ] Crear `useFocusModeShortcuts` hook en `src/widgets/task-board/hooks/`
- [ ] `Space` → play/resume (cuando idle o paused)
- [ ] `p` → pause (cuando running)
- [ ] `r` → reset
- [ ] `c` → onComplete() + onClose()
- [ ] `b` → skip break (cuando timerState === "break")
- [ ] Agregar el hook al `FocusMode` (habilitado solo cuando `isOpen`)

---

### Fase 6 — Lint y verificación final
- [ ] `npm run lint` sin errores nuevos
- [ ] Verificar que todos los nuevos shortcuts aparecen en el panel lateral
- [ ] Smoke test manual: cada shortcut nuevo funciona en su contexto

---

## Notas técnicas

**Ciclar paleta de tema:**
```ts
const PALETTE_ORDER = ["genshin", "zenless", "wuthering", "osu", "mario"] as const;
// en theme-slice ya existe changePalette(palette)
```

**Ciclar proyectos con `[`/`]`:**
```ts
// projects = useActiveProjects() — lista de proyectos activos
// selectedProjectId de useTaskFiltersState()
// navegar al índice anterior/siguiente, wrapping con "all"
```

**Leader key `g` con timeout:**
```ts
// useHotkeys("g", () => setLeaderActive(true), { enabled: !isModalOpen })
// useEffect: si leaderActive, setTimeout 800ms para resetear
// useHotkeys("h", () => router.push("/tasks"), { enabled: leaderActive })
// etc.
```

**`p` para prioridad en detail modal:**
- Necesita una mutación `useUpdateTask` que actualice solo la prioridad
- Ciclar: `low` → `medium` → `high` → `low`
- Requiere que la tarea seleccionada esté disponible en el modal context
