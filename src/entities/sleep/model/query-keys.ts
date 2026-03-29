export const sleepKeys = {
  all: ['sleep'] as const,
  settings: () => [...sleepKeys.all, 'settings'] as const,
  calculations: (settings: unknown) => [...sleepKeys.all, 'calculations', settings] as const,
  logs: () => [...sleepKeys.all, 'logs'] as const,
};
