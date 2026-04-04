import type { UserEmote } from "@/shared/types/emote";

export type EmoteToken =
  | { type: "text"; value: string }
  | { type: "emote"; id: string; name: string; animated: boolean };

const WORD_BOUNDARY_RE = /(\s+|[^\w!@#$%^&*()\-+=\[\]{}|;:'",.<>?/`~])/;

export function parseEmotes(
  text: string,
  collection: UserEmote[],
): EmoteToken[] {
  if (!text || collection.length === 0) {
    return text ? [{ type: "text", value: text }] : [];
  }

  const emoteMap = new Map<string, UserEmote>();
  for (const emote of collection) {
    emoteMap.set(emote.name, emote);
  }

  const tokens: EmoteToken[] = [];
  const words = text.split(WORD_BOUNDARY_RE);

  for (const word of words) {
    if (!word) continue;
    const emote = emoteMap.get(word);
    if (emote) {
      tokens.push({
        type: "emote",
        id: emote.id,
        name: emote.name,
        animated: emote.animated,
      });
    } else {
      const last = tokens[tokens.length - 1];
      if (last && last.type === "text") {
        last.value += word;
      } else {
        tokens.push({ type: "text", value: word });
      }
    }
  }

  return tokens;
}
