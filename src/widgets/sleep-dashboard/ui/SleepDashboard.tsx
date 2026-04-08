"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/store/hooks";
import { SleepTimerCard } from "@/entities/sleep";

export function SleepDashboard() {
  const { themeClasses } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <div className="mb-8">
        <h1
          className={`text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r ${themeClasses.gradient} bg-clip-text text-transparent`}
        >
          Sueno
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu descanso de forma inteligente
        </p>
      </div>

      <SleepTimerCard themeClasses={themeClasses} />
    </motion.div>
  );
}
