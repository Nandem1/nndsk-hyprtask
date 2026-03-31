# HyprTask - Developer Guide

## Estado del Proyecto: ✅ Funcionalidades Completas

## Mejoras Implementadas

### Fase 1-6: Base técnica sólida (ver versiones anteriores)
- TanStack Query, Framer Motion, Performance, shadcn, SSR

### Fase 7: UX/UI Para TDAH + Dev Workflow ✅ COMPLETA

#### 1. Pipeline View ✅
Vista secuencial diseñada para flujos de trabajo de desarrollo:
```
[✓] Paso 1: Revisar backend
    ↓
[▶] Paso 2: Extender endpoint  ← ACTUAL [Foco]
    ↓
[○] Paso 3: Documentar (pendiente)
```

**Características:**
- Muestra el flujo completo del pipeline
- Preview de notas en cada tarjeta
- Botón "Foco" para entrar en modo concentración
- Indicador visual de completadas/actual/pendientes

#### 2. Task Detail Modal ✅
Modal completo con:
- **Editor de notas persistente**: Guarda en el campo `notes` del Task
- **Contexto de relaciones**: Muestra "Viene de" y "Continúa en"
- **Navegación entre tareas relacionadas**: Click para saltar a tarea relacionada
- **Modo Foco**: Botón para entrar en pantalla completa de concentración

#### 3. Modo Focus / Pomodoro ✅
```
┌─────────────────────────────────────────┐
│  ● En foco                       [X]    │
│                                         │
│      Extender endpoint                  │
│                                         │
│         ┌─────────┐                     │
│        /  23:45   \                    │
│        \  restan  /                    │
│         └─────────┘                     │
│                                         │
│      [Pausar]  [↺]                     │
│                                         │
│  [✓ Completar]  [Terminar sesión]      │
│                                         │
│  3 sesiones hoy · 75m enfocado          │
│                                         │
│  ⚡ Modo foco activado                   │
└─────────────────────────────────────────┘
```

**Características:**
- Timer Pomodoro (25 min foco / 5 min break)
- Sonido de celebración al completar (Web Audio API)
- Contador de sesiones del día
- Botón rápido para completar tarea
- Fullscreen mode
- Animación de progreso circular

#### 4. Relaciones entre Tareas ✅
**Tipo de relación: Parent/Child (Pipeline)**

Campos agregados al tipo `Task`:
```typescript
interface Task {
  // ... campos existentes
  notes?: string;           // Notas persistentes
  parentTaskId?: string;    // ID de tarea anterior
  childTaskId?: string;     // ID de tarea siguiente
  order?: number;           // Orden en el pipeline
}
```

**Hooks disponibles:**
- `useTaskParent(taskId)` - Obtiene la tarea anterior
- `useTaskChild(taskId)` - Obtiene la tarea siguiente
- `useSetTaskParent()` - Establece relación padre
- `useSetTaskChild()` - Establece relación hijo
- `useUpdateTaskNotes()` - Actualiza notas de la tarea
- `useConnectTasks()` - Conecta dos tareas
- `useAutoConnectPipeline()` - Auto-conecta en orden

#### 5. TaskForm Mejorado ✅
Al crear una nueva tarea:
- Checkbox "Continuación de: [tarea actual]"
- Si se marca, automáticamente establece `parentTaskId`
- La tarea anterior apunta a la nueva con `childTaskId`

## Flujo de Uso Completo

### Crear Pipeline de Trabajo

1. **Crear primera nota:**
   ```
   "Revisar backend y evaluar endpoint categorías"
   ```

2. **Crear segunda nota (vinculada):**
   ```
   "Extender endpoint de categorías"
   ✓ Checkbox marcado: "Continuación de: Revisar backend"
   ```
   Resultado: `Revisar backend.childTaskId = Extender endpoint.id`

3. **Ver detalle de nota:**
   - Click en "Extender endpoint"
   - Muestra: "Viene de: Revisar backend"
   - Editor de notas visible
   - Click en "Modo Foco"

4. **Modo Foco:**
   - Pantalla completa, solo esa nota
   - Timer de 25 minutos
   - Notas rápidas accesibles
   - Al terminar: sonido + celebración

5. **Completar nota:**
   - Click en checkbox o botón "Completar"
   - Se tacha en el pipeline
   - Siguiente nota se marca como "ACTUAL"

6. **Navegar entre notas:**
   - En el modal, click en "Viene de" o "Continúa en"
   - Salta a esa nota manteniendo el contexto

## Arquitectura de Datos

### Storage (localStorage)
```typescript
// Tasks ahora incluyen:
{
  id: string;
  title: string;
  notes?: string;        // ← NUEVO: Notas persistentes
  parentTaskId?: string; // ← NUEVO: Relación anterior
  childTaskId?: string;  // ← NUEVO: Relación siguiente
  order?: number;        // ← NUEVO: Orden manual
  // ... resto de campos
}
```

### Hooks de Datos

**Notas:**
```tsx
const updateNotes = useUpdateTaskNotes();
updateNotes.mutate({ id: task.id, notes: "SQL: SELECT..." });
```

**Relaciones:**
```tsx
const { data: parent } = useTaskParent(task.id);
const { data: child } = useTaskChild(task.id);
const setParent = useSetTaskParent();
setParent.mutate({ taskId: "new", parentTaskId: "prev" });
```

**Pipeline:**
```tsx
const autoConnect = useAutoConnectPipeline();
autoConnect.mutate(tasks); // Conecta en orden
```

## Componentes Clave

```
src/widgets/task-board/ui/
├── TaskBoard.tsx              # Container principal
├── TaskDetailModal.tsx        # Detalle + notas + relaciones
├── FocusMode.tsx              # Pomodoro fullscreen
├── PipelineView.tsx           # Vista secuencial
└── views/
    └── PipelineView.tsx       # Componente de pipeline

src/entities/task/
├── model/types.ts             # Task con notes, parentTaskId, childTaskId
├── lib/storage.ts             # Funciones CRUD + relaciones
├── hooks/use-tasks.ts         # Hooks básicos + notas + relaciones
└── hooks/use-task-relations.ts # Hooks específicos de pipeline
```

## Características para TDAH (Verificadas)

| Necesidad | Solución | Estado |
|-----------|----------|--------|
| Contexto completo | Header con todo visible | ✅ |
| Flujo secuencial | Pipeline View | ✅ |
| Notas persistentes | Editor en cada tarea + campo notes | ✅ |
| Focus profundo | Modo Foco Pomodoro | ✅ |
| Reducir distracciones | Fullscreen + visual minimalista | ✅ |
| Celebración inmediata | Sonido Web Audio + animación | ✅ |
| Progreso visible | Contador sesiones + tiempo | ✅ |
| Navegación fluida | Click en relaciones Viene/Continúa | ✅ |
| Vinculación rápida | Checkbox "Continuación de" | ✅ |

## Uso de las Funcionalidades

### Agregar Notas a una Tarea
1. Click en la tarea
2. En el modal, click en el área de notas
3. Escribir (soporta texto libre, SQL, links)
4. Click en "Guardar"
5. Las notas se persisten en el campo `task.notes`

### Vincular Nueva Tarea
1. Crear tarea normalmente
2. Si hay una tarea actual, aparece checkbox
3. Marcar "Continuación de: [tarea actual]"
4. Se crea la relación automáticamente

### Navegar Pipeline
- En PipelineView: Ver el flujo visual
- En TaskDetailModal: Click en "Viene de" o "Continúa en"
- Saltas a esa tarea manteniendo el modal abierto

### Entrar Modo Foco
1. Marcar tarea como "Actual" (click en flecha)
2. Click en botón "Foco" (aparece solo en actual)
3. O desde el modal: click "Modo Foco"
4. Timer inicia automáticamente

## Scripts

```bash
npm run build    # Build de producción
npm run dev      # Desarrollo
npm run lint     # ESLint
```

## Todo Funcionando ✅

- ✅ Notas persistentes en cada tarea
- ✅ Relaciones parent/child entre tareas
- ✅ Pipeline view funcional
- ✅ Contexto con navegación
- ✅ Modo Foco Pomodoro
- ✅ Sonidos de celebración
- ✅ Vinculación automática al crear

**El sistema está completo y listo para usar.**
