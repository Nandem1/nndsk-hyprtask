"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { transitions } from "@/shared/lib/animations";
import { Button } from "@/shared/ui/button";
import { preloadTaskCreateModal } from "@/widgets/task-board/lib/preload";

interface TaskBoardFABProps {
  show: boolean;
  onClick: () => void;
}

export function TaskBoardFAB({ show, onClick }: TaskBoardFABProps) {
  if (!show) return null;

  const handleMouseEnter = () => {
    // Preload TaskCreateModal on hover for faster perceived loading
    preloadTaskCreateModal();
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 md:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, ...transitions.springBouncy }}
    >
      <Button
        size="default"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        className="shadow-lg hover:shadow-xl transition-shadow rounded-full size-12"
      >
        <Plus className="size-5" />
      </Button>
    </motion.div>
  );
}
