export const taskKeys = {
  all: ["tasks"] as const,
  active: () => [...taskKeys.all, "active"] as const,
  current: () => [...taskKeys.all, "current"] as const,
  detail: (id: string) => [...taskKeys.all, "detail", id] as const,
  settings: () => [...taskKeys.all, "settings"] as const,
};
