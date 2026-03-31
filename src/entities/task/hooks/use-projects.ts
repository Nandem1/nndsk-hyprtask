"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getActiveProjects,
  getProjectById,
  saveProject,
  deleteProject,
} from "../lib/project-storage";
import { projectKeys } from "../model/project-query-keys";
import type { Project } from "../model/project-types";

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook para obtener todos los proyectos
 */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: getProjects,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener solo proyectos activos (ordenados)
 */
export function useActiveProjects() {
  return useQuery({
    queryKey: projectKeys.list({ isActive: true }),
    queryFn: getActiveProjects,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener un proyecto específico
 */
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

/**
 * Hook para crear o actualizar un proyecto
 */
export function useSaveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProject,
    onMutate: async (newProject: Project) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.lists(),
      );

      queryClient.setQueryData<Project[]>(projectKeys.lists(), (old) => {
        if (!old) return [newProject];
        const existingIndex = old.findIndex((p) => p.id === newProject.id);
        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = newProject;
          return updated;
        }
        return [...old, newProject];
      });

      return { previousProjects };
    },
    onError: (_err, _project, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

/**
 * Hook para eliminar un proyecto (soft delete)
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.all });

      const previousProjects = queryClient.getQueryData<Project[]>(
        projectKeys.lists(),
      );
      const previousActiveProjects = queryClient.getQueryData<Project[]>(
        projectKeys.list({ isActive: true }),
      );

      // Optimistic update: marcar como inactivo
      queryClient.setQueryData<Project[]>(projectKeys.lists(), (old) =>
        old?.map((p) => (p.id === id ? { ...p, isActive: false } : p)),
      );

      queryClient.setQueryData<Project[]>(
        projectKeys.list({ isActive: true }),
        (old) => old?.filter((p) => p.id !== id),
      );

      return { previousProjects, previousActiveProjects };
    },
    onError: (_err, _id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectKeys.lists(), context.previousProjects);
      }
      if (context?.previousActiveProjects) {
        queryClient.setQueryData(
          projectKeys.list({ isActive: true }),
          context.previousActiveProjects,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
