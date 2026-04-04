export const emoteKeys = {
  all: ["emotes"] as const,
  global: () => [...emoteKeys.all, "global"] as const,
  collection: () => [...emoteKeys.all, "collection"] as const,
  search: (query: string) => [...emoteKeys.all, "search", query] as const,
};
