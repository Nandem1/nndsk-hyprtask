import { Header } from "@/widgets";
import { SleepPageSkeleton } from "./SleepPageSkeleton";
import { SleepDashboardWrapper } from "./SleepDashboardWrapper";

/**
 * SleepPage - Server Component
 * 
 * Arquitectura:
 * - Server Component para layout inicial y SEO
 * - SleepPageSkeleton se renderiza en servidor (instantáneo)
 * - SleepDashboardWrapper (Client Component) carga el dashboard dinámicamente
 * 
 * Beneficios de rendimiento:
 * - SSR para el shell inicial (Header + Skeleton)
 * - Streaming del dashboard pesado
 * - Mejor TTFB y perceived performance
 */
export default function SleepPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SleepDashboardWrapper />
      </main>
    </div>
  );
}
