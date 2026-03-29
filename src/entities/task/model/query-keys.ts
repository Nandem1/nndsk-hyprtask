export const taskKeys = {
  all: ['tasks'] as const,
  active: () => [...taskKeys.all, 'active'] as const,
  current: () => [...taskKeys.all, 'current'] as const,
  settings: () => [...taskKeys.all, 'settings'] as const,
};
