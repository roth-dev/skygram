import Layout from "@/components/Layout";
import { List } from "@/components/List";
import { Text, View } from "@/components/ui";
import VideoItem, {
  createThreeVideoPlayers,
} from "@/components/video/video-item";
import { useNonReactiveCallback } from "@/hooks/useNonReactiveCallback";
import {
  AuthorFilter,
  FeedPostSliceItem,
  usePostFeedQuery,
} from "@/state/queries/post-feed";
import {
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  ModerationDecision,
} from "@atproto/api";
import { useIsFocused } from "@react-navigation/native";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { VideoPlayer } from "expo-video";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ListRenderItem,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { VideoFeedSourceContext, VideoItem as VideoItemType } from "./type";

type CurrentSource = {
  source: string;
} | null;

const viewabilityConfig = {
  itemVisiblePercentThreshold: 100,
  minimumViewTime: 0,
} satisfies ViewabilityConfig;

export default function VideoFeedScreen() {
  const params = useLocalSearchParams<VideoFeedSourceContext>();
  const [currentSources, setCurrentSources] = useState<
    [CurrentSource, CurrentSource, CurrentSource]
  >([null, null, null]);
  const [players, setPlayers] = useState<
    [VideoPlayer, VideoPlayer, VideoPlayer] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollGesture = useMemo(() => Gesture.Native(), []);
  const isFocused = useIsFocused();

  const defaultFeedDesc =
    "feedgen|at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/thevids";
  const feedDesc = useMemo(() => {
    switch (params.type) {
      case "feedgen":
        return `feedgen|${params.uri as string}` as const;
      case "author":
        return `author|${params.did as string}|${params.filter}` as const;
      default:
      case "feedgen":
        return defaultFeedDesc;
    }
  }, [params]);
  const {
    data,
    error,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = usePostFeedQuery(
    feedDesc,
    {
      feedCacheKey: "explore",
    }
    // params.type === "feedgen" && params.sourceInterstitial !== "none"
    //   ? { feedCacheKey: params.sourceInterstitial }
    //   : undefined
  );

  const videos = useMemo(() => {
    let vids =
      data?.pages.flatMap((page) => {
        const items: {
          _reactKey: string;
          moderation: ModerationDecision;
          post: AppBskyFeedDefs.PostView;
          video: AppBskyEmbedVideo.View;
          feedContext: string | undefined;
        }[] = [];
        for (const slice of page.slices) {
          const feedPost = slice.items.find(
            (item) => item.uri === slice.feedPostUri
          );
          if (feedPost && AppBskyEmbedVideo.isView(feedPost.post.embed)) {
            items.push({
              _reactKey: feedPost._reactKey,
              moderation: feedPost.moderation,
              post: feedPost.post,
              video: feedPost.post.embed,
              feedContext: slice.feedContext,
            });
          }
        }
        return items;
      }) ?? [];
    const startingVideoIndex = vids?.findIndex((video) => {
      return video.post.uri === params.initialPostUri;
    });
    if (vids && startingVideoIndex && startingVideoIndex > -1) {
      vids = vids.slice(startingVideoIndex);
    }
    return vids;
  }, [data, params.initialPostUri]);

  const updateVideoState = useCallback(
    (index: number) => {
      if (!videos.length) return;

      const prevSlice = videos.at(index - 1);
      const prevPost = prevSlice?.post;
      const prevEmbed = prevPost?.embed;
      const prevVideo =
        prevEmbed && AppBskyEmbedVideo.isView(prevEmbed)
          ? prevEmbed.playlist
          : null;
      const currSlice = videos.at(index);
      const currPost = currSlice?.post;
      const currEmbed = currPost?.embed;
      const currVideo =
        currEmbed && AppBskyEmbedVideo.isView(currEmbed)
          ? currEmbed.playlist
          : null;
      const currVideoModeration = currSlice?.moderation;
      const nextSlice = videos.at(index + 1);
      const nextPost = nextSlice?.post;
      const nextEmbed = nextPost?.embed;
      const nextVideo =
        nextEmbed && AppBskyEmbedVideo.isView(nextEmbed)
          ? nextEmbed.playlist
          : null;

      const prevPlayerCurrentSource = currentSources[(index + 2) % 3];
      const currPlayerCurrentSource = currentSources[index % 3];
      const nextPlayerCurrentSource = currentSources[(index + 1) % 3];

      if (!players) {
        const args = ["", "", ""] satisfies [string, string, string];
        if (prevVideo) args[(index + 2) % 3] = prevVideo;
        if (currVideo) args[index % 3] = currVideo;
        if (nextVideo) args[(index + 1) % 3] = nextVideo;
        const [player1, player2, player3] = createThreeVideoPlayers(args);

        setPlayers([player1, player2, player3]);

        if (currVideo) {
          const currPlayer = [player1, player2, player3][index % 3];
          currPlayer.play();
        }
      } else {
        const [player1, player2, player3] = players;

        const prevPlayer = [player1, player2, player3][(index + 2) % 3];
        const currPlayer = [player1, player2, player3][index % 3];
        const nextPlayer = [player1, player2, player3][(index + 1) % 3];

        if (prevVideo && prevVideo !== prevPlayerCurrentSource?.source) {
          prevPlayer.replace(prevVideo);
        }
        prevPlayer.pause();

        if (currVideo) {
          if (currVideo !== currPlayerCurrentSource?.source) {
            currPlayer.replace(currVideo);
          }
          if (
            currVideoModeration &&
            (currVideoModeration.ui("contentView").blur ||
              currVideoModeration.ui("contentMedia").blur)
          ) {
            currPlayer.pause();
          } else {
            currPlayer.play();
          }
        }

        if (nextVideo && nextVideo !== nextPlayerCurrentSource?.source) {
          nextPlayer.replace(nextVideo);
        }
        nextPlayer.pause();
      }

      const updatedSources: [CurrentSource, CurrentSource, CurrentSource] = [
        ...currentSources,
      ];
      if (prevVideo && prevVideo !== prevPlayerCurrentSource?.source) {
        updatedSources[(index + 2) % 3] = {
          source: prevVideo,
        };
      }
      if (currVideo && currVideo !== currPlayerCurrentSource?.source) {
        updatedSources[index % 3] = {
          source: currVideo,
        };
      }
      if (nextVideo && nextVideo !== nextPlayerCurrentSource?.source) {
        updatedSources[(index + 1) % 3] = {
          source: nextVideo,
        };
      }

      if (
        updatedSources[0]?.source !== currentSources[0]?.source ||
        updatedSources[1]?.source !== currentSources[1]?.source ||
        updatedSources[2]?.source !== currentSources[2]?.source
      ) {
        setCurrentSources(updatedSources);
      }
    },
    [videos, currentSources, players]
  );
  const updateVideoStateInitially = useNonReactiveCallback(() => {
    updateVideoState(currentIndex);
  });

  useFocusEffect(
    useCallback(() => {
      if (!players) {
        // create players, set sources, start playing
        updateVideoStateInitially();
      }
      return () => {
        if (players) {
          // manually release players when offscreen
          players.forEach((p) => p.release());
          setPlayers(null);
        }
      };
    }, [players, updateVideoStateInitially])
  );

  const renderItem: ListRenderItem<VideoItemType> = useCallback(
    ({ index, item }) => {
      const { post, video } = item;
      const player = players?.[index % 3];
      const currentSource = currentSources[index % 3];

      return (
        <VideoItem
          player={player}
          post={post}
          embed={video}
          active={
            isFocused &&
            index === currentIndex &&
            currentSource?.source === video.playlist
          }
          adjacent={index === currentIndex - 1 || index === currentIndex + 1}
          moderation={item.moderation}
          scrollGesture={scrollGesture}
          feedContext={item.feedContext}
        />
      );
    },
    [players, currentIndex, isFocused, currentSources, scrollGesture]
  );

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems[0] && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
        updateVideoState(newIndex);
      }
    },
    [updateVideoState]
  );

  function keyExtractor(item: FeedPostSliceItem) {
    return item._reactKey;
  }
  let screen = (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator />
    </View>
  );

  if (!isFetching) {
    screen = (
      <GestureDetector gesture={scrollGesture}>
        <List
          data={videos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={6}
          pagingEnabled={true}
          // ListFooterComponent={
          //   <ListFooter
          //     hasNextPage={hasNextPage}
          //     isFetchingNextPage={isFetchingNextPage}
          //     error={cleanError(error)}
          //     onRetry={fetchNextPage}
          //     height={height}
          //     showEndMessage
          //     renderEndMessage={renderEndMessage}
          //     style={[a.justify_center, a.border_0]}
          //   />
          // }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </GestureDetector>
    );
  }

  return <Layout.Tab>{screen}</Layout.Tab>;
}
