import { storageGetList, storageSet } from "@shared/lib/storage";
import type { UserEmote } from "../model/types";

const STORAGE_KEY = "hyprtodo_user_emotes";

export function getEmoteCollection(): UserEmote[] {
  return storageGetList<UserEmote>(STORAGE_KEY);
}

export function addEmoteToCollection(emote: UserEmote): void {
  const collection = getEmoteCollection();
  if (collection.some((e) => e.id === emote.id)) return;
  storageSet(STORAGE_KEY, [...collection, emote]);
}

export function removeEmoteFromCollection(id: string): void {
  const collection = getEmoteCollection().filter((e) => e.id !== id);
  storageSet(STORAGE_KEY, collection);
}

export function isEmoteInCollection(id: string): boolean {
  return getEmoteCollection().some((e) => e.id === id);
}
