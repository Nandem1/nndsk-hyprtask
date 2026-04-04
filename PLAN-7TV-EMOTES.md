# Planning: Integración de emotes 7TV

## Contexto de la API

### V3 REST — catálogo global

```
GET https://7tv.io/v3/emote-sets/global
```

Sin auth. Devuelve ~50 emotes curados. Cada entrada en `emotes[]` tiene esta forma:

```json
{
  "id": "01FCY771D800007PQ2DF3GDTN6",
  "name": "RainTime",
  "data": {
    "id": "01FCY771D800007PQ2DF3GDTN6",
    "name": "RainTime",
    "animated": true,
    "flags": 256,
    "host": {
      "url": "//cdn.7tv.app/emote/01FCY771D800007PQ2DF3GDTN6",
      "files": [
        { "name": "1x.webp", "static_name": "1x_static.webp", "width": 32, "frame_count": 15 },
        { "name": "2x.webp", "static_name": "2x_static.webp", "width": 64, "frame_count": 15 },
        { "name": "3x.webp", "static_name": "3x_static.webp", "width": 96, "frame_count": 15 },
        { "name": "4x.webp", "static_name": "4x_static.webp", "width": 128, "frame_count": 15 }
      ]
    }
  }
}
```

> **Atención:** `host.url` viene sin protocolo (`//cdn.7tv.app/...`). Siempre prefijar `https:` al construir URLs.
> Usar `data.id` (no `emotes[].id`) para construir la URL del CDN.

### CDN de imágenes

```
https://cdn.7tv.app/emote/{id}/1x.webp          // animado 32px
https://cdn.7tv.app/emote/{id}/1x_static.webp   // frame estático 32px
https://cdn.7tv.app/emote/{id}/2x.webp          // animado 64px
https://cdn.7tv.app/emote/{id}/4x.webp          // animado 128px
```

| Size | Resolución |
|------|------------|
| `1x` | 32×32 px |
| `2x` | 64×64 px |
| `3x` | 96×96 px |
| `4x` | 128×128 px |

### V4 GraphQL — búsqueda ampliada

```
POST https://api.7tv.app/v4/gql
```

Sin auth para lecturas. Útil si los ~50 globales no alcanzan y se quiere acceso al catálogo completo de 1M+ emotes.

```graphql
query {
  emotes {
    search(query: "pepe", page: 1, per_page: 20) {
      items {
        id
        default_name
        animated
        images { url mime scale width height frame_count }
      }
      total_count
    }
  }
}
```

### Flags relevantes (bitmask)

| Valor | Nombre | Descripción |
|-------|--------|-------------|
| `1` | Private | No público |
| `256` | ZeroWidth | Se superpone al emote anterior |
| `65536` | Sexual | NSFW |

---

## Estructura de archivos implementada

```
src/shared/lib/seventv-api.ts          → Cliente API (fetch + tipos)
src/shared/lib/emote-parser.ts         → Parser: texto → tokens
src/shared/ui/rich-text.tsx            → Componente RichText

src/entities/emote/
  model/types.ts                       → UserEmote
  model/query-keys.ts                  → emoteKeys factory
  lib/storage.ts                       → Colección personal (localStorage)
  hooks/use-emote-queries.ts           → useGlobalEmotes, useEmoteSearch, useEmoteCollection
  hooks/use-emote-mutations.ts         → useAddEmote, useRemoveEmote, useRebuildCollection
  index.ts                             → Barrel export

src/features/emote-picker/
  model/types.ts                       → EmotePickerState
  hooks/useEmotePicker.ts              → Hook principal del picker
  ui/EmotePicker.tsx                   → UI con tabs (Globales / Colección / Buscar)
  index.ts                             → Barrel export

src/store/slices/emote-prefs-slice.ts  → Zustand slice (animatedEmotes)
```

### Integración en componentes existentes (títulos + notas)

| Componente | Cambio |
|---|---|
| `PipelineStep.tsx` | `<RichText>` en título + preview de notas |
| `KanbanTaskCard.tsx` | `<RichText>` en título |
| `TaskDetailModal.tsx` | `<RichText>` en título + notas en modo vista + botón picker + EmotePicker inline |
| `FocusMode.tsx` | `<RichText>` en título |

---

## Fase 1 — Capa de datos ✅ COMPLETA

### Archivos creados

- `src/shared/lib/seventv-api.ts` — `fetchGlobalEmotes()`, `searchEmotes()`, `getEmoteUrl()`
- `src/entities/emote/model/types.ts` — `UserEmote` type
- `src/entities/emote/model/query-keys.ts` — `emoteKeys` factory
- `src/entities/emote/lib/storage.ts` — CRUD sobre `hyprtask_user_emotes` en localStorage
- `src/entities/emote/hooks/use-emote-queries.ts` — `useGlobalEmotes`, `useEmoteCollection`, `useEmoteSearch`
- `src/entities/emote/hooks/use-emote-mutations.ts` — `useAddEmote`, `useRemoveEmote`, `useRebuildCollection`
- `src/entities/emote/index.ts` — Barrel export

---

## Fase 2 — Renderer ✅ COMPLETA

### Archivos creados

- `src/shared/lib/emote-parser.ts` — `parseEmotes(text, collection)` → `EmoteToken[]`
- `src/shared/ui/rich-text.tsx` — `<RichText>` con soporte inline/block, emoteSize, animated preference

### Integraciones

- `PipelineStep.tsx` — título + preview de notas con `<RichText>`
- `KanbanTaskCard.tsx` — título con `<RichText>`
- `TaskDetailModal.tsx` — título con `<RichText emoteSize="2x">`, notas con `<RichText emoteSize="2x">`
- `FocusMode.tsx` — título con `<RichText emoteSize="2x">`

---

## Fase 3 — Picker ✅ COMPLETA

### Archivos creados

- `src/features/emote-picker/model/types.ts` — `EmotePickerState`
- `src/features/emote-picker/hooks/useEmotePicker.ts` — Hook con tabs, filtrado, collectionIds
- `src/features/emote-picker/ui/EmotePicker.tsx` — UI con 3 tabs (Globales, Colección, Buscar)
- `src/features/emote-picker/index.ts` — Barrel export

### Integración

- `TaskDetailModal.tsx` — Botón 😊 junto a "Editar" que despliega EmotePicker inline
- Inserción de nombre de emote en posición del cursor del Textarea

---

## Fase 4 — Pulido ✅ COMPLETA

- ✅ **NSFW filter** — Emotes con `flags & 65536` filtrados del catálogo global
- ✅ **Preferencia de animación** — Zustand slice `emote-prefs-slice` con `animatedEmotes` flag, conectado a RichText
- ✅ **Badge de animado** — Ícono ✨ junto al nombre de emotes animados en el picker
- ✅ **Caché de sesión** — TanStack Query `staleTime: Infinity`, `gcTime: 1h`
- ⬜ **ZeroWidth** — No implementado (complejidad visual no justificada para notas de texto)

---

## Consideraciones globales

- El texto guardado es siempre texto plano. No hay serialización especial.
- Si se elimina un emote de la colección, las notas/títulos muestran el nombre en texto.
- El matching es en render time. Ninguna nota se re-guarda cuando cambia la colección.
- FSD boundaries respetadas: `shared` no importa de `entities`. El parser recibe la colección como parámetro.
- El picker usa 3 tabs: Globales (cache local), Colección (localStorage), Buscar (GraphQL V4 remoto).

## Hooks disponibles

```typescript
// Queries
useGlobalEmotes()       // Catálogo global 7TV (~50 emotes)
useEmoteCollection()    // Colección personal del usuario
useEmoteSearch(query)   // Búsqueda remota via GraphQL V4

// Mutations
useAddEmote()           // Agregar emote a colección (optimistic)
useRemoveEmote()        // Quitar emote de colección (optimistic)
useRebuildCollection()  // Forzar refresh del cache

// Store
useEmotePrefsState()    // { animatedEmotes }
useEmotePrefs()         // { animatedEmotes, setAnimatedEmotes }
```

## localStorage keys

| Key | Tipo |
|-----|------|
| `hyprtask_user_emotes` | `UserEmote[]` |
| `hyprtask-store` (persist) | `animatedEmotes` field |
