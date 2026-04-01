import { z } from "zod";

/**
 * Schema de validación para crear una nueva tarea
 * Define la estructura y reglas de validación del formulario
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "Máximo 100 caracteres")
    .trim(),
  priority: z.enum(["low", "medium", "high"]),
  projectId: z.string().optional(),
  categoryId: z.string().optional(),
  parentTaskId: z.string().optional(),
});

/**
 * Tipo inferido del schema de Zod
 * Usado para type safety en el formulario
 */
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Valores por defecto del formulario
 */
export const defaultValues: CreateTaskFormData = {
  title: "",
  priority: "low",
  projectId: undefined,
  categoryId: undefined,
  parentTaskId: undefined,
};
