import { useEffect, useRef } from "react";

export function useScrollIntoViewWhen(condition: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (condition && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [condition]);

  return ref;
}
