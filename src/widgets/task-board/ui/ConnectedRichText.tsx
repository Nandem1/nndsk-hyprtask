"use client";

import { memo } from "react";
import { RichText as RichTextBase } from "@/shared/ui/rich-text";
import type { RichTextProps } from "@/shared/ui/rich-text";
import { useEmoteCollection } from "@/entities/emote";
import { useEmotePrefs } from "@/store/hooks";

export const RichText = memo(function ConnectedRichText(props: RichTextProps) {
  const { data: collection = [] } = useEmoteCollection();
  const { animatedEmotes } = useEmotePrefs();
  return <RichTextBase {...props} collection={collection} animatedEmotes={animatedEmotes} />;
});
