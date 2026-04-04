import { useState, useMemo } from "react";
import { useGlobalEmotes, useEmoteCollection, useEmoteSearch, useAddEmote, useRemoveEmote } from "@/entities/emote";
import type { SevenTvEmote } from "@/shared/lib/seventv-api";
import type { EmotePickerState } from "../model/types";

export function useEmotePicker() {
  const [state, setState] = useState<EmotePickerState>({
    tab: "global",
    searchQuery: "",
  });

  const { data: globalEmotes = [] } = useGlobalEmotes();
  const { data: collection = [] } = useEmoteCollection();
  const searchResult = useEmoteSearch(state.searchQuery);
  const addEmote = useAddEmote();
  const removeEmote = useRemoveEmote();

  const collectionIds = useMemo(
    () => new Set(collection.map((e) => e.id)),
    [collection],
  );

  const collectionAsSeventv = useMemo<SevenTvEmote[]>(
    () => collection.map((e) => ({ ...e, flags: 0 })),
    [collection],
  );

  const filteredGlobals = useMemo(() => {
    const safe = globalEmotes.filter((e) => !(e.flags & 65536));
    if (!state.searchQuery || state.tab !== "global") return safe;
    const q = state.searchQuery.toLowerCase();
    return safe.filter((e) => e.name.toLowerCase().includes(q));
  }, [globalEmotes, state.searchQuery, state.tab]);

  const displayEmotes: SevenTvEmote[] = useMemo(() => {
    if (state.tab === "collection") return collectionAsSeventv;
    if (state.tab === "search") return searchResult.data ?? [];
    return filteredGlobals;
  }, [state.tab, collectionAsSeventv, filteredGlobals, searchResult.data]);

  return {
    state,
    displayEmotes,
    collectionIds,
    isLoading: state.tab === "search" && searchResult.isLoading,
    setTab: (tab: EmotePickerState["tab"]) =>
      setState((s) => ({ ...s, tab, searchQuery: "" })),
    setSearchQuery: (q: string) =>
      setState((s) => ({ ...s, searchQuery: q })),
    addEmote: addEmote.mutate,
    removeEmote: removeEmote.mutate,
  };
}
