import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asyncWrap<T>(fn: (v: T) => void): (v: T) => Promise<void> {
  return async (v) => { fn(v); };
}
