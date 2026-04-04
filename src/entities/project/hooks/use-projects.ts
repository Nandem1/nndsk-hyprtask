"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProjects,
  getActiveProjects,
  getProjectById,
  saveProject,
  deleteProject,
} from "../lib/storage";
import { projectKeys } from "../model/query-keys";
import type { Project } from "../model/types";
import { useUpsertMutation, useDeleteEntityMutation } from "./use-entity-mutations";

// ============================================================================
// Query Hooks
// ============================================================================

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5,
  });
}

export function useActiveProjects() {
  return useQuery({
    queryKey: projectKeys.list({ isActive: true }),
    queryFn: getActiveProjects,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

const projectMutationKeys = {
  all: projectKeys.all,
  listAll: projectKeys.lists(),
  listActive: projectKeys.list({ isActive: true }),
};

export function useSaveProject() {
  return useUpsertMutation<Project>(saveProject, projectMutationKeys);
}

export function useDeleteProject() {
  return useDeleteEntityMutation<Project>(deleteProject, projectMutationKeys);
}
