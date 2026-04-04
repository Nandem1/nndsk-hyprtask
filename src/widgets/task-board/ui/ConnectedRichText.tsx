"use client";

import { memo } from "react";
import { RichText as RichTextBase } from "@/shared/ui/rich-text";
import type { RichTextProps } from "@/shared/ui/rich-text";
import { useEmoteCollection } from "@/entities/emote";
import { useEmotePrefsState } from "@/store/hooks";

export const RichText = memo(function ConnectedRichText(props: RichTextProps) {
  const { data: collection = [] } = useEmoteCollection();
  const { animatedEmotes } = useEmotePrefsState();
  return <RichTextBase {...props} collection={collection} animatedEmotes={animatedEmotes} />;
});
