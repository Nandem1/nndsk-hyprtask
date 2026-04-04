"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { asyncWrap } from "@shared/lib/utils";
import {
  addEmoteToCollection,
  removeEmoteFromCollection,
  getEmoteCollection,
} from "../lib/storage";
import { emoteKeys } from "../model/query-keys";
import type { UserEmote } from "../model/types";

export function useAddEmote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(addEmoteToCollection),
    onMutate: async (emote: UserEmote) => {
      await queryClient.cancelQueries({ queryKey: emoteKeys.collection() });
      const previous = queryClient.getQueryData<UserEmote[]>(emoteKeys.collection());
      queryClient.setQueryData<UserEmote[]>(emoteKeys.collection(), (old) => {
        if (!old) return [emote];
        if (old.some((e) => e.id === emote.id)) return old;
        return [...old, emote];
      });
      return { previous };
    },
    onError: (_err, _emote, context) => {
      if (context?.previous) {
        queryClient.setQueryData(emoteKeys.collection(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: emoteKeys.collection() });
    },
  });
}

export function useRemoveEmote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(removeEmoteFromCollection),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: emoteKeys.collection() });
      const previous = queryClient.getQueryData<UserEmote[]>(emoteKeys.collection());
      queryClient.setQueryData<UserEmote[]>(emoteKeys.collection(), (old) =>
        old ? old.filter((e) => e.id !== id) : [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(emoteKeys.collection(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: emoteKeys.collection() });
    },
  });
}

export function useRebuildCollection() {
  const queryClient = useQueryClient();
  return () => {
    const fresh = getEmoteCollection();
    queryClient.setQueryData(emoteKeys.collection(), fresh);
  };
}
