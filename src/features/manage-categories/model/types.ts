import type { Category, CategoryColor, CategoryIcon } from "@/entities/project";

export interface CategoryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CategoryFormState {
  name: string;
  color: CategoryColor;
  icon: CategoryIcon;
  isCreating: boolean;
  editingCategory: Category | null;
}
