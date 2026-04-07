import type { Control, FieldErrors } from "react-hook-form";
import type { CreateTaskFormData } from "./schema";
import type { Project, Category } from "@entities/project";
import type { Task } from "@entities/task";

/**
 * Props para el hook useTaskCreate
 */
export interface UseTaskCreateOptions {
  /** Máximo de tareas permitidas */
  maxTasks: number;
  /** Cantidad actual de tareas */
  currentTasks: number;
  /** Callback al crear exitosamente */
  onSuccess: () => void;
  /** ID de proyecto por defecto */
  defaultProjectId?: string;
  /** ID de categoría por defecto */
  defaultCategoryId?: string;
}

/**
 * Retorno del hook useTaskCreate
 */
export interface UseTaskCreateReturn {
  /** Controlador de React Hook Form */
  control: Control<CreateTaskFormData>;
  /** Estado de envío del formulario */
  isSubmitting: boolean;
  /** Si el formulario es válido */
  isValid: boolean;
  /** Errores de validación */
  errors: FieldErrors<CreateTaskFormData>;
  /** Handler para enviar el formulario */
  onSubmit: () => Promise<void>;
  /** Valor actual del título (para contador de caracteres) */
  titleValue: string;
  /** Si se puede crear la tarea */
  canCreate: boolean;
}

/**
 * Props para el componente TaskCreateFields
 */
export interface TaskCreateFieldsProps {
  /** Controlador de React Hook Form */
  control: Control<CreateTaskFormData>;
  /** Errores de validación */
  errors: FieldErrors<CreateTaskFormData>;
  /** Lista de proyectos disponibles */
  projects: Project[];
  /** Lista de categorías disponibles */
  categories: Category[];
  /** Lista de tareas incompletas para vinculación */
  incompleteTasks: Task[];
  /** Valor actual del título */
  titleValue: string;
}

/**
 * Props para el componente TaskCreateFooter
 */
export interface TaskCreateFooterProps {
  /** Si el formulario está siendo enviado */
  isSubmitting: boolean;
  /** Si se puede crear la tarea */
  canCreate: boolean;
  /** Callback para cancelar */
  onCancel: () => void;
}

export type { CreateTaskFormData };
