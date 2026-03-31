import { Suspense } from "react";
import { HeaderClient } from "./HeaderClient";
import { HeaderSkeleton } from "./HeaderSkeleton";

// Server Component wrapper with Suspense
export function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderClient />
    </Suspense>
  );
}
