import { isAndroid } from "@/platform/detection";
import {
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  ModerationDecision,
  RichTextProps,
} from "@atproto/api";
import { useEventListener } from "expo";
import { createVideoPlayer, VideoPlayer, VideoView } from "expo-video";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NativeGesture } from "react-native-gesture-handler";
import { Platform, Pressable, StyleSheet } from "react-native";
import { HStack, Text, View, VStack } from "../ui";
import { Image, ImageStyle } from "expo-image";
import { formatNumberToKOrM } from "@/lib/numbers";
import UserAvatar from "../UserAvatar";
import { useRouter } from "expo-router";
import { Button } from "../ui/button";
import { RichText as RichTextAPI } from "@atproto/api";
import { RichText } from "../ui/rich-text";
import { cn } from "@/lib/utils";
import { sanitizeDisplayName } from "@/lib/strings/display-names";
import ExpoIcon from "../ui/icon";
const VIDEO_PLAYER_BOTTOM_INSET = 57;

function Overlay({
  post,
  isOwner,
  isActive,
}: {
  isActive: boolean;
  isOwner: boolean;
  post: AppBskyFeedDefs.PostView;
}) {
  const [showMore, setShowMore] = useState(false);
  const isLiked = post.viewer?.like;
  const router = useRouter();

  useEffect(() => {
    if (showMore && !isActive) {
      setShowMore(false);
    }
  }, [showMore, isActive]);

  const onPress = useCallback(() => {
    if (isOwner) {
      router.back();
    } else {
      router.push(`/user-profile/${post.author.did}`);
    }
  }, [isOwner, router, post]);

  const richText = useMemo(() => {
    if ("text" in post.record || "facets" in post.record) {
      return new RichTextAPI({
        text: "text" in post.record ? (post.record.text as string) : "",
        facets:
          "facets" in post.record
            ? (post.record.facets as RichTextProps["facets"])
            : [],
      });
    }
  }, [post]);

  const onShowMore = useCallback(() => {
    if (!richText) return;
    setShowMore(!showMore);
  }, [showMore, richText]);

  const shouldFollow = useMemo(() => {
    return !post.author.viewer?.following;
  }, [post]);

  return (
    <View
      className="items-end pb-[25%] flex flex-row justify-between px-4 bg-transparent"
      style={StyleSheet.absoluteFillObject}
    >
      {
        // left user profile
      }
      <Pressable
        onPress={onPress}
        className="max-w-[85%] relative flex flex-col gap-1"
      >
        <HStack className="bg-transparent">
          <UserAvatar avatar={post.author.avatar} />
          <VStack
            className={cn("bg-transparent ", !shouldFollow ? "flex-1" : "")}
          >
            <HStack className="bg-transparent">
              <Text
                font="semiBold"
                numberOfLines={1}
                className="text-white shadow shadow-black max-w-[72%]"
              >
                {sanitizeDisplayName(
                  post.author?.displayName ?? `@${post.author?.handle}`
                )}
              </Text>

              {shouldFollow && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent h-7"
                >
                  <Button.Text
                    font="semiBold"
                    className="text-white shadow shadow-black"
                    size="sm"
                  >
                    Follow
                  </Button.Text>
                </Button>
              )}
            </HStack>
          </VStack>
        </HStack>
        {richText && (
          <Pressable onPress={onShowMore}>
            <RichText
              numberOfLines={showMore ? 15 : 2}
              value={richText}
              className="text-white shadow shadow-black"
              linkClassName="text-white text-primary"
              mentionClassName="text-white"
            />
          </Pressable>
        )}
      </Pressable>

      {
        // right action buttons
      }
      <VStack className="bg-transparent gap-4">
        <Pressable className="items-center">
          <ExpoIcon
            className="shadow-black shadow"
            name="heart-outline"
            size="3xl"
            color={isLiked ? "red" : "white"}
          />
          <Text font="semiBold" className="text-white shadow shadow-black">
            {formatNumberToKOrM(post.likeCount ?? 0)}
          </Text>
        </Pressable>
        <Pressable className="items-center">
          <ExpoIcon
            name="chatbubble-ellipses-outline"
            size="3xl"
            color="white"
            className="shadow-black shadow"
          />
          <Text font="semiBold" className="text-white shadow shadow-black">
            {formatNumberToKOrM(post.quoteCount ?? 0)}
          </Text>
        </Pressable>
        <Pressable className="items-center">
          <ExpoIcon name="repeat" size="3xl" color="white" />
          <Text font="semiBold" className="text-white shadow shadow-black">
            {formatNumberToKOrM(post.repostCount ?? 0)}
          </Text>
        </Pressable>
        <Pressable className="items-center">
          <ExpoIcon
            name="ellipsis-horizontal"
            size="3xl"
            color="white"
            className="text-white shadow shadow-black"
          />
        </Pressable>
      </VStack>
    </View>
  );
}

export function createThreeVideoPlayers(
  sources?: [string, string, string]
): [VideoPlayer, VideoPlayer, VideoPlayer] {
  // android is typically slower and can't keep up with a 0.1 interval
  const eventInterval = Platform.select({
    ios: 0.2,
    android: 0.5,
    default: 0,
  });
  const p1 = createVideoPlayer(sources?.[0] ?? "");
  p1.loop = true;
  p1.timeUpdateEventInterval = eventInterval;
  const p2 = createVideoPlayer(sources?.[1] ?? "");
  p2.loop = true;
  p2.timeUpdateEventInterval = eventInterval;
  const p3 = createVideoPlayer(sources?.[2] ?? "");
  p3.loop = true;
  p3.timeUpdateEventInterval = eventInterval;
  return [p1, p2, p3];
}
function VideoItemPlaceholder({
  embed,
  style,
  blur,
}: {
  embed: AppBskyEmbedVideo.View;
  style?: ImageStyle;
  blur?: boolean;
}) {
  const { bottom } = useSafeAreaInsets();
  const src = embed.thumbnail;
  let contentFit = isTallAspectRatio(embed.aspectRatio)
    ? ("cover" as const)
    : ("contain" as const);
  if (blur) {
    contentFit = "cover" as const;
  }
  return src ? (
    <Image
      accessibilityIgnoresInvertColors
      source={{ uri: src }}
      style={[
        {
          position: "absolute",
        },
        blur
          ? {
              top: 0,
              left: 0,
              right: 0,
              bottom: bottom + VIDEO_PLAYER_BOTTOM_INSET,
            }
          : {
              top: 0,
              left: 0,
              right: 0,
              bottom: bottom + VIDEO_PLAYER_BOTTOM_INSET,
            },
        style,
      ]}
      contentFit={contentFit}
      blurRadius={blur ? 100 : 0}
    />
  ) : null;
}

function VideoItemInner({
  player,
  embed,
}: {
  player: VideoPlayer;
  embed: AppBskyEmbedVideo.View;
}) {
  const { bottom } = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(!isAndroid);

  useEventListener(player, "timeUpdate", (evt) => {
    if (isAndroid && !isReady && evt.currentTime >= 0.05) {
      setIsReady(true);
    }
  });

  return (
    <VideoView
      accessible={false}
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: bottom + VIDEO_PLAYER_BOTTOM_INSET,
        },
        !isReady && { opacity: 0 },
      ]}
      player={player}
      nativeControls={false}
      contentFit={isTallAspectRatio(embed.aspectRatio) ? "cover" : "contain"}
      accessibilityIgnoresInvertColors
    />
  );
}

interface VideoItemProps {
  player?: VideoPlayer;
  isOwner?: boolean;
  post: AppBskyFeedDefs.PostView;
  embed: AppBskyEmbedVideo.View;
  active: boolean;
  adjacent: boolean;
  scrollGesture: NativeGesture;
  moderation?: ModerationDecision;
  feedContext: string | undefined;
}

function VideoItem(props: VideoItemProps) {
  const {
    player,
    post,
    embed,
    active,
    adjacent,
    isOwner,
    scrollGesture,
    moderation,
    feedContext,
  } = props;
  // const postShadow = usePostShadow(post);
  const { width, height } = useSafeAreaFrame();
  // const {sendInteraction} = useFeedFeedbackContext()

  // useEffect(() => {
  //   if (active) {
  //     sendInteraction({
  //       item: post.uri,
  //       event: 'app.bsky.feed.defs#interactionSeen',
  //       feedContext,
  //     })
  //   }
  // }, [active, post.uri, feedContext, sendInteraction])

  // TODO: high-performance android phones should also
  // be capable of rendering 3 video players, but currently
  // we can't distinguish between them
  const shouldRenderVideo =
    active ||
    Platform.select({
      ios: adjacent,
    });
  return (
    <View
      style={[{ height, width, position: "relative" }]}
      className="bg-black"
    >
      <VideoItemPlaceholder embed={embed} />
      {shouldRenderVideo && player && (
        <VideoItemInner player={player} embed={embed} />
      )}

      <Overlay isActive={active} isOwner={isOwner ?? false} post={post} />
    </View>
  );
}

export default memo(VideoItem);
/*
 * If the video is taller than 9:16
 */
function isTallAspectRatio(aspectRatio: AppBskyEmbedVideo.View["aspectRatio"]) {
  const videoAspectRatio =
    (aspectRatio?.width ?? 1) / (aspectRatio?.height ?? 1);
  return videoAspectRatio <= 9 / 16;
}
