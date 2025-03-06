import { FeedPostSliceItem } from "@/state/queries/post-feed";
import { HStack, Text, View, VStack } from "@/components/ui";
import { formatTimestamp } from "@/lib/date-time";
import { Button } from "../ui/button";
import Spacer from "../ui/spacer";
import { useCallback, useMemo } from "react";
import { IconSymbol } from "../ui/IconSymbol";
import { AppBskyEmbedImages, RichText as RichTextAPI } from "@atproto/api";
import { RichText } from "../ui/rich-text";
import * as Webview from "expo-web-browser";
import UserAvatar from "../UserAvatar";
import { router } from "expo-router";
import { Pressable } from "react-native";
import Separetor from "../ui/separator";
import MediaSlider from "../ImageSlider";
import { formatNumberToKOrM } from "@/lib/numbers";

interface FeedSliceItemProps {
  item: FeedPostSliceItem;
}

export default function PostFeedItem({ item }: FeedSliceItemProps) {
  const post = item.post;

  const images = useMemo(() => {
    if (post.embed?.images) {
      return post.embed.images;
    }
    return [];
  }, [post]) as AppBskyEmbedImages.ViewImage[];

  const richText = useMemo(() => {
    if (item.record.text || item.record.facets) {
      return new RichTextAPI({
        text: item.record.text,
        facets: item.record.facets,
      });
    }
  }, [item]);

  const aspectRatio = useMemo(() => {
    if (post.embed?.images) {
      const imgs = post.embed?.images as AppBskyEmbedImages.ViewImage[];
      return (
        (imgs[0].aspectRatio?.width ?? 0) / (imgs[0].aspectRatio?.height ?? 1)
      );
    }

    return 1;
  }, [post]);

  const isLiked = useMemo(() => !!post.viewer?.like, [post]);

  const onUserProfilePress = useCallback(() => {
    router.push(`/user-profile/${post.author.did}`);
  }, [router, post]);

  return (
    <View>
      <VStack>
        <HStack className="p-3 items-center">
          <Pressable onPress={onUserProfilePress}>
            <HStack>
              <UserAvatar avatar={post.author.avatar} />
              <VStack className="gap-0">
                <Text size="base" font="semiBold">
                  {post.author.displayName}
                </Text>
                <Text size="sm" className="text-neutral-500">
                  @{post.author.handle}
                </Text>
              </VStack>
            </HStack>
            <Text size="sm">{formatTimestamp(post.indexedAt)}</Text>
          </Pressable>
          <Spacer />

          {!post.author.viewer?.following && (
            <Button variant="outline" size="sm">
              <Button.Text size={"sm"} font="semiBold">
                Follow
              </Button.Text>
              <Button.Icon name="plus" size={14} />
            </Button>
          )}
        </HStack>

        <VStack>
          {!!richText && (
            <VStack className="pr-4 pl-4">
              <RichText
                value={richText}
                onLinkPress={async (url) => {
                  await Webview.openBrowserAsync(url, {
                    presentationStyle:
                      Webview.WebBrowserPresentationStyle.FORM_SHEET,
                  });
                }}
                numberOfLines={5}
                enableTags
              />
            </VStack>
          )}

          {images.length > 0 && (
            <View
              style={{
                aspectRatio,
              }}
              className="pb-2"
            >
              <MediaSlider images={images} />
            </View>
          )}

          {/**
           * interaction buttons
           */}
          <HStack className="gap-0 py-2">
            <Button variant="ghost" className="gap-1 pr-0">
              <Button.Icon
                name={isLiked ? "heart.fill" : "heart"}
                size={26}
                color={isLiked ? "red" : undefined}
              />
              <Button.Text font="semiBold">
                {formatNumberToKOrM(post.likeCount ?? 0)}
              </Button.Text>
            </Button>
            <Button variant="ghost" className="gap-1 pr-0">
              <Button.Icon name="ellipsis.message" size={26} />
              <Button.Text font="semiBold">
                {formatNumberToKOrM(post.quoteCount ?? 0)}
              </Button.Text>
            </Button>
            <Button variant="ghost" className="gap-1 pr-0">
              <IconSymbol name="repeat" size={26} />
              <Button.Text font="semiBold">
                {formatNumberToKOrM(post.repostCount ?? 0)}
              </Button.Text>
            </Button>
            <Button variant="ghost" className="gap-1 pr-0">
              <IconSymbol name="ellipsis" size={26} />
            </Button>
          </HStack>
        </VStack>
      </VStack>

      <Separetor />
    </View>
  );
}
