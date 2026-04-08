# Supabase Implementation Planning

> Estado: **PLANNING** — Pendiente de ejecución
> Última actualización: 2025-07-18
> Estimación total: **3-5 días**

---

## Tabla de Contenidos

1. [Estado Actual del Proyecto](#1-estado-actual-del-proyecto)
2. [Inventario de localStorage](#2-inventario-de-localstorage)
3. [Esquema de Base de Datos](#3-esquema-de-base-de-datos)
4. [Setup de Supabase](#4-setup-de-supabase)
5. [Fases de Implementación](#5-fases-de-implementación)
6. [Inventario de Archivos por Fase](#6-inventario-de-archivos-por-fase)
7. [Notas Técnicas y Decisiones](#7-notas-técnicas-y-decisiones)
8. [Checklist de Progreso](#8-checklist-de-progreso)

---

## 1. Estado Actual del Proyecto

### Stack actual

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| State | Zustand (persist → localStorage) |
| Cache reactivo | TanStack Query v5 |
| UI | shadcn/ui + Radix + Tailwind v4 |
| Animaciones | Framer Motion |
| DnD | dnd-kit |
| Storage | **100% localStorage** — sin backend |

### Arquitectura FSD

```
app/          → Rutas Next.js
src/views/    → Contenedores de página
src/widgets/  → Componentes complejos
src/store/    → Zustand global (prefs de UI)
src/features/ → Flujos de usuario
src/entities/ → Modelos de dominio + hooks + storage
src/shared/   → Primitivas reutilizables
```

### Por qué la migración es viable

- ✅ Los tipos ya tienen `userId?: string` preparado para Supabase
- ✅ Cada entidad tiene su `lib/storage.ts` aislado
- ✅ TanStack Query ya está como intermediario — los hooks no tocan storage directamente
- ✅ `asyncWrap()` ya envuelve funciones síncronas como async
- ✅ Los comentarios dicen "localStorage por ahora, preparado para migrar a Supabase"
- ✅ Ya existe una regla en `.cursor/rules/supabase-bd.mdc` con esquema base

---

## 2. Inventario de localStorage

### 2A. Datos de negocio → Tablas en Supabase

| localStorage Key | Tipo | Entidad | Complejidad |
|---|---|---|---|
| `hyprtodo_tasks` | `Task[]` | Tareas con relaciones parent/child, order, soft-complete | **Alta** |
| `hyprtodo_task_settings` | `TaskSettings` | Objeto simple (2 campos: maxActiveTasks, autoArchiveDays) | **Baja** |
| `hyprtodo_focus_sessions` | `FocusSessionData` | Objeto simple (count, lastDate, totalMinutes) | **Baja** |
| `hyprtodo_projects` | `Project[]` | Array con soft-delete, order, defaults | **Media** |
| `hyprtodo_categories` | `Category[]` | Array con soft-delete, order, defaults | **Media** |
| `hyprtodo_sleep_settings` | `SleepSettings` | Objeto singleton por usuario | **Baja** |
| `hyprtodo_sleep_logs` | `SleepLog[]` | Array de logs diarios con quality rating | **Media** |
| `hyprtodo_work_settings` | `WorkSettings` | Objeto singleton por usuario | **Baja** |
| `hyprtodo_user_emotes` | `UserEmote[]` | Array de emotes coleccionados | **Baja** |

### 2B. Estado de UI → Zustand persist (clave `hyprtask-store`)

| Campo | Descripción | Destino |
|---|---|---|
| `palette` | Tema visual (genshin, zenless, etc.) | → `user_preferences.palette` |
| `viewMode` | Pipeline vs Kanban | → `user_preferences.view_mode` |
| `animatedEmotes` | Pref de emotes animados | → `user_preferences.animated_emotes` |
| `selectedProjectId` | Filtro activo | **Local** — estado efímero |
| `selectedCategoryId` | Filtro activo | **Local** — estado efímero |
| `searchQuery` | Búsqueda actual | **Local** — estado efímero |
| `isColacionOpen` | Modal abierto | **Local** — estado efímero |

### 2C. Keys que no se migran

| localStorage Key | Descripción | Decisión |
|---|---|---|
| `hyprtask-store` | Zustand persist | Se simplifica: solo estado efímero local |
| `theme` (next-themes) | Dark/light mode | No tocar — next-themes lo maneja |

---

## 3. Esquema de Base de Datos

### 3A. Tablas principales

```sql
-- ============================================================================
-- SUPABASE SCHEMA — HyprTask
-- ============================================================================

-- Helper: función para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. USER PREFERENCES (extiende auth.users)
-- ============================================================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  palette TEXT DEFAULT 'genshin' CHECK (palette IN ('genshin', 'zenless', 'wuthering', 'osu', 'mario')),
  view_mode TEXT DEFAULT 'pipeline' CHECK (view_mode IN ('pipeline', 'kanban')),
  animated_emotes BOOLEAN DEFAULT true,
  max_active_tasks INTEGER DEFAULT 5 CHECK (max_active_tasks BETWEEN 1 AND 20),
  auto_archive_days INTEGER DEFAULT 7 CHECK (auto_archive_days BETWEEN 1 AND 90),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 2. PROJECTS
-- ============================================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. CATEGORIES
-- ============================================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. TASKS
-- ============================================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  is_current BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  notes TEXT,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  child_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  "order" INTEGER DEFAULT 0,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para queries frecuentes
CREATE INDEX idx_tasks_user_active ON tasks(user_id) WHERE is_completed = false;
CREATE INDEX idx_tasks_user_current ON tasks(user_id) WHERE is_current = true;
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;
CREATE INDEX idx_tasks_child ON tasks(child_task_id) WHERE child_task_id IS NOT NULL;
CREATE INDEX idx_tasks_project ON tasks(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_tasks_category ON tasks(category_id) WHERE category_id IS NOT NULL;

-- ============================================================================
-- 5. SLEEP SETTINGS (1 por usuario)
-- ============================================================================
CREATE TABLE sleep_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  wakeup_time TIME NOT NULL,
  desired_sleep_hours INTEGER DEFAULT 7 CHECK (desired_sleep_hours BETWEEN 4 AND 12),
  sleep_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER sleep_settings_updated_at
  BEFORE UPDATE ON sleep_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 6. SLEEP LOGS
-- ============================================================================
CREATE TABLE sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  actual_bedtime TIME,
  actual_wakeup TIME,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_sleep_logs_user_date ON sleep_logs(user_id, date DESC);

-- ============================================================================
-- 7. WORK SETTINGS (1 por usuario)
-- ============================================================================
CREATE TABLE work_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration INTEGER DEFAULT 30 CHECK (break_duration >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER work_settings_updated_at
  BEFORE UPDATE ON work_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 8. USER EMOTES
-- ============================================================================
CREATE TABLE user_emotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emote_id TEXT NOT NULL,
  emote_name TEXT NOT NULL,
  animated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, emote_id)
);

-- ============================================================================
-- 9. FOCUS SESSIONS (histórico)
-- ============================================================================
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_focus_sessions_user_date ON focus_sessions(user_id, created_at DESC);
```

### 3B. Row Level Security

```sql
-- ============================================================================
-- RLS — Habilitar en todas las tablas
-- ============================================================================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Políticas — Los usuarios solo ven/manejan sus propios datos
-- ============================================================================

-- user_preferences
CREATE POLICY "user_preferences_crud" ON user_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- projects
CREATE POLICY "projects_crud" ON projects
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- categories
CREATE POLICY "categories_crud" ON categories
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- tasks
CREATE POLICY "tasks_crud" ON tasks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- sleep_settings
CREATE POLICY "sleep_settings_crud" ON sleep_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- sleep_logs
CREATE POLICY "sleep_logs_crud" ON sleep_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- work_settings
CREATE POLICY "work_settings_crud" ON work_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_emotes
CREATE POLICY "user_emotes_crud" ON user_emotes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- focus_sessions
CREATE POLICY "focus_sessions_crud" ON focus_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3C. RPC para operaciones complejas

```sql
-- ============================================================================
-- RPC: Reorder genérico (projects, categories, tasks)
-- ============================================================================
CREATE OR REPLACE FUNCTION reorder_items(
  table_name TEXT,
  item_ids UUID[],
  new_orders INTEGER[]
)
RETURNS void AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..array_length(item_ids, 1) LOOP
    EXECUTE format('UPDATE %I SET "order" = $1 WHERE id = $2', table_name)
      USING new_orders[i], item_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC: Actualizar relación bidireccional de tasks
-- ============================================================================
CREATE OR REPLACE FUNCTION set_task_relation(
  p_task_id UUID,
  p_child_task_id UUID,  -- NULL para desconectar
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Limpiar relación anterior del child viejo
  UPDATE tasks
  SET parent_task_id = NULL
  WHERE child_task_id = p_task_id
    AND user_id = p_user_id
    AND id IS DISTINCT FROM p_child_task_id;

  -- Limpiar relación anterior del parent viejo
  UPDATE tasks
  SET child_task_id = NULL
  WHERE parent_task_id = p_task_id
    AND user_id = p_user_id
    AND id IS DISTINCT FROM p_child_task_id;

  -- Actualizar el task principal
  IF p_child_task_id IS NOT NULL THEN
    UPDATE tasks SET child_task_id = p_child_task_id
      WHERE id = p_task_id AND user_id = p_user_id;
    UPDATE tasks SET parent_task_id = p_task_id
      WHERE id = p_child_task_id AND user_id = p_user_id;
  ELSE
    UPDATE tasks SET child_task_id = NULL
      WHERE id = p_task_id AND user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC: Auto-conectar pipeline
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_connect_pipeline(p_user_id UUID)
RETURNS void AS $$
DECLARE
  task_record RECORD;
  prev_id UUID := NULL;
BEGIN
  FOR task_record IN
    SELECT id FROM tasks
    WHERE user_id = p_user_id AND is_completed = false
    ORDER BY "order" ASC, created_at ASC
  LOOP
    IF prev_id IS NOT NULL THEN
      -- Desconectar relaciones previas de este task
      UPDATE tasks SET parent_task_id = NULL
        WHERE child_task_id = task_record.id AND user_id = p_user_id;
      -- Conectar
      UPDATE tasks SET child_task_id = task_record.id
        WHERE id = prev_id AND user_id = p_user_id;
      UPDATE tasks SET parent_task_id = prev_id
        WHERE id = task_record.id AND user_id = p_user_id;
    ELSE
      -- Primer task: sin parent
      UPDATE tasks SET parent_task_id = NULL
        WHERE id = task_record.id AND user_id = p_user_id;
    END IF;
    prev_id := task_record.id;
  END LOOP;

  -- El último task no tiene child
  IF prev_id IS NOT NULL THEN
    UPDATE tasks SET child_task_id = NULL
      WHERE id = prev_id AND user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RPC: Seed de defaults para nuevo usuario
-- IMPORTANTE: Los IDs deben coincidir EXACTAMENTE con defaults.ts del frontend
-- para que las relaciones foreign key (projectId, categoryId en tasks) funcionen.
-- Si se generan UUIDs nuevos aquí, las tasks existentes con projectId/categoryId
-- referenciarán IDs inexistentes post-migración.
-- ============================================================================
CREATE OR REPLACE FUNCTION seed_user_defaults(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- User preferences
  INSERT INTO user_preferences (user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

  -- Default projects — IDs hardcodeados para coincidir con defaults.ts
  INSERT INTO projects (user_id, id, name, color, icon, is_active, "order") VALUES
    (p_user_id, 'proj-mh-backend',     'MH-Backend',     'blue',   'Server', true, 0),
    (p_user_id, 'proj-wails-letter',   'Wails-Letter-MH','indigo', 'Server', true, 1),
    (p_user_id, 'proj-mh-next',        'MH-Next',        'purple', 'Code',   true, 2),
    (p_user_id, 'proj-cantera',        'La Cantera',     'green',  'Bot',    true, 3)
  ON CONFLICT (id) DO NOTHING;

  -- Default categories — IDs hardcodeados para coincidir con defaults.ts
  INSERT INTO categories (user_id, id, name, color, icon, is_active, "order") VALUES
    (p_user_id, 'cat-issues',   'Issues',   'rose',   'Bug',       true, 0),
    (p_user_id, 'cat-fixes',    'Fixes',    'amber',  'Wrench',    true, 1),
    (p_user_id, 'cat-hotfix',   'Hotfix',   'orange', 'Zap',       true, 2),
    (p_user_id, 'cat-features', 'Features', 'blue',   'Sparkles',  true, 3)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Seed automático al registrar usuario
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM seed_user_defaults(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 4. Setup de Supabase

### 4A. Dependencias a instalar

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 4B. Variables de entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Solo para server-side (service role — NO exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4C. Estructura de archivos nueva

```
src/shared/lib/
├── supabase/
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client (Server Components, Route Handlers)
│   └── middleware.ts      # Auth middleware helper
├── storage.ts             # ← ELIMINAR al final
└── ...

src/shared/hooks/
├── use-auth.ts            # NEW: Auth hook
└── ...

app/
├── auth/
│   ├── login/page.tsx     # NEW: Login page
│   ├── callback/route.ts  # NEW: Auth callback
│   └── ...
├── middleware.ts          # NEW: Next.js middleware (refresh tokens)
└── ...
```

### 4D. Client files

**`src/shared/lib/supabase/client.ts`** — Browser client
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`src/shared/lib/supabase/server.ts`** — Server client
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Middleware ya fue llamado
          }
        },
      },
    }
  )
}
```

**`app/middleware.ts`** — Auth middleware
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas (excepto auth y static)
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Usuario logueado no necesita ver login
  if (user && request.nextUrl.pathname.startsWith('/auth/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 5. Fases de Implementación

### Fase 0: Setup — (0.5 día)

**Objetivo:** Infraestructura base de Supabase + Auth

| # | Tarea | Detalle |
|---|---|---|
| 0.1 | Crear proyecto Supabase | En supabase.com, región就近 |
| 0.2 | Ejecutar migraciones SQL | Sección 3 completa (tablas + RLS + RPCs + triggers) |
| 0.3 | Instalar dependencias | `@supabase/supabase-js` + `@supabase/ssr` |
| 0.4 | Configurar `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 0.5 | Crear `src/shared/lib/supabase/client.ts` | Browser client |
| 0.6 | Crear `src/shared/lib/supabase/server.ts` | Server client |
| 0.7 | Crear `app/middleware.ts` | Auth middleware con refresh tokens |
| 0.8 | Crear `src/shared/hooks/use-auth.ts` | Hook de auth |
| 0.9 | Crear `app/auth/login/page.tsx` | Página de login |
| 0.10 | Crear `app/auth/callback/route.ts` | Auth callback para OAuth |
| 0.11 | Actualizar `app/layout.tsx` | Agregar `AuthProvider` si aplica |

**Entregable:** Auth funcional, usuarios pueden registrarse/loguearse.

---

### Fase 1: Migrar `user_preferences` — (0.5 día)

**Objetivo:** Mover prefs de Zustand persist → Supabase. Validar el patrón end-to-end con la tabla más simple.

**Archivos a modificar:**

| Archivo | Cambio |
|---|---|
| `src/store/index.ts` | Sacar `persist` middleware. Prefs se leen de Supabase. |
| `src/store/slices/theme-slice.ts` | `changePalette()` → upsert a `user_preferences` |
| `src/store/slices/view-mode-slice.ts` | `setViewMode()` → upsert a `user_preferences` |
| `src/store/slices/ui-preferences-slice.ts` | `setAnimatedEmotes()` → upsert a `user_preferences`. `isColacionOpen` queda local. |
| `src/store/hooks.ts` | Ajustar hooks para datos de Supabase |

**Patrón para preferences:**

```typescript
// Ejemplo: theme-slice adaptado
import { createClient } from '@shared/lib/supabase/client';

export class ThemeActionImpl {
  changePalette = async (palette: ThemePalette): Promise<void> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        palette,
      }, { onConflict: 'user_id' });

    this.#set({
      palette,
      themeClasses: computeThemeClasses(palette),
    });
  };
}
```

**Entregable:** Paleta, viewMode y animatedEmotes se persisten en Supabase. El resto del Zustand store queda local (isColacionOpen, filtros).

---

### Fase 2: Migrar `projects` + `categories` — (0.5 día)

**Objetivo:** Entidades de configuración. Sin dependencias de otras tablas.

**Archivos a reescribir:**

| Archivo | Cambio |
|---|---|
| `src/entities/project/lib/storage.ts` | Reemplazar localStorage por Supabase queries |
| `src/entities/project/hooks/use-projects.ts` | Ajustar queryFn (ya async-ready) |
| `src/entities/project/hooks/use-categories.ts` | Ajustar queryFn |
| `src/entities/project/hooks/use-entity-mutations.ts` | Ajustar mutationFn genérico |
| `src/entities/project/model/defaults.ts` | Mantener como fallback, pero Supabase hace seed via trigger |

**Nuevas funciones de storage:**

```typescript
// src/entities/project/lib/storage.ts — Ejemplo
import { createClient } from '@shared/lib/supabase/client';
import type { Project } from '../model/types';

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function saveProject(project: Project): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('projects')
    .upsert({
      ...project,
      user_id: user.id,
    }, { onConflict: 'id' });

  if (error) throw error;
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const orders = orderedIds.map((_, i) => i);
  const { error } = await supabase.rpc('reorder_items', {
    table_name: 'projects',
    item_ids: orderedIds,
    new_orders: orders,
  });

  if (error) throw error;
}
```

**Entregable:** Projects y categories CRUD completo en Supabase con optimistic updates funcionando.

---

### Fase 3: Migrar `tasks` — (1 día) ⚠️ Complejidad alta

**Objetivo:** La entidad más compleja. Relaciones parent/child, reorder, toggle, focus.

**Archivos a reescribir:**

| Archivo | Cambio |
|---|---|
| `src/entities/task/lib/storage.ts` | **REESCRIBIR** — queries Supabase |
| `src/entities/task/hooks/use-task-queries.ts` | Ajustar queryFn |
| `src/entities/task/hooks/use-task-mutations.ts` | Ajustar mutationFn |
| `src/entities/task/hooks/use-task-relations.ts` | Ajustar para usar `set_task_relation` RPC |
| `src/entities/task/hooks/use-focus-sessions.ts` | Adaptar a modelo de tabla `focus_sessions` |
| `src/entities/task/lib/optimistic-helpers.ts` | Sin cambios — opera sobre QueryClient |

**Funciones de storage tasks — mapping:**

| Función localStorage | Supabase equivalente |
|---|---|
| `getTasks()` | `supabase.from('tasks').select('*').eq('user_id', userId)` |
| `getActiveTasks()` | `.eq('is_completed', false)` |
| `saveTask(task)` | `.upsert(task)` |
| `deleteTask(id)` | `.delete().eq('id', id)` o soft-delete |
| `toggleTask(id)` | `.update({ is_completed: !prev }).eq('id', id)` |
| `setCurrentTask(id)` | Batch: quitar is_current de todos, setear en el nuevo |
| `setTaskParent/Child` | `supabase.rpc('set_task_relation', ...)` |
| `reorderTasks(ids)` | `supabase.rpc('reorder_items', ...)` |
| `updateTaskNotes(id, notes)` | `.update({ notes }).eq('id', id)` |
| `updateTaskPriority(id, priority)` | `.update({ priority }).eq('id', id)` |
| `getFocusSessions()` | Query agregada: `COUNT` + `SUM` de hoy |
| `incrementFocusSessions(min)` | `INSERT INTO focus_sessions` |

**⚠️ Cambio de modelo en FocusSessions:**

Antes: un solo objeto `{ count, lastDate, totalMinutes }`
Ahora: tabla `focus_sessions` con una fila por sesión

```typescript
// Nuevo getFocusSessions — agrega datos del día
export async function getFocusSessions(): Promise<FocusSessionData> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0, lastDate: today(), totalMinutes: 0 };

  const today = new Date().toISOString().split('T')[0];
  const startOfDay = `${today}T00:00:00`;

  const { data, error } = await supabase
    .from('focus_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .gte('created_at', startOfDay);

  if (error) throw error;

  const sessions = data ?? [];
  return {
    count: sessions.length,
    lastDate: today,
    totalMinutes: sessions.reduce((sum, s) => sum + s.duration_minutes, 0),
  };
}
```

**Entregable:** Tasks completo en Supabase. Pipeline, Kanban, Focus mode funcionando.

---

### Fase 4: Migrar `sleep` + `work` + `emotes` — (0.75 días)

**Objetivo:** Entidades restantes. Siguen el mismo patrón. Las sub-fases 4A/4B/4C son independientes y pueden ejecutarse en paralelo si hay 2+ desarrolladores.

#### 4A. Sleep — (0.25 día)

| Archivo | Cambio |
|---|---|
| `src/entities/sleep/lib/storage.ts` | Reescribir con Supabase |
| `src/entities/sleep/hooks/use-sleep-settings.ts` | Ajustar hooks |

Las funciones `calculateSleepData`, `generateSleepAlert` son puras — **no se tocan**.

#### 4B. Work — (0.25 día)

| Archivo | Cambio |
|---|---|
| `src/entities/work/lib/storage.ts` | Reescribir con Supabase |
| `src/entities/work/hooks/use-work-settings.ts` | Ajustar hooks |

Las funciones `calculateWorkData` son puras — **no se tocan**.

#### 4C. Emotes — (0.25 día)

| Archivo | Cambio |
|---|---|
| `src/entities/emote/lib/storage.ts` | Reescribir con Supabase |
| `src/entities/emote/hooks/use-emote-queries.ts` | Ajustar queryFn |
| `src/entities/emote/hooks/use-emote-mutations.ts` | Ajustar mutationFn |

Nota: `useGlobalEmotes()` y `useEmoteSearch()` ya usan la API de 7TV — **no se tocan**. Solo la colección del usuario migra.

**Entregable:** Todas las entidades en Supabase. Cero localStorage para datos de negocio.

---

### Fase 5: Limpieza — (0.5 día)

**Objetivo:** Eliminar dead code, actualizar docs.

### 7H. `asyncWrap()` — Desaparece naturalmente

**Decisión:** No hay que "eliminar" `asyncWrap()` como paso explícito — es consecuencia de reescribir las funciones de storage. Las funciones pasan de sync a async real con `await supabase...`. Cuando `saveTask` es `async function`, ya retorna `Promise<void>` directamente, sin necesidad del wrapper.

**Secuencia:**
```
Antes: mutationFn: asyncWrap(saveTask)   // sync → fake async
Después: mutationFn: saveTask            // real async
```

Una vez migrada toda la capa de storage, si `asyncWrap` no se usa en ningún otro lugar, se puede eliminar como cleanup menor. Pero no es trabajo adicional — es resultado.
---

### Fase 6: Data Migration Script — (0.5 día)

**Objetivo:** Script cliente para migrar datos existentes de localStorage → Supabase.

**Archivo nuevo:** `src/shared/lib/migrate-local-data.ts`

```typescript
/**
 * Script de migración: localStorage → Supabase
 * Se ejecuta UNA VEZ por usuario al loguearse por primera vez.
 *
 * Estrategia:
 * 1. Leer todo del localStorage
 * 2. Agregar user_id a cada registro
 * 3. Upsert masivo a Supabase
 * 4. Limpiar localStorage si todo salió bien
 */
export async function migrateLocalDataToSupabase(userId: string) {
  const supabase = createClient();

  // Tasks
  const tasks = storageGetList<Task>('hyprtodo_tasks');
  if (tasks.length > 0) {
    const tasksWithUser = tasks.map(t => ({ ...t, user_id: userId }));
    await supabase.from('tasks').upsert(tasksWithUser);
  }

  // Projects
  const projects = storageGetList<Project>('hyprtodo_projects');
  if (projects.length > 0) {
    const mapped = projects.map(p => ({ ...p, user_id: userId }));
    await supabase.from('projects').upsert(mapped);
  }

  // Categories
  // ... mismo patrón

  // Sleep settings
  // Sleep logs
  // Work settings
  // Emotes
  // User preferences (palette, viewMode, animatedEmotes)

  // Si todo OK, limpiar localStorage
  localStorage.removeItem('hyprtodo_tasks');
  localStorage.removeItem('hyprtodo_projects');
  localStorage.removeItem('hyprtodo_categories');
  // ... etc

  localStorage.removeItem('hyprtask-store'); // Zustand
}
```

**UI:** Agregar un botón/flujo "Migrar mis datos" que aparezca cuando el usuario se loguea y tiene datos locales.

---

## 6. Inventario de Archivos por Fase

### 🔴 REESCRIBIR (6 archivos de storage)

```
src/entities/task/lib/storage.ts      ← Fase 3 — Complejo
src/entities/project/lib/storage.ts   ← Fase 2
src/entities/sleep/lib/storage.ts     ← Fase 4A
src/entities/work/lib/storage.ts      ← Fase 4B
src/entities/emote/lib/storage.ts     ← Fase 4C
src/shared/lib/storage.ts             ← Fase 5 (ELIMINAR)
```

### 🟡 MODIFICAR hooks (~12 archivos)

```
src/entities/task/hooks/use-task-queries.ts        ← Fase 3
src/entities/task/hooks/use-task-mutations.ts       ← Fase 3 (incluye useUpdateTaskPriority)
src/entities/task/hooks/use-task-relations.ts       ← Fase 3
src/entities/task/hooks/use-focus-sessions.ts       ← Fase 3
src/entities/project/hooks/use-projects.ts          ← Fase 2
src/entities/project/hooks/use-categories.ts        ← Fase 2
src/entities/project/hooks/use-entity-mutations.ts  ← Fase 2
src/entities/emote/hooks/use-emote-queries.ts       ← Fase 4C
src/entities/emote/hooks/use-emote-mutations.ts     ← Fase 4C
src/entities/sleep/hooks/use-sleep-settings.ts      ← Fase 4A
src/entities/work/hooks/use-work-settings.ts        ← Fase 4B

src/shared/hooks/use-settings-query.ts              ← Fase 1
```

### 🟡 MODIFICAR store (~5 archivos)

```
src/store/index.ts                       ← Fase 1 — Sacar persist
src/store/slices/theme-slice.ts          ← Fase 1
src/store/slices/view-mode-slice.ts      ← Fase 1
src/store/slices/ui-preferences-slice.ts ← Fase 1
src/store/hooks.ts                       ← Fase 1
```

### 🟡 MODIFICAR config (~3 archivos)

```
app/layout.tsx              ← Fase 0 — AuthProvider
app/page.tsx                ← Fase 0 — Redirect con auth
src/shared/lib/utils.ts     ← Fase 5 — Eliminar asyncWrap
```

### 🟢 NUEVOS archivos (~8 archivos)

```
src/shared/lib/supabase/client.ts       ← Fase 0
src/shared/lib/supabase/server.ts       ← Fase 0
src/shared/hooks/use-auth.ts            ← Fase 0
app/middleware.ts                        ← Fase 0
app/auth/login/page.tsx                 ← Fase 0
app/auth/callback/route.ts              ← Fase 0
src/shared/lib/migrate-local-data.ts    ← Fase 6
.env.local                              ← Fase 0
```

### ✅ NO SE TOCAN (~50+ archivos)

```
src/widgets/**                           (32 archivos TSX)
src/features/**                          (10 archivos TSX)
src/views/**
src/entities/*/model/types.ts           (ya tienen userId?)
src/entities/*/model/query-keys.ts      (las keys no cambian)
src/entities/*/ui/**                     (componentes presentacionales)
src/shared/ui/**
src/shared/lib/array.ts
src/shared/lib/animations.ts
src/shared/lib/audio.ts
src/shared/lib/form.ts
src/shared/lib/format-date.ts
src/shared/lib/seventv-api.ts
src/shared/lib/emote-parser.ts
src/shared/lib/time-utils.ts
src/shared/lib/query-client.tsx
src/shared/lib/query-error-boundary.tsx
src/shared/hooks/use-confirm.tsx
src/shared/hooks/use-countdown-timer.ts
src/shared/hooks/use-entity-config.ts
src/shared/hooks/use-settings-form.ts
src/shared/types/**
src/entities/task/lib/optimistic-helpers.ts
src/entities/task/model/view-mode.ts
src/entities/project/model/available-options.ts
src/entities/project/model/color-constants.ts
src/entities/project/model/defaults.ts
src/entities/project/lib/icons.ts
src/entities/sleep/lib/calculations.ts
src/entities/work/lib/calculations.ts
```

---

## 7. Notas Técnicas y Decisiones

### 7A. Auth — Proveedor

**Decisión:** Empezar con **email/password**. OAuth (Google, GitHub) como mejora posterior.

**Razón:** Minimiza complejidad inicial. Supabase Auth con email es directo. OAuth agrega configuración de providers y callback handling.

### 7B. Server Components vs Client Components

**Decisión:** Mantener el patrón actual (client components con TanStack Query) para las páginas de datos.

**Razón:** La app está diseñada como SPA con TanStack Query. Migrar a Server Components sería una reescritura mayor, no una migración. Supabase client-side funciona perfecto con TanStack Query.

**Excepción:** El `app/middleware.ts` y `app/auth/callback/route.ts` son server-side.

**Error handling en storage functions:** Cada función de storage migrate debe hacer `if (error) throw error` para que TanStack Query detecte el fallo y ejecute `onError` en los optimistic updates. Sin esto, los errores de Supabase se silencian y el optimistic update cree que todo salió bien, causando inconsistencia entre cache y servidor.

### 7C. Realtime

**Decisión:** NO implementar Realtime en esta fase.

**Razón:** La app es single-user por dispositivo. Realtime agrega complejidad y no hay caso de uso multi-dispositivo inmediato. Se puede agregar después como mejora.

### 7D. Offline support

**Decisión:** NO implementar offline en esta fase.

**Razón:** Sin localStorage no hay offline automático. Se puede agregar después con TanStack Query persist + service worker. Por ahora: sin internet = sin datos.

### 7E. IDs — UUID vs IDs actuales

**Decisión:** Mantener los IDs actuales como strings UUID en los tipos, pero Supabase genera UUIDs nativos.

**Razón:** Los tipos ya usan `id: string`. Los IDs como `"proj-mh-backend"` se pueden migrar como strings en la columna `id` de tipo UUID o texto. **Recomiendo cambiar los defaults a UUIDs reales** en el seed function.

### 7F. Task relations — Self-join en Supabase

**Decisión:** Usar las columnas `parent_task_id` y `child_task_id` como self-referencing foreign keys.

**Alternativa considerada:** Tabla separada `task_relations(from_id, to_id, type)`. Descartada porque el modelo actual es 1:1 (un task tiene máximo un parent y un child).

### 7G. Zustand persist — Qué queda local

**Decisión:** Solo estado efímero de UI:
- `selectedProjectId`, `selectedCategoryId`, `searchQuery` (filtros activos)
- `isColacionOpen` (estado de modal)
- `hasActiveFilters` (computed)

**No se persiste más en localStorage.** Si el usuario cambia de navegador, estos se resetean.

### 7H. `asyncWrap()` — Eliminar

**Decisión:** Eliminar `asyncWrap()` de `utils.ts`. Las funciones de storage ahora son async de verdad, no necesitan wrapper.

### 7I. Query Keys — Sin cambios

Las query keys (`taskKeys`, `projectKeys`, `categoryKeys`, etc.) **no cambian**. Son independientes del origen de datos. TanStack Query solo necesita que el `queryFn` retorne los datos.

---

## 8. Checklist de Progreso

### Fase 0: Setup

- [ ] Proyecto Supabase creado
- [ ] Migraciones SQL ejecutadas (tablas + RLS + RPCs + triggers)
- [ ] `@supabase/supabase-js` + `@supabase/ssr` instalados
- [ ] `.env.local` configurado
- [ ] `src/shared/lib/supabase/client.ts` creado
- [ ] `src/shared/lib/supabase/server.ts` creado
- [ ] `app/middleware.ts` creado
- [ ] `src/shared/hooks/use-auth.ts` creado
- [ ] `app/auth/login/page.tsx` creado
- [ ] `app/auth/callback/route.ts` creado
- [ ] `app/layout.tsx` actualizado con AuthProvider
- [ ] Auth funcional (registro + login + logout + session refresh)

### Fase 1: User Preferences

- [ ] `src/store/index.ts` — persist middleware removido
- [ ] `src/store/slices/theme-slice.ts` — changePalette → Supabase
- [ ] `src/store/slices/view-mode-slice.ts` — setViewMode → Supabase
- [ ] `src/store/slices/ui-preferences-slice.ts` — animatedEmotes → Supabase
- [ ] `src/store/hooks.ts` — hooks actualizados
- [ ] Prefs se persisten en Supabase y sobreviven refresh

### Fase 2: Projects + Categories

- [ ] `src/entities/project/lib/storage.ts` — reescrito con Supabase
- [ ] `src/entities/project/hooks/use-projects.ts` — ajustado
- [ ] `src/entities/project/hooks/use-categories.ts` — ajustado
- [ ] `src/entities/project/hooks/use-entity-mutations.ts` — ajustado
- [ ] CRUD de projects funciona con Supabase
- [ ] CRUD de categories funciona con Supabase
- [ ] Reorder funciona con RPC
- [ ] Defaults se seedean al registrar usuario
- [ ] Optimistic updates funcionan

### Fase 3: Tasks

- [ ] `src/entities/task/lib/storage.ts` — reescrito con Supabase
- [ ] `src/entities/task/hooks/use-task-queries.ts` — ajustado
- [ ] `src/entities/task/hooks/use-task-mutations.ts` — ajustado (incluye useUpdateTaskPriority)
- [ ] `src/entities/task/hooks/use-task-relations.ts` — ajustado (usa RPC)
- [ ] `src/entities/task/hooks/use-focus-sessions.ts` — ajustado (nuevo modelo)
- [ ] CRUD de tasks funciona
- [ ] Toggle task funciona
- [ ] Set current task funciona
- [ ] Pipeline parent/child funciona via RPC
- [ ] Auto-connect pipeline funciona via RPC
- [ ] Reorder funciona via RPC
- [ ] Focus sessions: INSERT y query agregada funcionan
- [ ] Pipeline View funciona end-to-end
- [ ] Kanban View funciona end-to-end
- [ ] Focus Mode funciona end-to-end

### Fase 4A: Sleep

- [ ] `src/entities/sleep/lib/storage.ts` — reescrito
- [ ] `src/entities/sleep/hooks/use-sleep-settings.ts` — ajustado
- [ ] Sleep settings CRUD funciona
- [ ] Sleep logs CRUD funciona
- [ ] Sleep dashboard funciona

### Fase 4B: Work

- [ ] `src/entities/work/lib/storage.ts` — reescrito
- [ ] `src/entities/work/hooks/use-work-settings.ts` — ajustado
- [ ] Work settings CRUD funciona

### Fase 4C: Emotes

- [ ] `src/entities/emote/lib/storage.ts` — reescrito
- [ ] `src/entities/emote/hooks/use-emote-queries.ts` — ajustado
- [ ] `src/entities/emote/hooks/use-emote-mutations.ts` — ajustado
- [ ] Emote collection CRUD funciona
- [ ] 7TV global emotes siguen funcionando (sin cambios)

### Fase 5: Limpieza

- [ ] `src/shared/lib/storage.ts` — eliminado
- [ ] `asyncWrap()` — eliminado de utils.ts
- [ ] Zustand store simplificado (solo estado efímero local)
- [ ] `userId?` → `userId` obligatorio en tipos (donde aplique)
- [ ] Imports muertos eliminados
- [ ] `CLAUDE.md` actualizado
- [ ] `AGENTS.md` actualizado
- [ ] `.cursor/rules/` actualizados
- [ ] `npm run build` sin errores
- [ ] `npm run lint` sin errores
- [ ] No quedan referencias a localStorage para datos de negocio

### Fase 6: Data Migration

- [ ] `src/shared/lib/migrate-local-data.ts` creado
- [ ] UI de migración agregada (botón/flujo)
- [ ] Migración probada: datos locales aparecen en Supabase
- [ ] localStorage limpiado post-migración
- [ ] Flujo de primer login funciona sin errores

---

## Resumen de Esfuerzo

| Fase | Descripción | Estimación |
|---|---|---|
| **0** | Setup Supabase + Auth | 0.5 día |
| **1** | User Preferences (Zustand → Supabase) | 0.5 día |
| **2** | Projects + Categories | 0.5 día |
| **3** | Tasks (la más compleja) | 1 día |
| **4A** | Sleep | 0.25 día |
| **4B** | Work | 0.25 día |
| **4C** | Emotes | 0.25 día |
| **5** | Limpieza y docs | 0.5 día |
| **6** | Data migration script | 0.5 día |
| **TOTAL** | | **3.75 días** |

---

## 9. Correcciones post-revisión (v2)

### 9A. `useUpdateTaskPriority` — omission en Fase 3

El plan no incluía `useUpdateTaskPriority` (mutation que cambia `priority` de una tarea in-place). Existe en la codebase y se usa en `useDetailModalShortcuts.ts` para shortcuts de teclado. Se agregó al checklist de Fase 3.

### 9B. Error handling en funciones de storage

Las funciones de storage actuales hacen **silent returns** cuando fallan (no hay `throw`). Al migrar a Supabase, cada función debe hacer `if (error) throw error` para que TanStack Query pueda detectar el error y ejecutar `onError` en los optimistic updates. Las funciones resultarán en `Promise<void>` en vez de `void`, y propagarán errores correctamente.

### 9C. Seed SQL IDs desalineados (crítico)

Los IDs en `seed_user_defaults` SQL no coincidían con los IDs hardcodeados en `defaults.ts` (`"proj-mh-backend"`, `"proj-wails-letter"`, etc.). Ahora usan los **mismos IDs exactos** para que las foreign keys (`projectId`, `categoryId` en tasks) funcionen correctamente tras la migración de datos.

### 9D. `asyncWrap()` — no es un paso, es consecuencia

`asyncWrap()` no se "elimina" como paso explícito de limpieza. Desaparece naturalmente cuando las funciones de storage pasan de sync (`void`) a async real (`Promise<void>`). La sección 7H se actualizó para reflejar esto.

### 9E. `use-settings-query.ts` — no necesita cambios de firma

El factory `createSettingsHooks` no cambia. Las funciones `getSettings` y `saveSettings` que le pasás como config son las que se reescriben en cada entidad. La interfaz de hooks queda intacta.

### 9F. Fase 4 desglosada en 4A/4B/4C

Sleep, Work y Emotes son 3 sistemas independientes sin dependencias cruzadas. Ahora desglosados en sub-fases con estimación individual (0.25 día cada una). Total Fase 4: 0.75 días en vez de 1 día.

### 9G. `getFocusSessions` — timezone handling

La query agregada de focus sessions necesita manejo de timezone. El día "hoy" se calcula con `new Date().toISOString().split('T')[0]` en UTC. Si el usuario está en UTC-X, el rango de sesiones debería usar la timezone del navegador. Considerar usar una RPC que calcule `startOfDay` y `endOfDay` en la timezone del usuario.

---

> **Nota final:** El código ya dice "preparado para migrar a Supabase" en los comentarios. Y lo está. La arquitectura FSD con storage aislado, tipos con `userId?` y TanStack Query como intermediario hacen que esto sea predecible. El único agregado nuevo real es la capa de Auth.