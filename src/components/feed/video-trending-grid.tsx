import { Text, View } from "@/components/ui";
import { FeedPostSliceItem } from "@/state/queries/post-feed";
import { useWindowDimensions } from "react-native";
import { useCallback, useMemo } from "react";
import { usePostFeedQuery } from "@/state/queries/post-feed";
import { VIDEO_FEED_URI } from "@/constants";
import { ActivityIndicator } from "react-native";
import { AppBskyEmbedVideo } from "@atproto/api";
import { ScrollView } from "../Views";
import { VideoGridItem } from "./video-post-feed";

const FEED_DESC = `feedgen|${VIDEO_FEED_URI}`;

const FEED_PARAMS: {
  feedCacheKey: "discover";
} = {
  feedCacheKey: "discover",
};

export default function VideoTrendingGrid() {
  const { width: screenWidth } = useWindowDimensions();
  const { data, isLoading } = usePostFeedQuery(FEED_DESC, FEED_PARAMS);

  const ITEM_WIDTH = screenWidth * 0.3; // 30% of screen width
  const ITEM_SPACING = 8; // gap between items

  const getItemLayout = useMemo(
    () => ({
      width: ITEM_WIDTH,
      margin: ITEM_SPACING / 2,
    }),
    [ITEM_WIDTH]
  );

  const items = useMemo(() => {
    return data?.pages
      .flatMap((page) => page.slices)
      .map((slice) => slice.items[0])
      .filter(Boolean)
      .filter((item) => AppBskyEmbedVideo.isView(item.post.embed))
      .slice(0, 10);
  }, [data]);

  const renderVideoItem = useCallback(
    (item: FeedPostSliceItem) => {
      return (
        <VideoGridItem
          className="rounded-md overflow-hidden"
          style={{
            width: getItemLayout.width,
            marginHorizontal: getItemLayout.margin,
          }}
          {...item}
          key={item._reactKey}
        />
      );
    },
    [getItemLayout]
  );

  if (isLoading) {
    return (
      <View className="h-32 items-center justify-center">
        <ActivityIndicator size="small" color="#0070F3" />
      </View>
    );
  }

  if (!items?.length) {
    return null;
  }

  return (
    <View className="flex flex-col gap-3 py-3 px-4 bg-white border-b border-neutral-200">
      <Text font="semiBold" className="text-lg">
        Trending Videos
      </Text>
      <ScrollView
        horizontal
        className="flex-1"
        contentContainerClassName="items-center"
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING} // Width + gap
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled={false}
        contentInset={{
          left: 0,
          right: 0,
        }}
        contentOffset={{ x: 0, y: 0 }}
        // For Android
        // contentContainerStyle={
        //   {
        //     // paddingHorizontal: ITEM_WIDT,
        //   }
        // }
      >
        {items.map(renderVideoItem)}
      </ScrollView>
    </View>
  );
}
