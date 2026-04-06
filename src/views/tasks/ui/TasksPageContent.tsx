"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/store/hooks";
import { autoArchiveCompletedTasks } from "@/entities/task/lib/storage";
import { TaskSidebar } from "@/widgets/task-sidebar";
import { Button } from "@/shared/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";

const TaskBoard = dynamic(
  () => import("@/widgets/task-board").then((mod) => mod.TaskBoard),
  {
    ssr: false,
  },
);

export function TasksPageContent() {
  const { themeClasses } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Auto-archivar tareas completadas al cargar
  useEffect(() => {
    autoArchiveCompletedTasks();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <TaskSidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1
                className={`text-4xl font-bold tracking-tight mb-2 bg-linear-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
              >
                Tareas
              </h1>
              <p className="text-muted-foreground">
                Enfocate en lo importante. Maximo 5 tareas activas.
              </p>
            </div>
            {/* Boton filtros movil */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Abrir filtros"
                >
                  <Filter />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <TaskSidebar />
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Lista de tareas */}
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: [0.4, 0, 0.2, 1],
              delay: shouldReduceMotion ? 0 : 0.1,
            }}
          >
            <TaskBoard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
