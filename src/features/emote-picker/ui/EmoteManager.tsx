"use client";

import { memo, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { getEmoteUrl } from "@/shared/lib/seventv-api";
import { Plus, Minus, Loader2, Search, Globe, Heart, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useEmotePicker } from "../hooks/useEmotePicker";
import type { SevenTvEmote } from "@/shared/lib/seventv-api";

const TABS = [
  { id: "global" as const, label: "Globales", icon: Globe },
  { id: "collection" as const, label: "Mi colección", icon: Heart },
  { id: "search" as const, label: "Buscar en 7TV", icon: Search },
] as const;

const EmoteItem = memo(function EmoteItem({
  emote,
  isInCollection,
  onToggle,
}: {
  emote: SevenTvEmote;
  isInCollection: boolean;
  onToggle: (emote: SevenTvEmote) => void;
}) {
  return (
    <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <img
        src={getEmoteUrl(emote.id, "2x", emote.animated)}
        alt={emote.name}
        className="h-10 w-10 shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{emote.name}</span>
          {emote.animated && (
            <Sparkles className="size-3 text-muted-foreground shrink-0" />
          )}
        </div>
      </div>
      <Button
        variant={isInCollection ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(emote)}
        className={cn(
          "h-8 gap-1.5 shrink-0 transition-all",
          isInCollection
            ? "gap-1.5"
            : "hover:border-primary/50",
        )}
      >
        {isInCollection ? (
          <>
            <Minus className="size-3.5" />
            <span className="hidden sm:inline">En colección</span>
          </>
        ) : (
          <>
            <Plus className="size-3.5" />
            <span className="hidden sm:inline">Agregar</span>
          </>
        )}
      </Button>
    </div>
  );
});

export function EmoteManager() {
  const {
    state,
    displayEmotes,
    collectionIds,
    isLoading,
    setTab,
    setSearchQuery,
    addEmote,
    removeEmote,
  } = useEmotePicker();

  const handleToggle = useCallback(
    (emote: SevenTvEmote) => {
      const userEmote = {
        id: emote.id,
        name: emote.name,
        animated: emote.animated,
      };
      if (collectionIds.has(emote.id)) {
        removeEmote(emote.id);
      } else {
        addEmote(userEmote);
      }
    },
    [collectionIds, addEmote, removeEmote],
  );

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center border-b border-border bg-muted/30">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                state.tab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
        <div className="ml-auto pr-3">
          <span className="text-xs text-muted-foreground">
            {collectionIds.size} emote{collectionIds.size !== 1 ? "s" : ""} guardado{collectionIds.size !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="p-3 border-b border-border bg-muted/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              state.tab === "search"
                ? "Buscar en el catálogo completo de 7TV..."
                : state.tab === "collection"
                  ? "Buscar en tu colección..."
                  : "Filtrar emotes globales..."
            }
            className="h-9 pl-9"
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" />
            Buscando...
          </div>
        ) : displayEmotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Heart className="size-8 mb-2 opacity-50" />
            <p className="text-sm">
              {state.tab === "collection"
                ? "Tu colección está vacía. Explora los emotes globales o busca para agregar."
                : "Sin resultados"}
            </p>
          </div>
        ) : (
          <div className="grid gap-0.5">
            {displayEmotes.map((emote) => (
              <EmoteItem
                key={emote.id}
                emote={emote}
                isInCollection={collectionIds.has(emote.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
