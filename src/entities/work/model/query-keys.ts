export const workKeys = {
  all: ['work'] as const,
  settings: () => [...workKeys.all, 'settings'] as const,
  calculations: (settings: unknown) => [...workKeys.all, 'calculations', settings] as const,
};
