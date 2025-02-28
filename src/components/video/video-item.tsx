import { isAndroid } from "@/platform/detection";
import {
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  ModerationDecision,
} from "@atproto/api";
import { useEventListener } from "expo";
import { createVideoPlayer, VideoPlayer, VideoView } from "expo-video";
import { memo, useState } from "react";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  NativeGesture,
} from "react-native-gesture-handler";
import { Platform } from "react-native";
import { Text, View } from "../ui";
import { Image, ImageStyle } from "expo-image";
const VIDEO_PLAYER_BOTTOM_INSET = 57;

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
