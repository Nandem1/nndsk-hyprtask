import type { Project, ProjectColor, ProjectIcon } from "@/entities/project";

export interface ProjectConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProjectFormState {
  name: string;
  color: ProjectColor;
  icon: ProjectIcon;
  isCreating: boolean;
  editingProject: Project | null;
}
