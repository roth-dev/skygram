import { HStack, Text, View, VStack } from "../ui";
import { FeedPostSliceItem } from "@/state/queries/post-feed";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { useCallback } from "react";
import { formatNumberToKOrM } from "@/lib/numbers";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { Link } from "expo-router";
import { VideoFeedSourceContext } from "../video/type";

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
  const renderItem = useCallback((item: FeedPostSliceItem, index: number) => {
    const thumbnail = item.post.embed?.thumbnail as string;
    const sharedID = `shareID=${index}-${thumbnail}`;
    return (
      <VStack
        key={item._reactKey}
        className="w-1/3 h-[190px] mb-[0.9px] bg-neutral-50"
      >
        <Link
          href={{
            pathname: "/video-player",
            params: {
              type: "author",
              thumbnail: thumbnail,
              initialPostUri: item.uri,
              did: item.post.author.did,
              filter: "posts_with_video",
            },
          }}
          asChild
        >
          <Pressable
            style={{ flex: 1 }}
            onPressIn={async () => {
              await Image.prefetch(thumbnail);
            }}
          >
            <AnimatedImage
              sharedTransitionTag={sharedID}
              source={{ uri: thumbnail }}
              style={{ flex: 1 }}
              transition={800}
            />
          </Pressable>
        </Link>

        <View className="absolute bottom-2 left-2 bg-transparent">
          <HStack className="bg-transparent gap-1">
            <Ionicons
              size={16}
              name="heart"
              className="shadow-black shadow"
              color={Colors.light.background}
            />
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
  }, []);

  return <HStack className="gap-[0.9px]">{items.map(renderItem)}</HStack>;
}
