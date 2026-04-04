"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGlobalEmotes, searchEmotes } from "@shared/lib/seventv-api";
import { getEmoteCollection } from "../lib/storage";
import { emoteKeys } from "../model/query-keys";

export function useGlobalEmotes() {
  return useQuery({
    queryKey: emoteKeys.global(),
    queryFn: fetchGlobalEmotes,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
}

export function useEmoteCollection() {
  return useQuery({
    queryKey: emoteKeys.collection(),
    queryFn: getEmoteCollection,
    staleTime: Infinity,
  });
}

export function useEmoteSearch(query: string) {
  return useQuery({
    queryKey: emoteKeys.search(query),
    queryFn: () => searchEmotes(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
