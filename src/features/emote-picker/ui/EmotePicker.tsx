"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { getEmoteUrl } from "@/shared/lib/seventv-api";
import {
  Plus,
  Minus,
  Loader2,
  Search,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useEmotePicker } from "../hooks/useEmotePicker";
import type { SevenTvEmote } from "@/shared/lib/seventv-api";

interface EmotePickerProps {
  onInsert?: (name: string) => void;
  onClose?: () => void;
}

const TABS = [
  { id: "global" as const, label: "Globales", icon: Globe },
  { id: "collection" as const, label: "Colección", icon: Heart },
  { id: "search" as const, label: "Buscar", icon: Search },
] as const;

const EmoteItem = memo(function EmoteItem({
  emote,
  isInCollection,
  onToggle,
  onInsert,
}: {
  emote: SevenTvEmote;
  isInCollection: boolean;
  onToggle: (emote: SevenTvEmote) => void;
  onInsert?: (name: string) => void;
}) {
  const handleToggle = useCallback(() => {
    onToggle(emote);
  }, [emote, onToggle]);

  const handleInsert = useCallback(() => {
    if (!isInCollection) onToggle(emote);
    onInsert?.(emote.name);
  }, [isInCollection, emote, onToggle, onInsert]);

  return (
    <div className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <button
        onClick={handleInsert}
        className="flex items-center gap-2 flex-1 min-w-0 text-left"
        title={`Insertar ${emote.name}`}
      >
        <Image
          src={getEmoteUrl(emote.id, "1x")}
          alt={emote.name}
          width={28}
          height={28}
          unoptimized
        />
        <span className="text-sm truncate">{emote.name}</span>
        {emote.animated && (
          <Sparkles className="size-3 text-muted-foreground shrink-0" />
        )}
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "h-7 w-7 p-0 shrink-0 transition-colors",
          isInCollection
            ? "text-primary hover:text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
        title={isInCollection ? "Quitar de colección" : "Agregar a colección"}
      >
        {isInCollection ? (
          <Minus className="size-3.5" />
        ) : (
          <Plus className="size-3.5" />
        )}
      </Button>
    </div>
  );
});

export function EmotePicker({ onInsert }: EmotePickerProps) {
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
    <div className="w-80 max-h-96 flex flex-col">
      <div className="flex items-center border-b border-border px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px",
                state.tab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {(state.tab !== "collection" || state.searchQuery) && (
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                state.tab === "search" ? "Buscar en 7TV..." : "Filtrar..."
              }
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" />
            Buscando...
          </div>
        ) : displayEmotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            {state.tab === "collection"
              ? "Tu colección está vacía"
              : "Sin resultados"}
          </div>
        ) : (
          displayEmotes.map((emote) => (
            <EmoteItem
              key={emote.id}
              emote={emote}
              isInCollection={collectionIds.has(emote.id)}
              onToggle={handleToggle}
              onInsert={onInsert}
            />
          ))
        )}
      </div>

      <div className="border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {displayEmotes.length} emote{displayEmotes.length !== 1 ? "s" : ""}
          {" · "}
          {collectionIds.size} en colección
        </p>
      </div>
    </div>
  );
}
