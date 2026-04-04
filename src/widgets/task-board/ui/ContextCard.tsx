"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Task } from "@/entities/task";
import { Card, CardContent } from "@/shared/ui/card";

export function ContextCard({
  task,
  type,
  onClick,
}: {
  task: Task;
  type: "parent" | "child";
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: type === "parent" ? 0.1 : 0.15 }}
    >
      <Card
        className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-l-4 border-l-primary/50"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {type === "parent" ? (
              <>
                <ArrowLeft className="size-3" />
                Viene de
              </>
            ) : (
              <>
                <ArrowRight className="size-3" />
                Continúa en
              </>
            )}
          </div>
          <p className="text-sm font-medium line-clamp-2">{task.title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
