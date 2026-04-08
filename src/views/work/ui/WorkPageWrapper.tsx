"use client";

import dynamic from "next/dynamic";
import { WorkPageSkeleton } from "./WorkPageSkeleton";

// Dynamic import del WorkDashboard con SSR deshabilitado
// Usa WorkPageSkeleton como fallback para streaming
const WorkDashboard = dynamic(
  () => import("@/widgets/work-dashboard").then((mod) => mod.WorkDashboard),
  {
    ssr: false,
    loading: () => <WorkPageSkeleton />,
  },
);

/**
 * WorkPageWrapper
 *
 * Arquitectura: Islands of Interactivity
 * - La página (work/page.tsx) permanece como Server Component
 * - Este wrapper es Client Component y maneja el dynamic import
 * - Solo esta "isla" se hidrata en el cliente
 *
 * Beneficios:
 * - SSR para el layout y skeleton inicial
 * - Code splitting automático del dashboard pesado
 * - Mejor Time to First Byte (TTFB)
 * - Streaming progresivo con WorkPageSkeleton
 * - Cumple con Next.js 15+ restrictions
 */
export function WorkPageWrapper() {
  return <WorkDashboard />;
}
