import { useKeyboardSelectionState } from "@/store/hooks";
import { useScrollIntoViewWhen } from "@/shared/hooks/use-scroll-into-view";
import { KEYBOARD_SELECTED_RING } from "@/shared/lib/keyboard-shortcuts";

export function useKeyboardSelected(taskId: string) {
  const { keyboardSelectedId } = useKeyboardSelectionState();
  const isSelected = keyboardSelectedId === taskId;
  const scrollRef = useScrollIntoViewWhen(isSelected);

  return {
    isSelected,
    scrollRef,
    selectedClass: isSelected ? KEYBOARD_SELECTED_RING : "",
  };
}
