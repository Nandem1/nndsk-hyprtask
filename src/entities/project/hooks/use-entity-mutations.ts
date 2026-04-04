"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface EntityMutationKeys {
  all: QueryKey;
  listAll: QueryKey;
  listActive: QueryKey;
}

/**
 * Factory hook para mutations de upsert (crear/editar) con optimistic updates.
 * Usado por useSaveProject y useSaveCategory.
 */
export function useUpsertMutation<T extends { id: string }>(
  mutationFn: (item: T) => Promise<void>,
  keys: EntityMutationKeys,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newItem: T) => {
      await queryClient.cancelQueries({ queryKey: keys.all });

      const previous = queryClient.getQueryData<T[]>(keys.listAll);

      queryClient.setQueryData<T[]>(keys.listAll, (old) => {
        if (!old) return [newItem];
        const idx = old.findIndex((i) => i.id === newItem.id);
        if (idx >= 0) {
          const updated = [...old];
          updated[idx] = newItem;
          return updated;
        }
        return [...old, newItem];
      });

      return { previous };
    },
    onError: (_err, _item, context) => {
      if (context?.previous) {
        queryClient.setQueryData(keys.listAll, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

/**
 * Factory hook para mutations de delete (soft delete) con optimistic updates.
 * Usado por useDeleteProject y useDeleteCategory.
 */
export function useDeleteEntityMutation<T extends { id: string; isActive: boolean }>(
  mutationFn: (id: string) => Promise<void>,
  keys: EntityMutationKeys,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: keys.all });

      const previousAll = queryClient.getQueryData<T[]>(keys.listAll);
      const previousActive = queryClient.getQueryData<T[]>(keys.listActive);

      queryClient.setQueryData<T[]>(keys.listAll, (old) =>
        old?.map((item) => (item.id === id ? { ...item, isActive: false } : item)),
      );
      queryClient.setQueryData<T[]>(keys.listActive, (old) =>
        old?.filter((item) => item.id !== id),
      );

      return { previousAll, previousActive };
    },
    onError: (_err, _id, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(keys.listAll, context.previousAll);
      }
      if (context?.previousActive) {
        queryClient.setQueryData(keys.listActive, context.previousActive);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}
