"use client";

import dynamic from "next/dynamic";
import { SleepPageSkeleton } from "./SleepPageSkeleton";

// Dynamic import del SleepDashboard con SSR deshabilitado
// Este componente wrapper es necesario porque next/dynamic con ssr: false
// solo puede usarse en Client Components (Next.js 15+)
const SleepDashboard = dynamic(
  () => import("@/widgets/sleep-dashboard").then((mod) => mod.SleepDashboard),
  {
    ssr: false,
    loading: () => <SleepPageSkeleton />,
  },
);

/**
 * SleepDashboardWrapper
 *
 * Arquitectura: Islands of Interactivity
 * - La página (sleep/page.tsx) permanece como Server Component
 * - Este wrapper es Client Component y maneja el dynamic import
 * - Solo esta "isla" se hidrata en el cliente
 *
 * Beneficios:
 * - SSR para el layout y skeleton inicial
 * - Code splitting automático del dashboard pesado
 * - Mejor Time to First Byte (TTFB)
 * - Cumple con Next.js 15+ restrictions
 */
export function SleepDashboardWrapper() {
  return <SleepDashboard />;
}
