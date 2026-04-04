"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getActiveCategories,
  getCategoryById,
  saveCategory,
  deleteCategory,
} from "../lib/storage";
import { categoryKeys } from "../model/query-keys";
import type { Category } from "../model/types";

// ============================================================================
// Query Hooks
// ============================================================================

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: categoryKeys.list({ isActive: true }),
    queryFn: getActiveCategories,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useSaveCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCategory,
    onMutate: async (newCategory: Category) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.all });

      const previousCategories = queryClient.getQueryData<Category[]>(
        categoryKeys.lists(),
      );

      queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old) => {
        if (!old) return [newCategory];
        const existingIndex = old.findIndex((c) => c.id === newCategory.id);
        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = newCategory;
          return updated;
        }
        return [...old, newCategory];
      });

      return { previousCategories };
    },
    onError: (_err, _category, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoryKeys.lists(),
          context.previousCategories,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: categoryKeys.all });

      const previousCategories = queryClient.getQueryData<Category[]>(
        categoryKeys.lists(),
      );
      const previousActiveCategories = queryClient.getQueryData<Category[]>(
        categoryKeys.list({ isActive: true }),
      );

      queryClient.setQueryData<Category[]>(categoryKeys.lists(), (old) =>
        old?.map((c) => (c.id === id ? { ...c, isActive: false } : c)),
      );

      queryClient.setQueryData<Category[]>(
        categoryKeys.list({ isActive: true }),
        (old) => old?.filter((c) => c.id !== id),
      );

      return { previousCategories, previousActiveCategories };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoryKeys.lists(),
          context.previousCategories,
        );
      }
      if (context?.previousActiveCategories) {
        queryClient.setQueryData(
          categoryKeys.list({ isActive: true }),
          context.previousActiveCategories,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
