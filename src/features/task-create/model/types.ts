import type { CreateTaskFormData } from "./schema";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  /** Función watch de React Hook Form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: (name: string) => any;
  /** Estado de envío del formulario */
  isSubmitting: boolean;
  /** Si el formulario es válido */
  isValid: boolean;
  /** Errores de validación */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  /** Función watch de React Hook Form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: (name: string) => any;
  /** Errores de validación */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  /** Lista de proyectos disponibles */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  /** Lista de categorías disponibles */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  /** Lista de tareas incompletas para vinculación */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  incompleteTasks: any[];
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
