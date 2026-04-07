"use client";

import { useState, useMemo, memo } from "react";
import Image from "next/image";
import { getEmoteUrl } from "@/shared/lib/seventv-api";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useEmoteCollection } from "@/entities/emote";

const EmoteButton = memo(function EmoteButton({
  id,
  name,
  animated,
  onSelect,
}: {
  id: string;
  name: string;
  animated: boolean;
  onSelect: (name: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(name)}
      title={`${name}${animated ? " (animated)" : ""}`}
      className="flex items-center justify-center p-1.5 rounded-md hover:bg-muted/80 transition-colors"
    >
      <Image
        src={getEmoteUrl(id, "1x")}
        alt={name}
        width={28}
        height={28}
        unoptimized
      />
    </button>
  );
});

interface EmoteGridPickerProps {
  onInsert: (name: string) => void;
}

export function EmoteGridPicker({ onInsert }: EmoteGridPickerProps) {
  const { data: collection = [] } = useEmoteCollection();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return collection;
    const q = search.toLowerCase();
    return collection.filter((e) => e.name.toLowerCase().includes(q));
  }, [collection, search]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar emotes..."
          className="h-8 pl-8 text-sm"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground">
          {collection.length === 0
            ? "Tu colección está vacía"
            : "Sin resultados"}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-0.5 max-h-[220px] overflow-y-auto">
          {filtered.map((emote) => (
            <EmoteButton
              key={emote.id}
              id={emote.id}
              name={emote.name}
              animated={emote.animated}
              onSelect={onInsert}
            />
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground text-center">
        {filtered.length} emote{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
