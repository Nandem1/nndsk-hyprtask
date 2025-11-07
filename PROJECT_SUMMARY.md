HYPRTASKS - SISTEMA DE GESTIÓN DE TAREAS Y SUEÑO
VISIÓN DEL PROYECTO

Aplicación que combina un sistema de tareas visualmente impresionante con control inteligente de sueño, diseñada específicamente para ayudar en la gestión del tiempo de estudio y descanso.
CARACTERÍSTICAS PRINCIPALES
PRIORIDAD 1: CONTROL DE SUEÑO INTELIGENTE

    Configuración de alarma personalizada

    Cálculo automático de horas de sueño disponibles

    Recordatorios visuales cuando se acerca la hora de dormir

    Estadísticas de sueño semanales

    Modo "Enfoque de Estudio" que muestra tiempo restante discreto

SISTEMA DE TAREAS (SECUNDARIO)

    Gestión de tareas con prioridades

    Integración con control de sueño

    Recordatorios inteligentes

    Organización por proyectos/etiquetas

ESTÉTICA VISUAL

    Animaciones fluidas inspiradas en Hyprland

    Efectos glassmorphism y backdrop blur

    Gradientes dinámicos y transiciones suaves

    Interfaz minimalista pero visualmente rica

    Modo oscuro/claro elegante

STACK TECNOLÓGICO
FRONTEND

    Next.js con App Router

    TypeScript

    Tailwind CSS

    Shadcn/ui

    Framer Motion

BACKEND & BASE DE DATOS

    Supabase

    PostgreSQL

ESTILIZACIÓN

    CSS Variables

    Tailwind Config personalizado

    Lucide React para iconos

ESTRUCTURA DE DATOS - ESQUEMA SUPABASE
CONFIGURACIÓN DE SUEÑO (PRIORITARIO)

-- Configuración de sueño del usuario
CREATE TABLE sleep_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  bedtime TIME NOT NULL,
  wakeup_time TIME NOT NULL,
  min_sleep_hours INTEGER DEFAULT 7,
  sleep_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Registro de sueño diario
CREATE TABLE sleep_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  actual_bedtime TIME,
  actual_wakeup TIME,
  quality_rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

TAREAS (SECUNDARIO)

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  estimated_duration INTEGER,
  due_date TIMESTAMP,
  affects_sleep BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

ESTRUCTURA DEL PROYECTO

app/
├── layout.tsx
├── page.tsx
├── globals.css
├── (sleep)/
│   ├── page.tsx
│   ├── components/
│   │   ├── sleep-timer.tsx
│   │   ├── sleep-config.tsx
│   │   ├── sleep-stats.tsx
│   │   └── wind-down.tsx
├── (tasks)/
│   ├── page.tsx
│   └── components/
├── components/
│   ├── ui/
│   ├── header.tsx
│   ├── sleep-overview.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase.ts
│   ├── sleep-calculations.ts
│   ├── utils.ts
│   └── animations.ts
└── types/
    └── index.ts

COMPONENTES CLAVE DEL CONTROL DE SUEÑO
SLEEP TIMER

    Muestra tiempo hasta hora de dormir en formato hh:mm

    Calcula horas efectivas de sueño disponibles

    Barra de progreso circular hacia hora de dormir

    Indicador visual de "deberías prepararte para dormir"

SLEEP CONFIG

    Configuración de hora de dormir y despertar

    Horas mínimas de sueño requeridas

    Activación/desactivación de recordatorios

    Rutinas pre-sueño personalizables

SLEEP STATS

    Gráficos de patrones de sueño semanal

    Calidad de sueño promedio

    Tendencias y recomendaciones

    Comparativa sueño ideal vs real

WIND DOWN

    Rutina guiada para prepararse para dormir

    Ejercicios de respiración

    Recordatorio de apagar pantallas

    Música/sonidos relajantes

ALGORITMOS DE CÁLCULO
CÁLCULO DE TIEMPO DE SUEÑO

    Considera 30-45 minutos para rutina pre-sueño

    Calcula horas efectivas basadas en ciclos de 90 minutos

    Sugiere hora óptima de dormir para despertarse renovado

ALERTAS INTELIGENTES

    2 horas antes: "Termina actividades intensas"

    1 hora antes: "Comienza tu rutina de relajación"

    30 minutos antes: "Apaga pantallas y prepárate para dormir"

PALETA DE COLORES Y DISEÑO
COLORES BASE

    Fondos: Escala de grises 50-950

    Acentos: Purpura (#8b5cf6), Azul (#3b82f6), Rosa (#ec4899)

    Gradientes: Linear-gradient(135deg, purple, blue, pink)

EFECTOS VISUALES

    Backdrop blur para efectos glassmorphism

    Border gradients en componentes interactivos

    Shadow glows para elementos importantes

    Scale transforms en hover states

FLUJO DE USUARIO PRINCIPAL

    Configuración Inicial

        Usuario establece hora ideal de dormir/despertar

        Define horas mínimas de sueño requeridas

        Configura recordatorios y rutinas

    Uso Diario

        App muestra tiempo restante hasta hora de dormir

        Alertas progresivas (2h, 1h, 30min antes)

        Sugerencias para terminar actividades intensas

    Seguimiento Nocturno

        Registro de hora real de sueño

        Evaluación de calidad de sueño

        Estadísticas y patrones semanales

TIPOGRAFÍA Y ESPACIADO

    Fuente principal: Inter o Geist

    Espaciado generoso entre elementos

    Jerarquía clara de información

    Contraste optimizado para lectura prolongada

CONSIDERACIONES DE USABILIDAD

    Componente de sueño siempre visible durante estudio

    Notificaciones no intrusivas pero efectivas

    Modo "no molestar" para sesiones de estudio intenso

    Sincronización multi-dispositivo