import React, { useMemo } from "react";
import { Linking, TextProps, TextStyle } from "react-native";
import { AppBskyRichtextFacet, RichText as RichTextAPI } from "@atproto/api";
import { Text } from "./text";

export interface RichTextProps extends TextProps {
  value: string | RichTextAPI;
  disableLinks?: boolean;
  enableTags?: boolean;
  onLinkPress?: (url: string) => void;
  interactiveStyle?: TextStyle;
  emojiMultiplier?: number;
  numberOfLines?: number;
}

export function RichText({
  value,
  disableLinks = false,
  enableTags = false,
  onLinkPress,
  interactiveStyle,
  emojiMultiplier = 1.85,
  numberOfLines,
  ...props
}: RichTextProps) {
  const richText = useMemo(
    () =>
      value instanceof RichTextAPI ? value : new RichTextAPI({ text: value }),
    [value]
  );

  const { text, facets } = richText;

  // If no special facets (links, mentions, hashtags), return plain text
  if (!facets?.length) {
    return (
      <Text {...props} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const segment of richText.segments()) {
    const { text } = segment;
    const link = segment.link;
    const mention = segment.mention;
    const tag = segment.tag;

    if (
      mention &&
      AppBskyRichtextFacet.validateMention(mention).success &&
      !disableLinks
    ) {
      elements.push(
        <Text
          key={key}
          style={[interactiveStyle]}
          font="semiBold"
          className="text-blue-500 underline"
          suppressHighlighting
          onPress={() =>
            onLinkPress ? onLinkPress(`/profile/${mention.did}`) : null
          }
        >
          {text}
        </Text>
      );
    } else if (link && AppBskyRichtextFacet.validateLink(link).success) {
      elements.push(
        <Text
          key={key}
          numberOfLines={1}
          style={interactiveStyle}
          suppressHighlighting
          className="text-blue-500 underline"
          onPress={() =>
            onLinkPress ? onLinkPress(link.uri) : Linking.openURL(link.uri)
          }
        >
          {text}
        </Text>
      );
    } else if (
      !disableLinks &&
      enableTags &&
      tag &&
      AppBskyRichtextFacet.validateTag(tag).success
    ) {
      elements.push(
        <Text
          key={key}
          style={interactiveStyle}
          suppressHighlighting
          className="text-purple-500 underline"
          onPress={() =>
            onLinkPress ? onLinkPress(`/search/${tag.tag}`) : null
          }
        >
          {text}
        </Text>
      );
    } else {
      elements.push(text);
    }
    key++;
  }

  return (
    <Text {...props} numberOfLines={numberOfLines}>
      {elements}
    </Text>
  );
}
