export type { UserEmote } from "./model/types";
export { emoteKeys } from "./model/query-keys";

export {
  getEmoteCollection,
  addEmoteToCollection,
  removeEmoteFromCollection,
  isEmoteInCollection,
} from "./lib/storage";

export {
  useGlobalEmotes,
  useEmoteCollection,
  useEmoteSearch,
} from "./hooks/use-emote-queries";

export {
  useAddEmote,
  useRemoveEmote,
  useRebuildCollection,
} from "./hooks/use-emote-mutations";

export { RichText } from "./ui/rich-text-connected";
