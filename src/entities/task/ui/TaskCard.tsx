"use client";

import { motion } from "framer-motion";
import { Check, Trash2, Play } from "lucide-react";
import { useThemeState } from "@/store/hooks";
import { getProjectById, getCategoryById } from "../lib/constants";
import type { Task } from "../model/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  variant?: "default" | "compact" | "minimal";
}

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onSetCurrent,
  variant = "default",
}: TaskCardProps) {
  const { themeClasses } = useThemeState();
  const project = task.project ? getProjectById(task.project) : null;
  const category = task.category ? getCategoryById(task.category) : null;

  // Priority colors for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const priorityColors = {
    low: "bg-green-500/20 border-green-500/30 text-green-400",
    medium: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
    high: "bg-red-500/20 border-red-500/30 text-red-400",
  };

  if (variant === "minimal") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`flex items-center gap-2 p-2 rounded border ${task.isCompleted ? "opacity-50" : ""} ${task.isCurrent ? themeClasses.border : "border-border/30"}`}
      >
        <button
          onClick={() => onToggle(task.id)}
          className={`w-4 h-4 rounded border flex items-center justify-center ${task.isCompleted ? "bg-primary border-primary" : "border-border/50"}`}
        >
          {task.isCompleted && (
            <Check className="w-3 h-3 text-primary-foreground" />
          )}
        </button>
        <span
          className={`flex-1 text-sm ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative p-4 rounded-xl border ${task.isCurrent ? themeClasses.border : "border-border/30"} bg-background/30 backdrop-blur-sm transition-all hover:border-border/50 ${task.isCompleted ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${task.isCompleted ? "bg-primary border-primary" : "border-border/50 hover:border-primary"}`}
        >
          {task.isCompleted && (
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            className={`font-medium truncate ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </div>

          {(project || category) && (
            <div className="flex items-center gap-2 mt-1.5">
              {project && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${project.color}`}
                >
                  <project.icon className="w-3 h-3" />
                  {project.label}
                </span>
              )}
              {category && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${category.color}`}
                >
                  <category.icon className="w-3 h-3" />
                  {category.label}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.isCurrent && !task.isCompleted && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSetCurrent(task.id)}
              className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary"
              title="Set as current"
            >
              <Play className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {task.isCurrent && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r ${themeClasses.gradientBg}`}
        />
      )}
    </motion.div>
  );
}
