"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { transitions } from "@/shared/lib/animations";
import { Button } from "@/shared/ui/button";

interface TaskBoardFABProps {
  show: boolean;
  onClick: () => void;
}

export function TaskBoardFAB({ show, onClick }: TaskBoardFABProps) {
  if (!show) return null;

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
        className="shadow-lg hover:shadow-xl transition-shadow rounded-full size-12"
      >
        <Plus className="size-5" />
      </Button>
    </motion.div>
  );
}
