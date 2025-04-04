import { MainFeedProps } from "./type";
import {
  ActivityIndicator,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useSession } from "@/state/session";
import { List } from "@/components/List";
import {
  AuthorFilter,
  FeedPostSliceItem,
  usePostFeedQuery,
} from "@/state/queries/post-feed";
import { AppBskyEmbedVideo } from "@atproto/api";
import { DISCOVER_FEED_URI, KNOWN_SHUTDOWN_FEEDS } from "@/constants";
import { useBreakpoints } from "@/hooks/breakpoints";
import { isIOS, isNative } from "@/platform/detection";
import { useWebMediaQueries } from "@/hooks/useWebMediaQueries";
import { useTrendingSettings } from "@/state/prefs/trending";
import { logEvent } from "@/statsig/statsig";
import { View } from "@/components/ui";
import PostFeedItem from "@/components/feed/post-feed-item";
import { FeedRow } from "./type";
import { useInitialNumToRender } from "@/hooks/useInitialNumToRender";
import VideoPostFeed from "./video-post-feed";
import { VideoFeedSourceContext } from "../video/type";

export default memo(function Impl(props: MainFeedProps) {
  const {
    feed,
    feedParams,
    ignoreFilterFor,
    style,
    enabled,
    pollInterval,
    disablePoll,
    scrollElRef,
    onScrolledDownChange,
    onHasNew,
    renderEmptyState,
    renderEndOfFeed,
    testID,
    headerOffset = 0,
    progressViewOffset,
    desktopFixedHeightOffset,
    ListHeaderComponent,
    extraData,
    savedFeedConfig,
    initialNumToRender: initialNumToRenderOverride,
    isVideoFeed = false,
  } = props || {};
  const [isPTRing, setIsPTRing] = useState(false);
  const lastFetchRef = useRef<number>(Date.now());
  const areVideoFeedsEnabled = isNative;
  const { hasSession } = useSession();

  const [feedType, feedUriOrActorDid, feedTab] = feed.split("|");

  const feedCacheKey = feedParams?.feedCacheKey;

  const opts = useMemo(
    () => ({ enabled, ignoreFilterFor }),
    [enabled, ignoreFilterFor]
  );

  const {
    data,
    isFetching,
    isFetched,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePostFeedQuery(feed, feedParams, opts);

  const lastFetchedAt = data?.pages[0].fetchedAt;
  if (lastFetchedAt) {
    lastFetchRef.current = lastFetchedAt;
  }

  const { gtMobile, gtTablet } = useBreakpoints();

  const isEmpty = useMemo(
    () => !isFetching && !data?.pages?.some((page) => page.slices.length),
    [isFetching, data]
  );

  const initialNumToRender = useInitialNumToRender();

  const { isDesktop } = useWebMediaQueries();

  const { trendingDisabled, trendingVideoDisabled } = useTrendingSettings();

  const showProgressIntersitial = !isDesktop;

  const feedItems: FeedRow[] = useMemo(() => {
    let feedKind: "following" | "discover" | "profile" | "thevids" | undefined;
    if (feedType === "following") {
      feedKind = "following";
    } else if (feedUriOrActorDid === DISCOVER_FEED_URI) {
      feedKind = "discover";
    } else if (
      feedType === "author" &&
      (feedTab === "posts_and_author_threads" ||
        feedTab === "posts_with_replies")
    ) {
      feedKind = "profile";
    }

    let arr: FeedRow[] = [];
    if (KNOWN_SHUTDOWN_FEEDS.includes(feedUriOrActorDid)) {
      arr.push({
        type: "feedShutdownMsg",
        key: "feedShutdownMsg",
      });
    }
    if (isFetched) {
      if (isError && isEmpty) {
        arr.push({
          type: "error",
          key: "error",
        });
      } else if (isEmpty) {
        arr.push({
          type: "empty",
          key: "empty",
        });
      } else if (data) {
        let sliceIndex = -1;

        if (isVideoFeed) {
          const videos: {
            item: FeedPostSliceItem;
            feedContext: string | undefined;
          }[] = [];
          for (const page of data.pages) {
            for (const slice of page.slices) {
              const item = slice.items.find(
                (item) => item.uri === slice.feedPostUri
              );
              if (item && AppBskyEmbedVideo.isView(item.post.embed)) {
                videos.push({ item, feedContext: slice.feedContext });
              }
            }
          }

          const rows: {
            item: FeedPostSliceItem;
            feedContext: string | undefined;
          }[][] = [];
          for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const item = video.item;
            const cols = 3;
            const rowItem = { item, feedContext: video.feedContext };
            if (i % cols === 0) {
              rows.push([rowItem]);
            } else {
              rows[rows.length - 1].push(rowItem);
            }
          }

          for (const row of rows) {
            sliceIndex++;
            arr.push({
              type: "videoGridRow",
              key: row.map((r) => r.item._reactKey).join("-"),
              items: row.map((r) => r.item),
              sourceFeedUri: feedUriOrActorDid,
              feedContexts: row.map((r) => r.feedContext),
            });
          }
        } else {
          for (const page of data?.pages) {
            for (const slice of page.slices) {
              sliceIndex++;

              if (hasSession) {
                if (feedKind === "discover") {
                  if (sliceIndex === 0) {
                    if (showProgressIntersitial) {
                      arr.push({
                        type: "interstitialProgressGuide",
                        key: "interstitial-" + sliceIndex + "-" + lastFetchedAt,
                      });
                    }
                    if (!gtTablet && !trendingDisabled) {
                      arr.push({
                        type: "interstitialTrending",
                        key:
                          "interstitial2-" + sliceIndex + "-" + lastFetchedAt,
                      });
                    }
                  } else if (sliceIndex === 15) {
                    if (areVideoFeedsEnabled && !trendingVideoDisabled) {
                      arr.push({
                        type: "interstitialTrendingVideos",
                        key: "interstitial-" + sliceIndex + "-" + lastFetchedAt,
                      });
                    }
                  } else if (sliceIndex === 30) {
                    arr.push({
                      type: "interstitialFollows",
                      key: "interstitial-" + sliceIndex + "-" + lastFetchedAt,
                    });
                  }
                } else if (feedKind === "profile") {
                  if (sliceIndex === 5) {
                    arr.push({
                      type: "interstitialFollows",
                      key: "interstitial-" + sliceIndex + "-" + lastFetchedAt,
                    });
                  }
                }
              }

              if (slice.isFallbackMarker) {
                arr.push({
                  type: "fallbackMarker",
                  key:
                    "sliceFallbackMarker-" + sliceIndex + "-" + lastFetchedAt,
                });
              } else if (slice.isIncompleteThread && slice.items.length >= 3) {
                const beforeLast = slice.items.length - 2;
                const last = slice.items.length - 1;
                arr.push({
                  type: "sliceItem",
                  key: slice.items[0]._reactKey,
                  slice: slice,
                  indexInSlice: 0,
                  showReplyTo: false,
                });
                arr.push({
                  type: "sliceViewFullThread",
                  key: slice._reactKey + "-viewFullThread",
                  uri: slice.items[0].uri,
                });
                arr.push({
                  type: "sliceItem",
                  key: slice.items[beforeLast]._reactKey,
                  slice: slice,
                  indexInSlice: beforeLast,
                  showReplyTo:
                    slice.items[beforeLast].parentAuthor?.did !==
                    slice.items[beforeLast].post.author.did,
                });
                arr.push({
                  type: "sliceItem",
                  key: slice.items[last]._reactKey,
                  slice: slice,
                  indexInSlice: last,
                  showReplyTo: false,
                });
              } else {
                for (let i = 0; i < slice.items.length; i++) {
                  arr.push({
                    type: "sliceItem",
                    key: slice.items[i]._reactKey,
                    slice: slice,
                    indexInSlice: i,
                    showReplyTo: i === 0,
                  });
                }
              }
            }
          }
        }
      }
      if (isError && !isEmpty) {
        arr.push({
          type: "loadMoreError",
          key: "loadMoreError",
        });
      }
    } else {
      if (isVideoFeed) {
        arr.push({
          type: "videoGridRowPlaceholder",
          key: "videoGridRowPlaceholder",
        });
      } else {
        arr.push({
          type: "loading",
          key: "loading",
        });
      }
    }

    return arr;
  }, [
    isFetched,
    isError,
    isEmpty,
    lastFetchedAt,
    data,
    feedType,
    feedUriOrActorDid,
    feedTab,
    hasSession,
    showProgressIntersitial,
    trendingDisabled,
    trendingVideoDisabled,
    gtTablet,
    gtMobile,
    isVideoFeed,
    areVideoFeedsEnabled,
  ]);

  const onRefresh = useCallback(async () => {
    logEvent("feed:refresh", {
      feedType: feedType,
      feedUrl: feed,
      reason: "pull-to-refresh",
    });
    setIsPTRing(true);
    try {
      await refetch();
      // onHasNew?.(false)
    } catch (err) {
      // logger.error('Failed to refresh posts feed', {message: err})
    }
    setIsPTRing(false);
  }, [refetch, setIsPTRing, feed, feedType]);

  const onEndReached = useCallback(async () => {
    if (isFetching || !hasNextPage || isError) return;

    logEvent("feed:endReached", {
      feedType: feedType,
      feedUrl: feed,
      itemCount: feedItems.length,
    });
    try {
      await fetchNextPage();
    } catch (err) {
      // logger.error('Failed to load more posts', {message: err})
    }
  }, [
    isFetching,
    hasNextPage,
    isError,
    fetchNextPage,
    feed,
    feedType,
    feedItems.length,
  ]);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View>
          <ActivityIndicator size="small" color="#0070F3" />
        </View>
      );
    }
    return <></>;
  }, [isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item: row, index: rowIndex }: ListRenderItemInfo<FeedRow>) => {
      if (row.type === "sliceItem") {
        const slice = row.slice;
        const indexInSlice = row?.indexInSlice;
        const item = slice.items[indexInSlice];
        return <PostFeedItem item={item} />;
      }
      if (row.type === "videoGridRow") {
        let sourceContext: VideoFeedSourceContext;
        if (feedType === "author") {
          sourceContext = {
            type: "author",
            did: feedUriOrActorDid,
            filter: feedTab as AuthorFilter,
          };
        } else {
          sourceContext = {
            type: "feedgen",
            uri: row.sourceFeedUri,
            sourceInterstitial: feedCacheKey ?? "none",
          };
        }
        return <VideoPostFeed items={row.items} context={sourceContext} />;
      }
      return null;
    },
    []
  );

  if (isFetching && !isPTRing && !isFetchingNextPage) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0070F3" />
      </View>
    );
  }
  return (
    <View testID={testID} className="flex-1">
      <List
        windowSize={9}
        data={feedItems}
        refreshing={isPTRing}
        extraData={extraData}
        onRefresh={onRefresh}
        renderItem={renderItem}
        onEndReachedThreshold={2}
        ref={scrollElRef}
        onEndReached={onEndReached}
        headerOffset={headerOffset}
        updateCellsBatchingPeriod={40}
        keyExtractor={(item) => item.key}
        ListFooterComponent={renderFooter}
        progressViewOffset={progressViewOffset}
        onScrolledDownChange={onScrolledDownChange}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={isIOS ? 5 : 1}
        // @ts-ignore our .web version only -prf
        desktopFixedHeight={
          desktopFixedHeightOffset ? desktopFixedHeightOffset : true
        }
        contentContainerStyle={{
          minHeight: Dimensions.get("window").height * 1.5,
        }}
        initialNumToRender={initialNumToRenderOverride ?? initialNumToRender}
      />
    </View>
  );
});
