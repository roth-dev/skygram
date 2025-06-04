import { HStack, Text, View, VStack } from "../ui";
import { FeedPostSliceItem } from "@/state/queries/post-feed";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { memo, useCallback, useMemo } from "react";
import { formatNumberToKOrM } from "@/lib/numbers";
import Animated from "react-native-reanimated";
import { Link, LinkProps } from "expo-router";
import { VideoFeedSourceContext } from "../video/type";
import { cn } from "@/lib/utils";
import ExpoIcon from "../ui/icon";

interface Props {
  items: FeedPostSliceItem[];
  context: VideoFeedSourceContext;
}
export default function VideoPostFeed({ context, items }: Props) {
  if (context.type === "feedgen") {
    return <></>;
  }
  return <VideoGrid items={items} />;
}

interface VideoGridProps {
  cols?: number;
  items: FeedPostSliceItem[];
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

function VideoGrid({ items }: VideoGridProps) {
  const renderItem = useCallback((item: FeedPostSliceItem) => {
    return <VideoGridItem {...item} key={item._reactKey} />;
  }, []);

  return <HStack className="gap-[0.9px]">{items.map(renderItem)}</HStack>;
}

interface VideoGridItemProps extends FeedPostSliceItem {
  className?: string;
  style?: StyleProp<ViewStyle>;
}
export const VideoGridItem = memo(function Impl({
  className,
  style,
  ...item
}: VideoGridItemProps) {
  const thumbnail = item.post.embed?.thumbnail as string;
  const sharedID = `trending-video-${thumbnail}`;

  const linkParams = useMemo(
    () => ({
      pathname: "/video-player",
      params: {
        sharedID,
        type: "author",
        thumbnail,
        initialPostUri: item.uri,
        did: item.post.author.did,
        filter: "posts_with_video",
      },
    }),
    [sharedID, thumbnail, item.uri, item.post.author.did]
  );
  return (
    <VStack
      style={style}
      className={cn("w-1/3 h-[190px] mb-[0.9px] bg-neutral-50", className)}
    >
      <Link href={linkParams as LinkProps["href"]} asChild>
        <Pressable style={{ flex: 1 }}>
          <AnimatedImage
            sharedTransitionTag={sharedID}
            source={{ uri: thumbnail }}
            contentFit="cover"
            style={{ flex: 1 }}
            transition={800}
          />
        </Pressable>
      </Link>

      <View className="absolute bottom-2 left-2 bg-transparent">
        <HStack className="bg-transparent gap-1">
          <ExpoIcon name="heart" className="shadow-black shadow" />
          <Text
            font="semiBold"
            size="sm"
            className="text-white shadow shadow-black"
          >
            {formatNumberToKOrM(item.post.likeCount ?? 0)}
          </Text>
        </HStack>
      </View>
    </VStack>
  );
});
