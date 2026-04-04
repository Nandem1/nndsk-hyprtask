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

const EmoteImg = memo(function EmoteImg({
  id,
  name,
  animated,
  size,
  className,
  forceStatic,
}: EmoteImgProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span title={name}>{name}</span>;
  }

  const showAnimated = animated && !forceStatic;

  return (
    <img
      src={getEmoteUrl(id, size, showAnimated)}
      alt={name}
      title={name}
      onError={() => setFailed(true)}
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
