"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getActiveCategories,
  getCategoryById,
  saveCategory,
  deleteCategory,
} from "../lib/storage";
import { categoryKeys } from "../model/query-keys";
import type { Category } from "../model/types";
import { useUpsertMutation, useDeleteEntityMutation } from "./use-entity-mutations";

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

const categoryMutationKeys = {
  all: categoryKeys.all,
  listAll: categoryKeys.lists(),
  listActive: categoryKeys.list({ isActive: true }),
};

export function useSaveCategory() {
  return useUpsertMutation<Category>(saveCategory, categoryMutationKeys);
}

export function useDeleteCategory() {
  return useDeleteEntityMutation<Category>(deleteCategory, categoryMutationKeys);
}
