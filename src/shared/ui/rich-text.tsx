"use client";

import { useMemo, useState, memo } from "react";
import { cn } from "@/shared/lib/utils";
import { getEmoteUrl } from "@/shared/lib/seventv-api";
import { parseEmotes } from "@/shared/lib/emote-parser";
import type { UserEmote } from "@/shared/types/emote";

interface EmoteImgProps {
  id: string;
  name: string;
  animated: boolean;
  size: "1x" | "2x";
  className?: string;
  forceStatic?: boolean;
}

const FALLBACK_ORDER = (id: string, animated: boolean) => [
  getEmoteUrl(id, "1x", animated),
  getEmoteUrl(id, "1x", false),
  getEmoteUrl(id, "2x", false),
  `https://cdn.7tv.app/emote/${id}/1x.avif`,
];

const EmoteImg = memo(function EmoteImg({
  id,
  name,
  animated,
  size,
  className,
  forceStatic,
}: EmoteImgProps) {
  const showAnimated = animated && !forceStatic;
  const fallbacks = useMemo(
    () => FALLBACK_ORDER(id, showAnimated),
    [id, showAnimated],
  );
  const [attempt, setAttempt] = useState(0);

  if (attempt >= fallbacks.length) {
    return <span title={name}>{name}</span>;
  }

  return (
    <img
      src={fallbacks[attempt]}
      alt={name}
      title={name}
      onError={() => setAttempt((a) => a + 1)}
      className={cn("inline-block h-[1.4em] w-auto align-middle mx-px", className)}
      loading="lazy"
    />
  );
});

export interface RichTextProps {
  text: string;
  className?: string;
  inline?: boolean;
  emoteSize?: "1x" | "2x";
  collection?: UserEmote[];
  animatedEmotes?: boolean;
}

export const RichText = memo(function RichText({
  text,
  className,
  inline = false,
  emoteSize = "1x",
  collection = [],
  animatedEmotes = true,
}: RichTextProps) {
  const tokens = useMemo(
    () => parseEmotes(text, collection),
    [text, collection],
  );

  if (!text) return null;

  const forceStatic = !animatedEmotes;

  if (inline) {
    return (
      <span className={className}>
        {tokens.map((token, i) =>
          token.type === "emote" ? (
            <EmoteImg
              key={i}
              id={token.id}
              name={token.name}
              animated={token.animated}
              size={emoteSize}
              forceStatic={forceStatic}
            />
          ) : (
            <span key={i}>{token.value}</span>
          ),
        )}
      </span>
    );
  }

  return (
    <div className={className}>
      {tokens.map((token, i) =>
        token.type === "emote" ? (
          <EmoteImg
            key={i}
            id={token.id}
            name={token.name}
            animated={token.animated}
            size={emoteSize}
            forceStatic={forceStatic}
          />
        ) : (
          <span key={i}>{token.value}</span>
        ),
      )}
    </div>
  );
});
